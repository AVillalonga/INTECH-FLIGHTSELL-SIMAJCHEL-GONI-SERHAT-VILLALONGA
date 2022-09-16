async function optionAvailable(flight,option){
    let flight_option= await fastify.prisma.flight_option.findUnique({
        flight_id : flight.id,
        name: option
    })
    if (flight_option!== null){
        if ( option='FirstClass'){
            placeAvailable = totalFirstClassPlacesAvailable(flight)
            if (placeAvailable === 0){
                //erreur plus de place disponible
            }
    
        }
        return true
    }
    
    return false
}


async function premireClasseOption(flight){



    await fastify.prisma.flight_option.findUnique({
        flight_id : flight.id,
        name: '1erClass'
    })

}
