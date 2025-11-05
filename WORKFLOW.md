# Workflow Guide - Sociedade do Descarte Catalogue

## Your Simple Workflow Going Forward:

### 1. Edit your original files
Edit the source files as needed:
- `css/styles.css` for styling changes
- `js/script.js` for functionality changes

### 2. Run the minification script
```bash
./minify.sh
```

This will automatically:
- Minify CSS (styles.css → styles.min.css)
- Minify JavaScript (script.js → script.min.js)
- Show you size reduction statistics

### 3. Commit and push
```bash
git add css/styles.min.css js/script.min.js
git commit -m "Update styles/scripts"
git push
```

That's it! Netlify will automatically deploy the updated minified files.

---

## Your Art Catalogue Status:

✅ **Secure** - Security headers implemented
✅ **Optimized for performance** - 21% file size reduction
✅ **Clean** - No unused files
✅ **Easy to maintain** - Simple workflow with automation

Everything is on GitHub and ready to go! 🚀

---

## Need Help?

- Original files (for editing): `css/styles.css`, `js/script.js`
- Minified files (for production): `css/styles.min.css`, `js/script.min.js`
- Minification script: `./minify.sh`
