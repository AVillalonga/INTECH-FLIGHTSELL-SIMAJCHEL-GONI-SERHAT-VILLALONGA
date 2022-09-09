import { writable } from 'svelte/store'

export const savedFlight = writable([]);
export const flights = writable([
    { id: 1, name: `FLIGHT1`, options: [
        {
            "option": "Champagne",
            "price" : 100,
            "checked": false
        },
        {
            "option": "Frites",
            "price" : 10,
            "checked": true
        }
    ]},
    { id: 2, name: `FLIGHT2`, options: []},
    { id: 3, name: `FLIGHT3`, options: []}
]);