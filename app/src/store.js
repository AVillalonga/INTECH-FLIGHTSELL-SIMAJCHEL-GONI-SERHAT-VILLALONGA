import { writable } from "svelte/store";

export let savedFlight = writable([]);
export let flights = writable([]);
export let orderId = writable();

export async function all_flights() {
    const response = await fetch("http://localhost:3000/flight/flights", {
        method: "GET",
    });

    let flights = (await response.json()).flights;
    console.log(flights);
    
    return flights;
}

export async function all_rates() {
    const response = await fetch("http://localhost:3000/rates", {
        method: "GET",
    });
    let rates = (await response.json()).rates
    console.log(rates);
    return rates;
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
    let prepareFlights = flights.map((f) => {
        return {
            reference: f.reference,
            options: f.options.filter(opt => opt.checked === true).map(opt => opt.id)
        }
    });

    console.log(prepareFlights);

    const response = await fetch("http://localhost:3000/order/createOrder", {
        method: "POST",
        body: JSON.stringify({
            name: customerInfo.name,
            mail: customerInfo.mail,
            flights: prepareFlights,
        }),
    });
    return await response.json();
}

export async function getBasketPrice(flights) {
    let prepareFlights = flights.map((f) => {
        return {
            reference: f.reference,
            options: f.options.filter(opt => opt.checked === true).map(opt => opt.id)
        }
    });

    const response = await fetch("http://localhost:3000/order/calc", {
        method: "POST",
        body: JSON.stringify({
            flights: prepareFlights,
        }),
    });
    let price = (await response.json()).total
    console.log(price);
    return price;
}

export async function getOrderRecap(orderId) {
    const response = await fetch("http://localhost:3000/order/" + orderId, {
        method: "GET",
    });
    let price = (await response.json())
    console.log(price);
    return price;
}

