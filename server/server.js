import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Diagnosis, MaintenanceReminder, User } from './models.js'
import { asyncHandler, errorHandler, requireAuth, upload, validateBody } from './middleware.js'
import { configureCloudinary, generateDiagnosis, uploadImage } from './services.js'

const app = express()
const port = Number(process.env.PORT || 5000)
configureCloudinary(process.env)

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }))

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, location: user.location, bio: user.bio, preferences: user.preferences })
const tokenFor = (user) => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
const parseJson = (value, fallback = {}) => { try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback) } catch { return fallback } }

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'repair-before-replace-api' }))

app.post('/api/auth/register', validateBody(['name', 'email', 'password']), asyncHandler(async (req, res) => {
  if (req.body.password.length < 8) return res.status(422).json({ message: 'Password must be at least 8 characters.' })
  const email = req.body.email.toLowerCase().trim()
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ message: 'An account with that email already exists.' })
  const passwordHash = await bcrypt.hash(req.body.password, 12)
  const user = await User.create({ name: req.body.name, email, passwordHash })
  res.status(201).json({ token: tokenFor(user), user: publicUser(user) })
}))

app.post('/api/auth/login', validateBody(['email', 'password']), asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase().trim() }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' })
  res.json({ token: tokenFor(user), user: publicUser(user) })
}))
app.post('/api/auth/logout', requireAuth, (_req, res) => res.json({ message: 'Signed out.' }))
app.get('/api/auth/me', requireAuth, asyncHandler(async (req, res) => res.json({ user: publicUser(await User.findById(req.userId)) })))

app.get('/api/profile', requireAuth, asyncHandler(async (req, res) => res.json({ user: publicUser(await User.findById(req.userId)) })))
app.patch('/api/profile', requireAuth, asyncHandler(async (req, res) => {
  const allowed = ['name', 'email', 'location', 'bio', 'preferences']
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)))
  if (updates.email) updates.email = updates.email.toLowerCase().trim()
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true })
  res.json({ user: publicUser(user) })
}))

app.get('/api/dashboard', requireAuth, asyncHandler(async (req, res) => {
  const [diagnoses, repaired, saved] = await Promise.all([
    Diagnosis.countDocuments({ user: req.userId }),
    Diagnosis.countDocuments({ user: req.userId, status: 'repaired' }),
    Diagnosis.aggregate([{ $match: { user: new mongoose.Types.ObjectId(req.userId) } }, { $group: { _id: null, total: { $sum: { $ifNull: ['$result.estimatedSavings', 0] } } } }]),
  ])
  res.json({ stats: { diagnosed: diagnoses, repaired, moneySaved: saved[0]?.total || 0, wasteAvoidedKg: Math.round(repaired * 2.4 * 10) / 10 } })
}))

app.post('/api/diagnoses', requireAuth, upload.single('image'), asyncHandler(async (req, res) => {
  const required = ['category', 'name', 'age', 'problem']
  const missing = required.filter((field) => !req.body[field]?.trim())
  if (missing.length) return res.status(422).json({ message: 'Complete the item details before diagnosing.', fields: missing })
  const image = req.file ? await uploadImage(req.file.buffer) : { url: '', publicId: '' }
  const input = { ...req.body, answers: parseJson(req.body.answers) }
  const diagnosis = await Diagnosis.create({ ...input, user: req.userId, imageUrl: image.url, imagePublicId: image.publicId, answers: input.answers, result: generateDiagnosis(input) })
  res.status(201).json({ diagnosis })
}))
app.get('/api/diagnoses', requireAuth, asyncHandler(async (req, res) => {
  const filter = { user: req.userId }
  if (req.query.category) filter.category = req.query.category
  if (req.query.status) filter.status = req.query.status
  const diagnoses = await Diagnosis.find(filter).sort({ createdAt: -1 }).limit(100)
  res.json({ diagnoses })
}))
app.get('/api/diagnoses/:id', requireAuth, asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.findOne({ _id: req.params.id, user: req.userId })
  if (!diagnosis) return res.status(404).json({ message: 'Diagnosis not found.' })
  res.json({ diagnosis })
}))
app.patch('/api/diagnoses/:id/status', requireAuth, asyncHandler(async (req, res) => {
  if (!['repaired', 'replaced'].includes(req.body.status)) return res.status(422).json({ message: 'Status must be repaired or replaced.' })
  const diagnosis = await Diagnosis.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { status: req.body.status }, { new: true })
  if (!diagnosis) return res.status(404).json({ message: 'Diagnosis not found.' })
  res.json({ diagnosis })
}))
app.post('/api/diagnoses/:id/feedback', requireAuth, asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { feedback: { rating: req.body.rating, note: req.body.note } }, { new: true, runValidators: true })
  if (!diagnosis) return res.status(404).json({ message: 'Diagnosis not found.' })
  res.json({ diagnosis })
}))

app.get('/api/maintenance', requireAuth, asyncHandler(async (req, res) => res.json({ reminders: await MaintenanceReminder.find({ user: req.userId }).sort({ dueDate: 1 }) })))
app.post('/api/maintenance', requireAuth, validateBody(['name', 'item', 'dueDate']), asyncHandler(async (req, res) => res.status(201).json({ reminder: await MaintenanceReminder.create({ ...req.body, user: req.userId }) })))
app.patch('/api/maintenance/:id', requireAuth, asyncHandler(async (req, res) => {
  const reminder = await MaintenanceReminder.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true })
  if (!reminder) return res.status(404).json({ message: 'Reminder not found.' })
  res.json({ reminder })
}))
app.delete('/api/maintenance/:id', requireAuth, asyncHandler(async (req, res) => {
  const deleted = await MaintenanceReminder.findOneAndDelete({ _id: req.params.id, user: req.userId })
  if (!deleted) return res.status(404).json({ message: 'Reminder not found.' })
  res.status(204).end()
}))

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI).then(() => app.listen(port, () => console.log(`API listening on http://localhost:${port}`))).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1) })
}

export default app
