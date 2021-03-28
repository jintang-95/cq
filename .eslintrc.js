module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],

  parserOptions: {
    ecmaVersion: 2020,
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'prettier/prettier': [
      'error',
      {
        htmlWhitespaceSensitivity: 'ignore',
        semi: true,
        singleQuote: false,
        trailingComma: 'es5',
        arrowParens: 'always',
      },
    ],
  },

  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ]
};
