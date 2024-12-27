import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog App API Documentation",
      version: "1.0.0",
      description:
        "API documentation for user, post, comment, and image management",
    },
    servers: [
      {
        url: "http://localhost:3000/api/users",
        description: "Auth and User Profile related APIs",
      },
      {
        url: "http://localhost:3000/api",
        description: "Post related APIs",
      },
      {
        url: "http://localhost:3000/api/posts",
        description: "Comment and Image related APIs",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], 
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
