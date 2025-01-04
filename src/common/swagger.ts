import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grabber API',
      version: '1.0.0',
      description: 'Insta grabber API to manipulate with accounts, posts, and individual lists',
    },
  },
  apis: ['./src/api/*/index.ts'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
