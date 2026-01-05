#!/bin/bash
# Pre-commit safety check script
# Run this before committing: bash PRE-COMMIT-CHECK.sh

echo "🔍 Checking for .env files in Git..."
ENV_FILES=$(git ls-files | grep "\.env" | grep -v "\.example" | grep -v "\.template")
if [ -z "$ENV_FILES" ]; then
    echo "✅ No .env files tracked by Git (safe!)"
else
    echo "❌ DANGER: .env files are tracked by Git!"
    echo "$ENV_FILES"
    echo ""
    echo "Remove them with: git rm --cached <filename>"
    exit 1
fi

echo ""
echo "🔍 Checking for secrets in staged files..."
SECRETS=$(git diff --cached | grep -iE "(password|secret|key|token)\s*=\s*['\"][^'\"]{8,}" | grep -v "your_" | grep -v "YOUR_" | grep -v "placeholder")
if [ -z "$SECRETS" ]; then
    echo "✅ No obvious secrets in staged files"
else
    echo "⚠️  WARNING: Possible secrets found in staged files!"
    echo "$SECRETS"
    echo ""
    echo "Review carefully before committing!"
fi

echo ""
echo "✅ Pre-commit check complete!"

