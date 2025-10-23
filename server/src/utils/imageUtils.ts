import path from 'path'

import { config } from '../config'

/**
 * Convert file paths to full URLs for serving images
 * @param filePaths Array of file paths from multer upload
 * @returns Array of full URLs
 */
export const convertFilePathsToUrls = (filePaths: string[]): string[] => {
  return filePaths.map((filePath) => {
    // Get relative path from uploads directory
    const relativePath = path.relative(config.uploadsDir, filePath)
    // Convert to URL: baseUrl + /uploads + relativePath
    return `${config.baseUrl}/uploads/${relativePath}`
  })
}
