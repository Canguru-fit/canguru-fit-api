module.exports = {
    info: {
      title: 'E-Closing API',
      version: '1.0.0',
      description: 'E-Closing API',
    },
    openapi: '3.0.0',
    servers: [
      {
        url: 'http://localhost:3000/dev',
      },
      {
        url: 'https://dev.api-eclosing.quill.com.br/v1',
      },
      {
        url: 'https://homolog.api-eclosing.quill.com.br/v1',
      },
      {
        url: 'https://api-eclosing.quill.com.br/v1',
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
