# 🔒 Security Checklist - Before Pushing to GitHub

## ✅ Pre-Commit Checklist

Before committing and pushing to GitHub, ALWAYS check:

### 1. Environment Files
- [ ] `.env.local` is NOT in the commit
- [ ] `.env` is NOT in the commit
- [ ] `.env.production` is NOT in the commit
- [ ] Any file with `.env` in the name is NOT in the commit

### 2. Secrets in Code
- [ ] No hardcoded passwords in code files
- [ ] No hardcoded API keys in code files
- [ ] No hardcoded secret tokens in code files
- [ ] All secrets use `process.env.VARIABLE_NAME`

### 3. Documentation Files
- [ ] No real passwords in `.md` files
- [ ] No real API keys in `.md` files
- [ ] Use placeholders like `your_password_here` or `YOUR_API_KEY`
- [ ] Example files use placeholders, not real values

### 4. Configuration Files
- [ ] No secrets in `next.config.js`
- [ ] No secrets in `package.json`
- [ ] No secrets in any config files

### 5. Git Status Check
```bash
# Before committing, run:
git status

# Check what files are being added
git diff --cached

# Search for common secret patterns
grep -r "password\|secret\|key\|token" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git | grep -v "your_" | grep -v "YOUR_" | grep -v "placeholder"
```

## 🚨 What to NEVER Commit

❌ **NEVER commit these:**
- `.env.local`
- `.env`
- `.env.production`
- Any file with actual passwords
- Any file with actual API keys
- Any file with actual secret tokens
- Private keys (`.pem`, `.key` files)
- Database credentials
- OAuth client secrets
- Payment gateway secrets

✅ **Safe to commit:**
- `.env.example` (with placeholders)
- Code files (using `process.env`)
- Documentation (with placeholders)
- Configuration templates

## 🔍 Quick Security Scan

Run this before every commit:

```bash
# Check for common secret patterns
grep -rE "(password|secret|key|token)\s*=\s*['\"][^'\"]{8,}" . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  --exclude="*.example" \
  --exclude="*.template"

# If any results, review them carefully!
```

## 📝 Safe Template Format

When creating example/template files, use:

```env
# ✅ GOOD - Uses placeholder
ZOHO_SMTP_PASS=your_zoho_app_password_here

# ❌ BAD - Uses real password
ZOHO_SMTP_PASS=2HWDhHvejDvm
```

## 🛡️ Protection Measures

1. **`.gitignore` is properly configured** ✅ (already updated)
2. **Use `.env.example` files** with placeholders
3. **Review `git status` before committing**
4. **Use GitGuardian or similar tools** to scan before pushing
5. **Rotate secrets immediately** if exposed

## ⚠️ If You Accidentally Commit Secrets

1. **IMMEDIATELY rotate the exposed secret**
2. **Remove from Git history** (see `REMOVE-SECRETS-FROM-GIT.md`)
3. **Force push** (if safe to do so)
4. **Notify team** if working with others
5. **Monitor for unauthorized access**

