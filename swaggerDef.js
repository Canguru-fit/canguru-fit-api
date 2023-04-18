module.exports = {
    info: {
      title: '360 Beds24 API',
      version: '1.0.0',
      description: 'Beds24 API',
    },
    openapi: '3.0.0',
    servers: [
      {
        url: 'http://localhost:3000/dev',
      },
      {
        url: 'https://dev.api.360suites.com.br/beds24',
      },
      {
        url: 'https://homolog.api.360suites.com.br/beds24',
      },
      {
        url: 'https://api.360suites.com.br/beds24',
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
