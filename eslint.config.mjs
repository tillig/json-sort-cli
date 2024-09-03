import globals from 'globals';
import googleRecommended from 'eslint-config-google';
import jsdoc from 'eslint-plugin-jsdoc';
import mocha from 'eslint-plugin-mocha';

export default [
  googleRecommended,
  jsdoc.configs['flat/recommended'],
  mocha.configs.flat.recommended,
  {
    ignores: ['node_modules/*'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.es6,
        ...globals.node
      }
    },
    plugins: {
      jsdoc
    },
    rules: {
      'comma-dangle': ['error', 'never'],
      'eqeqeq': 'error',
      'indent': [
        'error',
        2,
        {
          CallExpression: {
            arguments: 1
          },
          FunctionDeclaration: {
            body: 1,
            parameters: 1
          },
          FunctionExpression: {
            body: 1,
            parameters: 1
          },
          MemberExpression: 1,
          ObjectExpression: 1,
          SwitchCase: 1,
          ignoredNodes: ['ConditionalExpression']
        }
      ],
      'linebreak-style': 'off',
      'max-len': 'off',
      'no-invalid-this': 'off',
      'no-unused-vars': 'off',
      'object-curly-spacing': ['error', 'always'],
      'require-jsdoc': 'off',
      'semi': 'error',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never'
        }
      ],
      'valid-jsdoc': 'off'
    }
  }
];
