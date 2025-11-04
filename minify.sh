#!/bin/bash

# Minification script for Sociedade do Descarte catalogue
# This script minifies CSS and JavaScript files for production

echo "🔧 Starting minification process..."
echo ""

# Check if required tools are available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js first."
    exit 1
fi

# Minify CSS
echo "📦 Minifying CSS..."
npx cleancss -o css/styles.min.css css/styles.css
if [ $? -eq 0 ]; then
    CSS_ORIGINAL=$(wc -c < css/styles.css | tr -d ' ')
    CSS_MINIFIED=$(wc -c < css/styles.min.css | tr -d ' ')
    CSS_SAVED=$((CSS_ORIGINAL - CSS_MINIFIED))
    CSS_PERCENT=$(awk "BEGIN {printf \"%.1f\", ($CSS_SAVED * 100 / $CSS_ORIGINAL)}")
    echo "   ✅ CSS minified: $CSS_ORIGINAL bytes → $CSS_MINIFIED bytes (saved $CSS_PERCENT%)"
else
    echo "   ❌ CSS minification failed"
    exit 1
fi

# Minify JavaScript
echo "📦 Minifying JavaScript..."
npx terser js/script.js -o js/script.min.js --compress --mangle
if [ $? -eq 0 ]; then
    JS_ORIGINAL=$(wc -c < js/script.js | tr -d ' ')
    JS_MINIFIED=$(wc -c < js/script.min.js | tr -d ' ')
    JS_SAVED=$((JS_ORIGINAL - JS_MINIFIED))
    JS_PERCENT=$(awk "BEGIN {printf \"%.1f\", ($JS_SAVED * 100 / $JS_ORIGINAL)}")
    echo "   ✅ JavaScript minified: $JS_ORIGINAL bytes → $JS_MINIFIED bytes (saved $JS_PERCENT%)"
else
    echo "   ❌ JavaScript minification failed"
    exit 1
fi

# Summary
echo ""
echo "✨ Minification complete!"
TOTAL_SAVED=$((CSS_SAVED + JS_SAVED))
echo "   Total savings: $TOTAL_SAVED bytes"
echo ""
echo "📝 Next steps:"
echo "   1. Test your changes locally"
echo "   2. git add css/styles.min.css js/script.min.js"
echo "   3. git commit -m 'Update minified files'"
echo "   4. git push"
