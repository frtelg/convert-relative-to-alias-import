module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    root: true,
    ignorePatterns: ['build', 'src/types/api/models', '.gitlab*'],
    env: {
        node: true,
    },
    rules: {
        '@typescript-eslint/no-var-requires': 'off',
    },
};
