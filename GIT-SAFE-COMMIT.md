# ✅ Safe Git Commit Checklist

## Before Every Commit - Check This!

### 1. Check What You're Committing
```bash
git status
```

### 2. Verify No .env Files
```bash
# This should return NOTHING
git ls-files | grep "\.env"
```

### 3. Check for Secrets
```bash
# Search for common secret patterns (should return nothing or only placeholders)
grep -r "password\|secret\|key\|token" . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  --exclude="*.example" \
  --exclude="*.template" \
  | grep -v "your_" \
  | grep -v "YOUR_" \
  | grep -v "placeholder"
```

## ✅ Safe to Commit

- ✅ Code files (`.ts`, `.tsx`, `.js`, `.jsx`)
- ✅ Configuration files (`.json`, `.toml`, `.config.js`)
- ✅ Documentation (`.md` files with placeholders)
- ✅ `.env.example` (with placeholders)
- ✅ `.env.template` (with placeholders)

## ❌ NEVER Commit

- ❌ `.env.local`
- ❌ `.env`
- ❌ `.env.production`
- ❌ Any file with actual passwords/keys
- ❌ `node_modules/`
- ❌ `.next/`

## Quick Safety Check

Before pushing, run:
```bash
# Check for .env files in staging
git diff --cached --name-only | grep "\.env"

# If anything shows up, remove it:
git reset HEAD <filename>
```

## If .env File is Already Tracked

If Git is tracking a `.env` file:

```bash
# Remove from Git (but keep local file)
git rm --cached .env.local
git rm --cached .env

# Commit the removal
git commit -m "Remove .env files from Git tracking"

# Verify it's now ignored
git status
```

## Your .gitignore is Now Protected

Your `.gitignore` now includes:
- `.env*` (all .env files)
- Exceptions for `.env.example` and `.env.template` (safe to commit)

