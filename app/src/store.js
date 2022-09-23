import { writable } from "svelte/store";

export let savedFlight = writable([]);
export let flights = writable([]);

export async function all_flights() {
    const response = await fetch("http://localhost:3000/flight/flights", {
        method: "GET",
    });

    let flights = await response.json();

    flights = flights.map((flight) => {
        
        const flight_opts = flight.flight_option_meta.map((option) => {
            const meta_type =
                option.flight_option_meta_type_flight_option_metaToflight_option_meta_type;
            const { type, isPercent } = meta_type;

            return {
                ...option,
                value: Number.parseFloat(type === "add" ? option.value : option.value * -1),
                isPercent,
                checked: false
            };
        });

        return { ...flight, flight_opts }
    });

    console.log(flights);
    
    return flights;
}
export async function send_user(username, usermail) {
    const response = await fetch("http://localhost:3000/usercreate", {
        method: "POST",
        body: JSON.stringify({
            user_name: username,
            user_mail: usermail,
        }),
    });
    return await response.json();
}

export async function sendOrder(customerInfo, flights) {
    // const body = new FormData();
    // body.append("customerInfo", {...customerInfo});
    // body.append("flights", flights.map(f => f.id));

    const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        body: JSON.stringify({
            customerInfo,
            flights: flights.map((f) => f.id),
        }),
    });
    return await response.json();
}
