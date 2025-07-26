# Steps to Rename Repository to portkeeper

## 1. Rename on GitHub
1. Go to: https://github.com/ahmadzein/portManager/settings
2. Change repository name from `portManager` to `portkeeper`
3. Click "Rename"

## 2. Update Local Repository
After renaming on GitHub, run these commands locally:

```bash
# Update the remote URL
git remote set-url origin https://github.com/ahmadzein/portkeeper.git

# Verify the change
git remote -v

# Push to verify connection
git push origin main
```

## 3. Update Local Folder Name (Optional)
If you want to rename your local folder too:

```bash
# Go to parent directory
cd ~/github/

# Rename the folder
mv portManager portkeeper

# Enter the renamed folder
cd portkeeper
```

## 4. Things that are Already Updated
✅ package.json - Already points to portkeeper
✅ README.md - Already uses portkeeper
✅ Website - Already branded as Port Keeper
✅ Documentation - Already updated
✅ CLI help text - Already shows portkeeper.net

## 5. Benefits of Renaming
- Consistent branding everywhere
- Matches npm package name
- Cleaner URLs
- No confusion about project name

## Note
GitHub automatically redirects from the old URL to the new one, so:
- Old links will still work
- Clones will continue to function
- No breaking changes for users

The rename is safe and recommended for consistency!