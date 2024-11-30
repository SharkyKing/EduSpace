
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Teacher forum",
            version: "1.0.0",
            description: "API Information",
        },
        servers: [
            {
                url: "http://localhost:3002",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {  // Define the security scheme
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    apis: ["./routes/**/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpec;
