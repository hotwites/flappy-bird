#!/bin/bash
set -euo pipefail

echo "=== Running Flappy Bird Test Suite ==="

cd "$(dirname "$0")/../tests"

echo "Installing dependencies..."
npm install --silent

echo "Running tests..."
npm test

echo "=== All tests passed ==="
