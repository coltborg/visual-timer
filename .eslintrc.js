module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [0],
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    'import/no-unresolved': 'off',
    'no-unused-expressions': ['error', { 'allowTernary': true }],
    'no-param-reassign': 0,
    'quote-props': ['error', 'consistent'],
    'no-return-assign': 'off',
    // vue rules
    "vue/order-in-components": ["error", {
      "order": [
        "el",
        "name",
        "parent",
        "functional",
        ["delimiters", "comments"],
        ["components", "directives", "filters"],
        "extends",
        "mixins",
        "inheritAttrs",
        "model",
        ["props", "propsData"],
        "data",
        "computed",
        "watch",
        "LIFECYCLE_HOOKS",
        "methods",
        ["template", "render"],
        "renderError"
      ]
    }],
    'vue/html-closing-bracket-newline': ['error', {
      'singleline': 'never',
      'multiline': 'never'
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      'startTag': 'never',
      'endTag': 'never',
      'selfClosingTag': 'always'
    }],
    'vue/script-indent': ['error', 2, {
      'baseIndent': 0,
      'switchCase': 1,
      'ignores': []
    }],
    'vue/max-attributes-per-line': [2, {
      'singleline': 1,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }],
  }
}
