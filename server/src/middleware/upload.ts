import fs from 'fs'
import path from 'path'
import { Request } from 'express'
import multer from 'multer'

import { config } from '../config'

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use configurable uploads directory
    const productsDir = path.join(config.uploadsDir, 'products')

    // Ensure directory exists
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true })
    }

    cb(null, productsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    cb(null, filename)
  },
})

// File filter to only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
  }
}

// Configure multer
export const uploadProductImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Maximum 5 files
  },
}).array('images', 5) // 'images' is the field name, max 5 files
