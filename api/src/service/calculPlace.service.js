async function totalFirstClassPlacesAvailable(flight){
    const totalPlacesOfFlight = totalPlaceOfFlight(flight)

    const flight_optionFirstClass= await fastify.prisma.flight_option.findUnique({
        data :{
            flight_id : flight.id,
            name : '1class'
        }
    })
    firstClassTotalPlaces = totalPlacesOfFlight * 0.10 
    const ticketFirstClassSoldCount = await fastify.prisma.ticket_option.findMany({
        select: {
          _count: {
            where: {
              ticket_id : await fastify.prisma.ticket.findMany({
                where:{
                    flight_id: flight.id
                }
              }),
              flight_option_id: optionFirstPlace.id
            },
          },
        },
    })

    totalFirstClassAvailable = firstClassTotalPlace - ticketFirstClassSoldCount
    return totalFirstClassAvailable

}
async function totalPlaceOfFlight(flight){
    const ticketSoldCount = await fastify.prisma.ticket.findMany({
        select: {
          _count: {
            where: {
              flight_id : flight.id
            },
            _select: {
                id : true
            }
          },
        },
    })
    totalPlaces = flight.disponibility + ticketSoldCount
    return totalPlaces
}