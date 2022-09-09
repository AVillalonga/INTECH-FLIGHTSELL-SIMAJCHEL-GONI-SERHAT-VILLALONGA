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
    // fastify.register(require('@fastify/mysql'), {
    //     connectionString: 'mysql://root:MySQL@localhost:3306/flight_sell'
    // })

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
                    //allerRetour: { type: "boolean" },
                    //option: { type: "boolean" },
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
                    const {ref, name, mail} = request.body
                    const resultUser = await prisma.users.create({
                        data: {
                            name,
                            mail
                        }
                    })
                    const idUser = resultUser.id
                    const resultOrder = await prisma.orders.create({
                        data:{
                            idUser
                        }
                    })
                    const idOrder = resultOrder.id
                    const resultTicket = await prisma.tickets.create({
                        data:{
                            idOrder
                        }
                    })
                    reply.send(resultUser,resultOrder,resultTicket)
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
      fastify.get('/flightall', async function(req, reply) {
        const flights = await prisma.flights.findMany()
        const flightsContracts = []
        for (const flight of flights){
            const flightDeparture = await prisma.locations.findUnique({where: {id_locations : flight.departure_id}})
            const flightDestination = await prisma.locations.findUnique({where: {id_locations : flight.destination_id}})
            flightsContracts.push({
                ref1: flight.ref,
                departureName: flightDeparture.name,
                arrivalName: flightDestination.name,
                price: flight.price
            });
        }  
        reply.send(flightsContracts)
      })
    
    loadSchemas(fastify);
    loadRoutes(fastify);
}

module.exports = flightController;
