import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EarthSync API",
      version: "1.0.0",
      description: "Documentação das rotas do projeto EarthSync",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Servidor local de desenvolvimento",
      },
    ],
    components: {
      schemas: {
        Event: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "evt_123",
              description: "ID do evento",
            },
            title: {
              type: "string",
              example: "Terremoto no Chile",
              description: "Título do evento",
            },
            category: {
              type: "string",
              example: "Terremoto",
              description: "Categoria do evento",
            },
            description: {
              type: "string",
              example: "Evento sísmico de magnitude 6.0",
              description: "Descrição do evento",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2025-10-30T12:00:00Z",
              description: "Data do evento",
            },
            latitude: {
              type: "number",
              example: -33.45,
              description: "Latitude do evento",
            },
            longitude: {
              type: "number",
              example: -70.66,
              description: "Longitude do evento",
            },
          },
          required: ["id", "title", "category", "date", "latitude", "longitude"],
        },
        History: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
              description: "ID do registro de histórico",
            },
            query: {
              type: "string",
              example: "Terremotos no Brasil",
              description: "Consulta realizada pelo usuário",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-10-30T15:20:30Z",
              description: "Data e hora em que o registro foi criado",
            },
          },
          required: ["id", "query", "createdAt"],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/**/*.ts"], 
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
