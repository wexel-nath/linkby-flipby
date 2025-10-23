# Configuration Guide

## Environment Variables

### Docker Compose Variables

These variables are used in `docker-compose.yml`:

- `FLIPBY_DB_NAME` - Database name (default: flipby_db)
- `FLIPBY_DB_PORT` - Database port (default: 5432)
- `FLIPBY_SERVER_PORT` - Server port (default: 3000)
- `FLIPBY_WEB_APP_PORT` - Web app port (default: 3001)
- `FLIPBY_UPLOADS_DIR` - Local uploads directory for volume mount (default: ./uploads)

### Server Environment Variables

These are set automatically in docker-compose or can be configured manually:

- `UPLOADS_DIR` - Server uploads directory (default: ./uploads, docker: /app/uploads)
- `BASE_URL` - Base URL for serving images (auto-configured in docker-compose)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration time (default: 1d)
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment (development/production)

## Upload Configuration

### How it Works

1. Files are uploaded to `{uploadsDir}/products/` directory
2. File paths are converted to full URLs before saving to database
3. Database stores complete URLs (e.g., `http://localhost:3000/uploads/products/filename.jpg`)
4. API responses return ready-to-use image URLs

### Local Development

```bash
# Default uploads directory
./uploads/products/

# Images served at
http://localhost:3000/uploads/products/filename.jpg
```

### Docker Configuration

```bash
# Container uploads directory
/app/uploads/products/

# Volume mount (configurable)
${FLIPBY_UPLOADS_DIR:-./uploads}:/app/uploads

# Images served at
http://localhost:${FLIPBY_SERVER_PORT}/uploads/products/filename.jpg
```

### Production Setup

1. Set `BASE_URL` environment variable to your domain
2. Configure `UPLOADS_DIR` to persistent storage location
3. Ensure uploads directory has proper permissions
4. Consider using a CDN for better performance

## Example Configuration

### .env file (for local development)

```bash
FLIPBY_DB_NAME=flipby_db
FLIPBY_DB_PORT=5432
FLIPBY_SERVER_PORT=3000
FLIPBY_WEB_APP_PORT=3001
FLIPBY_UPLOADS_DIR=./uploads
```

### Docker Production Override

```yaml
# docker-compose.prod.yml
services:
  server:
    environment:
      BASE_URL: 'https://your-domain.com'
      UPLOADS_DIR: '/var/uploads'
    volumes:
      - '/var/uploads:/var/uploads'
```
