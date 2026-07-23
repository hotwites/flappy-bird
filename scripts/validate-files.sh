#!/bin/bash
set -euo pipefail

echo "=== Validating required game files ==="

ROOT="$(dirname "$0")/.."
ERRORS=0

required_files=(
    "index.html"
    "css/style.css"
    "src/bird.js"
    "src/pipes.js"
    "src/collision.js"
    "src/input.js"
    "src/renderer.js"
    "src/game.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$ROOT/$file" ]; then
        echo "  [OK] $file"
    else
        echo "  [MISSING] $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Verify CSP meta tag in index.html
if grep -q "Content-Security-Policy" "$ROOT/index.html"; then
    echo "  [OK] CSP meta tag present"
else
    echo "  [MISSING] CSP meta tag in index.html"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
    echo "=== All files validated successfully ==="
else
    echo "=== VALIDATION FAILED: $ERRORS missing file(s) ==="
    exit 1
fi
