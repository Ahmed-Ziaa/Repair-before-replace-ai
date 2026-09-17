import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  started: String,
  changed: String,
  tried: String,
}, { _id: false })

const diagnosisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  name: { type: String, required: true, trim: true },
  brand: { type: String, trim: true, default: '' },
  model: { type: String, trim: true, default: '' },
  age: { type: String, required: true },
  problem: { type: String, required: true, trim: true },
  answers: { type: answerSchema, default: {} },
  result: {
    summary: String,
    confidence: Number,
    causes: [{ title: String, score: Number, detail: String }],
    repairability: String,
    difficulty: String,
    repairCost: { min: Number, max: Number },
    replacementCost: { min: Number, max: Number },
    repairTime: String,
    tools: [String],
    safetyWarnings: [String],
    steps: [String],
    recommendation: String,
    estimatedSavings: Number,
  },
  status: { type: String, enum: ['pending', 'repaired', 'replaced'], default: 'pending' },
  feedback: { rating: { type: Number, min: 1, max: 5 }, note: { type: String, trim: true, maxlength: 1000 } },
}, { timestamps: true })

diagnosisSchema.index({ user: 1, createdAt: -1 })

const maintenanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  item: { type: String, required: true, trim: true, maxlength: 120 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'due', 'completed'], default: 'upcoming' },
  notes: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  location: { type: String, trim: true, default: '' },
  bio: { type: String, trim: true, maxlength: 300, default: '' },
  preferences: { reminders: { type: Boolean, default: true }, updates: { type: Boolean, default: true }, newsletter: { type: Boolean, default: false } },
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
export const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema)
export const MaintenanceReminder = mongoose.model('MaintenanceReminder', maintenanceSchema)
