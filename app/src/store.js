import { writable } from 'svelte/store'

export let savedFlight = writable([]);
export let flights = writable([])

export async function all_flights() {
    const response = await fetch(
        'http://localhost:3000/flights',
        {
            method: 'GET'
        },
    );
    return (await response.json());
}
export async function send_user(username, usermail) {
    
    const response = await fetch(
        'http://localhost:3000/usercreate',
        {
            method: 'POST',
            body: JSON.stringify({
                user_name : username,
                user_mail : usermail
            })
        },
    );
    return (await response.json());
}

export async function sendOrder(customerInfo, flights){

    // const body = new FormData();
    // body.append("customerInfo", {...customerInfo});
    // body.append("flights", flights.map(f => f.id));

    const response = await fetch(
        'http://localhost:3000/order',
        {
            method: 'POST',
            body: JSON.stringify({
                customerInfo, 
                flights : flights.map(f => f.id)
        })
        },
    );
    return (await response.json());
}



