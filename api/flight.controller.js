/**
 * Constructeur de requete
 */

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
 async function routes (fastify, options) {
    /*const collection = fastify.mysql.collection('test_collection')   

    fastify.get('/', (request, reply) => {
        reply.send({ hello: 'world' })
      })
    fastify.get('/flights', async (request, reply) => {
    const result = await collection.find().toArray()
    if (result.length === 0) {
        throw new Error('No documents found')
    }*/
    /*const UserJsonSchema = {
    type: 'object',
    required: ['User'],
    properties: {
      name: { type: 'string' },
      mail: {tpye: 'string'}
        },
    }

    const schema = {
        body: UserJsonSchema, ref:{type: 'string'}
    }
    fastify.post('/order', { schema }, async (request, reply) => {
        // we can use the `request.body` object to get the data sent by the client
        const result = await collection.insertOne({ ticket: request.body.ticket })
        return result
      })
    return result
    })
    fastify.register(require('@fastify/mysql'), {
        connectionString: 'mysql://root@localhost/mysql'
    })*/
    fastify.addSchema({
        $id: "orderSchema",
        type: 'object',
        properties:{
            ref: {type: 'string'},
            user_name: {type: 'string'},
            user_mail: {type: 'string'},
            allerRetour: {type: 'boolean'},
            option: {type: 'boolean'}
        }
    })
    fastify.addSchema({
        $id: "flightContractSchema",
        type: 'object',
        properties: {
            ref1: {type: 'string'},
            departureName: {type : 'string'},
            arrivalName: {type: 'string'},
            price: {type: 'string'} 
        }
    })
    fastify.route({
        method: 'POST',
        url: '/validation',
        schema: {
            body: {$ref : 'orderSchema#'},
            response: {
                200: {
                    type: 'object',
                    properties: {
                        response: {type:'string'}
                    }
                }
            }
        },
        handler: async (request, reply) => {
            return {response: 'Billets achetés '}
        }
    })
    fastify.route({
        method: 'GET',
        url: '/flights',
        schema: {
            response: {
            200: {
                type: 'object',
                properties: {
                ref1: {type: 'string'},
                departureName: {type : 'string'},
                arrivalName: {type: 'string'},
                price: {type: 'string'} 
                },
            }
            }
        },
        handler: async (request, reply) => {
            return {ref1: 'A3456', departureName: 'CDG',arrivalName: 'JFK', price:'17' }
        }
    })
  }
  
  module.exports = routes
