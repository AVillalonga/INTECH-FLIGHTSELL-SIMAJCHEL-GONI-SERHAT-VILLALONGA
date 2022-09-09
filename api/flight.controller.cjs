/**
 * Constructeur de requete
 */



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function flightController(fastify) {
    // Connection to Database
    fastify.register(require('@fastify/mysql'), {
        connectionString: 'mysql://root:MySQL@localhost:3306/flight_sell'
    })

    /**
     * Contain and synchronize all schema of flight controller
     * @param {FastifyInstance} fastify
     */
    async function loadSchemas(fastify) {
        const schemas = [
            {
                $id: "orderSchema",
                type: "object",
                properties: {
                    ref: { type: "string" },
                    user_name: { type: "string" },
                    user_mail: { type: "string" },
                    allerRetour: { type: "boolean" },
                    option: { type: "boolean" },
                },
            },
            {
                $id: "flightContractSchema",
                type: "object",
                properties: {
                    ref1: { type: "string" },
                    departureName: { type: "string" },
                    arrivalName: { type: "string" },
                    price: { type: "string" },
                },
            },
        ];

        for (const schema of schemas) fastify.addSchema(schema);
    }

    function loadRoutes(fastify) {
        const routes = [
            {
                method: "POST",
                url: "/validation",
                schema: {
                    body: { $ref: "orderSchema#" },
                    response: {
                        200: {
                            type: "object",
                            properties: {
                                response: { type: "string" },
                            },
                        },
                    },
                },
                handler: async (request, reply) => {
                    fastify.mysql.query(
                        'INSERT into users (name,mail,password) VALUES (?,?,password)', [request.body.user_name, request.body.user_mail]
                    )
                    return { response: "Billets achetés " };
                },
            },
            {
                method: "GET",
                url: "/flights",
                schema: {
                    response: {
                        200: {
                        },
                    },
                },
                handler: async (request, reply) => {
                    fastify.mysql.query(
                        'SELECT * from flights', 
                    )
                    function onResult (err, result) {
                        reply.send(err || result)
                      }
                },
            },
        ];

        for (const route of routes) fastify.route(route);
    }
    
    const schemaFlight = {
        response: {
          200: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              otherValue: { type: 'boolean' }
            }
          }
        }
      }
      fastify.get('/flightList', function(req, reply) {
        fastify.mysql.query(
          'SELECT * from flights',
          function onResult (err, result) {
            reply.send(err || result)
          }
        )
      })
    // Test route for connection
      fastify.get('/flightall', function(req, reply) {
        const flights = prisma.flights.findMany()
        const flightsContracts = []
        /*for (const flight of flights){
            const flightDeparture = prisma.locations.findUnique({where: {id_locations : flight.departure_id}})
            const flightDestination = prisma.locations.findUnique({where: {id_locations : flight.destination_id}})
            flightsContracts.push({
                ref1: flight.ref,
                departureName: flightDeparture,
                arrivalName: flightDestination,
                price: flight.price
            });
        }   */
        reply.send(flights)
      })
    
    loadSchemas(fastify);
    loadRoutes(fastify);
}

module.exports = flightController;
