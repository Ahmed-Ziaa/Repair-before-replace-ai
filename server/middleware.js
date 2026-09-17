import jwt from 'jsonwebtoken'
import multer from 'multer'

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, callback) => callback(null, file.mimetype.startsWith('image/')) })

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Authentication required.' })
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).sub
    next()
  } catch {
    res.status(401).json({ message: 'Session expired. Please sign in again.' })
  }
}

export function validateBody(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => typeof req.body[field] !== 'string' || !req.body[field].trim())
    if (missing.length) return res.status(422).json({ message: 'Please complete all required fields.', fields: missing })
    next()
  }
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof multer.MulterError || error.code === 'LIMIT_FILE_SIZE') return res.status(422).json({ message: 'Images must be 10MB or smaller.' })
  if (error.code === 11000) return res.status(409).json({ message: 'An account with that email already exists.' })
  const status = error.status || 500
  res.status(status).json({ message: status === 500 ? 'Something went wrong on the server.' : error.message })
}
