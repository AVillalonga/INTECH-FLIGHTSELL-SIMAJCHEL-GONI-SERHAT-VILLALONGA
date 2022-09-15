/**
 * Constructeur de requete
 */

const { PrismaClient } = require('@prisma/client');
const nodemailcontroller =  require('../service/nodemailController.cjs')

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
        // const schemas = [
        //     {
        //         $id: "orderSchema",
        //         type: "object",
        //         properties: {
        //             ref: { type: "string" },
        //             user_name: { type: "string" },
        //             user_mail: { type: "string" },
        //             //allerRetour: { type: "boolean" },
        //             //option: { type: "boolean" },
        //         },
        //     },
        //     {
        //         $id: "flightContractSchema",
        //         type: "object",
        //         properties: {
        //             ref1: { type: "string" },
        //             departureName: { type: "string" },
        //             arrivalName: { type: "string" },
        //             price: { type: "string" },
        //         },
        //     },
        // ];
        const orderSchema = {
            $id: "orderSchema",
            type: 'object',
            properties: 
            {
                ref: { type: "string" },
                user_name: { type: "string" },
                user_mail: { type: "string" },
                //allerRetour: { type: "boolean" },
                //option: { type: "boolean" },
            },
          }
        const flightContractSchema = {
            $id: "flightContractSchema",
            type: "object",
            properties: {
                ref1: { type: "string" },
                departureName: { type: "string" },
                arrivalName: { type: "string" },
                price: { type: "string" },
            },
        }
        fastify.addSchema(orderSchema);
        fastify.addSchema(flightContractSchema);

        // for (const schema of schemas) fastify.addSchema(schema);
    }

    
    function loadRoutes(fastify) {
        const routes = [
            {
                method: "POST",
                url: "/usercreate",
                handler: async (request, reply) => {
                        /*const resultflight = await prisma.flights.findUnique({
                            where: {
                                ref: ref,
                            },
                        })*/
                    const user = JSON.parse(request.body)
                    const resultUser = await prisma.users.create({

                        data: {
                            name: user.user_name,
                            mail: user.user_mail,
                            password: 'test',
                        }
                    })

                    resultUser.then( reply.send(resultUser))
                    
                },
            },
            {
                method:"POST",
                url:"/createOrderAndTicket",
                handler: async (request, reply) => {

                    const parse_request = JSON.parse(request.body)
                    const flights = parse_request.flights
                    const user = parse_request.user
                    const list_id_ticket = []

                    for (const flight of flights)
                    {
                        const resultOrder = await prisma.orders.create({
                            data:{
                                id_users: user.id_users
                            }
                        });

                        const resultTicket = await prisma.tickets.create({
                            data:{
                                id_orders : resultOrder.id_orders,
                                id_flights: flight.id,
                                ticket_date: (new Date())
                            }
                        });
                        list_id_ticket.push(resultTicket.id_tickets);
                        console.log(user)
                        console.log(await nodemailcontroller(user.mail, "Voila votre billet !", "L'identifiant de votre billet est : " + resultTicket.id_tickets))
                    }
                    reply.send(list_id_ticket)

                },
            },
            // {
            //     method: "GET",
            //     url: "/flights",
            //     schema: {
            //         response: {
            //             200: {
            //             },
            //         },
            //     },
            //     handler: async (request, reply) => {
            //         fastify.mysql.query(
            //             'SELECT * from flights', 
            //         )
            //         function onResult (err, result) {
            //             reply.send(err || result)
            //           }
            //     },
            // },
            {
                method: "GET",
                url: "/flightall",
                handler: async (request, reply) => {
                    const flights = await prisma.flights.findMany()
                    const flightsContracts = []
                    for (const flight of flights){
                        const flightDeparture = await prisma.locations.findUnique({where: {id_locations : flight.departure_id}})
                        const flightDestination = await prisma.locations.findUnique({where: {id_locations : flight.destination_id}})
                        flightsContracts.push({
                            id: flight.id_flights,
                            ref: flight.ref,
                            departureName: flightDeparture.name,
                            arrivalName: flightDestination.name,
                            price: flight.price
                        });
                    }  
                    reply.send(flightsContracts)
                },
            },
        ];

        for (const route of routes) fastify.route(route);
    }
    
    // const schemaFlight = {
    //     response: {
    //       200: {
    //         type: 'object',
    //         properties: {
    //           value: { type: 'string' },
    //           otherValue: { type: 'boolean' }
    //         }
    //       }
    //     }
    //   }
    //   fastify.get('/flightall', async function(req, reply) {
    //     const flights = await prisma.flights.findMany()
    //     const flightsContracts = []
    //     for (const flight of flights){
    //         const flightDeparture = await prisma.locations.findUnique({where: {id_locations : flight.departure_id}})
    //         const flightDestination = await prisma.locations.findUnique({where: {id_locations : flight.destination_id}})
    //         flightsContracts.push({
    //             ref1: flight.ref,
    //             departureName: flightDeparture.name,
    //             arrivalName: flightDestination.name,
    //             price: flight.price
    //         });
    //     }  
    //     reply.send(flightsContracts)
    //   })
    
    loadSchemas(fastify);
    loadRoutes(fastify);
}

module.exports = flightController;
