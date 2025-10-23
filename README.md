# linkby-flipby

A marketplace application for buying and selling products with counter-offers.

## Getting Started

### Scripts

The following scripts are available:

#### `./scripts/build.sh`

Builds Docker images for both the server and web-app components.

#### `./scripts/run.sh`

Starts the complete environment:

1. Applies database migrations
2. Starts the server (API backend)
3. Starts the web-app (React frontend)

#### `./scripts/destroy.sh`

Completely tears down the environment:

- Stops and removes all containers
- Removes volumes (including database data)
- Removes Docker images
- Cleans up orphaned containers and unused Docker resources

### Quick Start

```bash
./scripts/build.sh && ./scripts/run.sh
```

### Application Access

Once started, the application will be available at:

- **Web App**: http://localhost:3001
- **API Server**: http://localhost:3000
- **Database**: localhost:5432

## Configuration

### Environment Variables (.env file)

You can customize the application by creating a `.env` file in the root directory with the following variables:

### Example .env file

```bash
FLIPBY_DB_PORT='5432'
FLIPBY_SERVER_PORT='3000'
FLIPBY_WEB_APP_PORT='3001'
```

## Assumptions

- Anonymous (not logged-in) users can browse and view product listings, including viewing product details. However, they must log in to perform any actions, such as creating new listings, making offers, or reserving/buying products. Any attempt to access a protected function will prompt the user to log in.
- Price currency will be captured in the data model as it may be important for future functionality, but won't be displayed in the UI currently. The assumption is that the majority of sales on a marketplace like this will be done locally within the same currency region.

## Limitations

### Tests

Due to time constraints, comprehensive test coverage was not implemented. This includes:

- Unit tests for components and services
- Integration tests for API endpoints
- End-to-end testing for user workflows

### Image Hosting

Currently, images are stored locally on the server filesystem.

**Recommendation**: For production deployment, migrate to a cloud storage solution with CDN integration for better performance and scalability.
