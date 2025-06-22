#!/bin/bash

# Exit on error
set -e

echo "🛠 Building React app..."
npm run build

# Paths
SRC_DIR="dist"
DEST_DIR="../public"

# Check if build folder exists
if [ ! -d "$SRC_DIR" ]; then
  echo "❌ Error: Source folder '$SRC_DIR' does not exist."
  exit 1
fi

# Copy build files
echo "📂 Copying build files to Laravel public folder..."
cp -r $SRC_DIR/* $DEST_DIR/

echo "✅ Build files copied successfully to Laravel's public folder!"

