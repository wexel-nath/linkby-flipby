#!/usr/bin/env sh
set -e

# Check if APP_PREFIX is set
: "${APP_PREFIX:?APP_PREFIX must be set (e.g. APP_PREFIX='APP_PREFIX_')}"

# Display the current directory being scanned
echo "Scanning directory: /app/dist"

# Iterate through each environment variable that starts with APP_PREFIX
env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    # Display the variable being replaced
    echo "  • Replacing ${key} → ${value}"

    # Use find and sed to replace the variable in all files within the directory
    find "/app/dist" -type f \
        -exec sed -i "s|${key}|${value}|g" {} +
done

# Run the web-app
npm run preview -- \
    --host 0.0.0.0 \
    --port 8080
