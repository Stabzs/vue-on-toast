// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // set maximum line characters
    'max-len': [2, 80, 4, {
      'ignoreUrls': true,
      'ignoreStrings': true
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    //'indent': 2,
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    'no-return-assign': 0,
    // disallow indentation using both tabs and spaces
    'no-mixed-spaces-and-tabs': 2,
    // ensure consistent 2 space indentation and indent cases under switch
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
    'object-curly-spacing': [2, 'always'],
    'max-statements': [2, 24]
  }
}
