import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";
const PORT = process.env.PORT || 4000;
const API_PREFIX = process.env.API_PREFIX || "/api";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Leave Management API",
      version: "1.0.0",
      description: "Leave Management System APIs",
      contact: {
        name: "Vikash Kumar Shukla",
        email: "vikash600.com@gmail.com",
        url: "#",
      },
    },


    servers: [
      {
        url: `${API_BASE_URL}:${PORT}${API_PREFIX}`,
        description: "Local development server",
      },
    ],

    /* Authentication configuration */
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    /* authentication globally */
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  /* Swagger will scan these files for JSDoc comments */
  apis: ["./src/modules/**/*.ts"],
});
