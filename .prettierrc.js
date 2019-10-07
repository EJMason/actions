module.exports = {
    printWidth: 180,
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: true,
    quoteProps: 'as-needed',
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    overrides: [
        {
            files: '*.spec.ts',
            options: {
                printWidth: 1000,
            },
        },
        {
            files: '*.e2e-spec.ts',
            options: {
                printWidth: 1000,
            },
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
    ],
}
