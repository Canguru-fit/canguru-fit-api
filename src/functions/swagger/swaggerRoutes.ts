import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    info: {
        title: '360 API',
        version: '1.0.0',
        description: 'Investors portal API',
    },
    openapi: '3.0.0',
    servers: [
        {
            url: 'http://localhost:3000/dev',
        },
        {
            url: 'https://dev.api.360suites.com.br/beds24-api',
        },
        {
            url: 'https://homolog.api.360suites.com.br/beds24-api',
        },
        {
            url: 'https://api.360suites.com.br/beds24-api',
        },
    ],
    apis: ['./src/functions/**/*.ts'],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'authorization',
            },
            XApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'x-api-key',
            },
        },
    },
};

const router = Router();

// import swaggerDocument from 'swagger.json'

const specs = swaggerJsdoc(options);
router.use('/api-docs', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs));

export default router;
