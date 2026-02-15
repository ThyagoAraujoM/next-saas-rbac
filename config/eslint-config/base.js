cat > (config / eslint - config / base.js) << 'EOF'
module.exports = {
  extends: ['@rocketseat/eslint-config'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
