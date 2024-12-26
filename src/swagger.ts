import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog App API Documentation",
      version: "1.0.0",
      description: "API description goes here...",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [{ BearerAuth: [] }],
    servers: [
      {
        url: "http://localhost:3000/api/users", 
        description: "User-related endpoints",
      },
      {
        url: "http://localhost:3000/api",
        description: "Post, comment, and image APIs",
      },  
    ],
  },
  apis: ["./src/routes/*.ts"],
};



const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
