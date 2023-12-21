module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
    ],
    parser: 'esprima',
    plugins: ['prettier'],
    root: true,
    env: {
        node: true,
    },
    rules: {
        '@typescript-eslint/no-var-requires': 'off',
    },
};
