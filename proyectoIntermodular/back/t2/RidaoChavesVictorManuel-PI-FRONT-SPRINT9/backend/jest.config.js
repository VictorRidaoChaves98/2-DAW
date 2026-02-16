export default {
    testEnvironment: 'node',
    transform: {},
    collectCoverage: true,
    collectCoverageFrom: [
        'src/app.js',
        'src/controllers/userController.js',
        'src/routes/authRoutes.js',
        'src/middlewares/authMiddleware.js',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
