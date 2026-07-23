#!/bin/bash
set -euo pipefail

echo "======================================"
echo "  Flappy Bird — Local CI Pipeline"
echo "======================================"

SCRIPT_DIR="$(dirname "$0")"

echo ""
echo "--- Step 1: Validate game files ---"
bash "$SCRIPT_DIR/validate-files.sh"

echo ""
echo "--- Step 2: Run test suite ---"
bash "$SCRIPT_DIR/test.sh"

echo ""
echo "======================================"
echo "  CI PIPELINE PASSED ✅"
echo "======================================"
