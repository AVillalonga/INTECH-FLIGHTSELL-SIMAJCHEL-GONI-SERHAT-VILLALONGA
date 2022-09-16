async function totalOrder(order){
    let tickets = await fastify.prisma.ticket.findMany({
        where:{
            order_id: order.id
        }
    })
    let totalPrice = 0
    for ( ticket of tickets){
        totalPrice += calculTicketPrice(ticket)
    }
    return totalPrice

}

async function calculTicketPrice(ticket){
    let ticket_option = await fastify.prisma.ticket_option.findUnique({
        data: {
            ticket_id : ticket.id
        }
    })
    if (ticket_option === null){
        return ticket.flight.price
    }else{
        let newPrice
        let flight_option_meta = await fastify.prisma.flight_option_meta.findUnique({
            ticket_option_id : ticket_option.id,
        })
        let option_meta_type = await fastify.prisma.flight_option_meta_type.findUnique({
            id : flight_option_meta.flight_option_meta_type
        })
        if (flight_option_meta.name === 'AR'){
            flight.price = flight.price *2
        }
        if (option_meta_type.isPercent === 1){
            if (option_meta_type.type === 'add'){
                newPrice = flight.price * (1+ flight_option_meta.value/100)
            }else{
                newPrice = flight.price * (1- flight_option_meta.value/100)
            }
        }else{
            if (option_meta_type.type === 'add'){
                newPrice = flight.price + flight_option_meta.value
            }else{
                newPrice = flight.price - flight_option_meta.value
            }
        }
        return newPrice
    }

}