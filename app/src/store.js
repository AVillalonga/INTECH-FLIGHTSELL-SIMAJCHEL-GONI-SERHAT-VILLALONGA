import { writable } from 'svelte/store'

export let savedFlight = writable([]);
export let flights = writable((await all_flights()))



export async function all_flights() {
    const response = await fetch(
        'http://localhost:3000/flightall',
        {
            method: 'GET'
        },
    );
    return (await response.json());

}


