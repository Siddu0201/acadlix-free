#!/bin/bash

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Kill any running hot dev processes
pkill -f "npm run start:hot:" 2>/dev/null

# Start appropriate command
if [ "$BRANCH" == "yuvayana" ]; then
  echo "✅ Switched to FREE branch, starting dev server..."
  npm run start:hot:free
elif [ "$BRANCH" == "Pro" ]; then
  echo "✅ Switched to PREMIUM branch, starting dev server..."
  npm run start:hot:premium
else
  echo "⚠️  Unknown branch: $BRANCH — no dev server started."
fi