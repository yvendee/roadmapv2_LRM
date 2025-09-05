#!/bin/bash

# Exit on error
set -e

echo "📦 Adding changes..."
git add .

echo "📝 Committing changes..."
git commit -m "update"

echo "🚀 Pushing to origin main..."
git push origin main

echo "✅ Done!"
