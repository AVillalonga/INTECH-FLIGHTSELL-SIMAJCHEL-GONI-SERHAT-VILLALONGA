import axios from "axios";


export async function bookingFlightOfBroker(order: {
    name: string;
    mail: string;
    currency:string;
    flights: { reference: any; price:number ;options: number[] }[];
}) {
    const ticketsData = []
    let totalPrice = 0
    for (let flight of order.flights){
        ticketsData.push({
            "flight_code":flight.reference,
            "person":{
                "first_name": order.name,
                "last_name": order.mail,
                "birth_date":"unknow" 
            },
            "price": flight.price,
            "booking_date":"now",
            "option_codes": flight.options
            },
        )
        totalPrice += flight.price
    }

    const data = {
        "provider_key": process.env["REMOTE_KEY"],
        "booking":{
            "total_price" : totalPrice,
            "currency":{
                "currency_code":order.currency,
                "currency_name":order.currency,
            },
            "tickets": ticketsData

        }
    }
    console.log(data)
    console.log(process.env["REMOTE_URL"] + "/bookings")
    try {
        await axios.post(process.env["REMOTE_URL"] + "/bookings", data);
    } catch (err) {
        console.error(err);
    }
}
