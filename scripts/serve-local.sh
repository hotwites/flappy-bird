#!/bin/bash
set -euo pipefail

echo "=== Starting local dev server ==="

cd "$(dirname "$0")/.."

# Use npx serve (no install needed) or python fallback
if command -v npx &>/dev/null; then
    echo "Serving at http://localhost:3000"
    echo "Press Ctrl+C to stop"
    npx serve . --listen 3000 --no-clipboard
elif command -v python3 &>/dev/null; then
    echo "Serving at http://localhost:3000"
    echo "Press Ctrl+C to stop"
    python3 -m http.server 3000
else
    echo "ERROR: Neither npx nor python3 found. Install Node.js or Python."
    exit 1
fi
