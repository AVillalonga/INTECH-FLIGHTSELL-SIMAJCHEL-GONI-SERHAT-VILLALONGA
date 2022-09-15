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

export async function send_order(flights, user) {
    
    const response = await fetch(
        'http://localhost:3000/createOrderAndTicket',
        {
            method: 'POST',
            body: JSON.stringify({
                user : user,
                flights : flights
            })
        },
    );
    return (await response.json());
}



