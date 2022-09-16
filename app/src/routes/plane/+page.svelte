<script>
    import { savedFlight, sendOrder, send_user } from '../../store.js';
    import { goto } from '$app/navigation';

    let flights = [];
    let tickets = [];

    let name
    let age
    let password
    let email

	savedFlight.subscribe(value => {
        if(Object.prototype.toString.call(value) === '[object Array]') {
            flights = [...value];
        }
	});

    async function sendInfos() {
        const customerInfo = {
            name : name,
            mail : email,
            password : "pass",
        };
        const order_info = await sendOrder(customerInfo, flights);

    }

    function addTicket(ticket_result) {
        console.log(ticket_result)
		tickets = tickets.concat(ticket_result)
        goto("/order")
    }


</script>

<div class="container">

    <h6>Plane are : </h6>
    <ul class="list-group">
        {#each flights as flight}
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">
                    {flight.location_flight_departure_idTolocation.name} - {flight.location_flight_destination_idTolocation.name}
                </h6>
                <small class="text-muted">{flight.price}€</small>
            </div>
            {#if flight.flight_option_meta.length > 0}
            <small>With the following options</small>
            {/if}
                {#each flight.flight_opts as option}
                    {#if option.checked}
                        <div class="d-flex w-100 justify-content-between">
                            <small class="text-muted">{option.name}</small>
                            <small class="text-muted">{option.value} { option.isPercent === 0 ? 'euros' : '%' }</small>
                        </div>
                    {/if}
                {/each}
        </a>
    {/each}

    </ul>
    <p>Fill your informations</p>

    <form on:submit|preventDefault={sendInfos}>
        <div class="input-group mb-3">
            <input type="text" bind:value={name} class="form-control" placeholder="name" aria-label="name">
            <input type="password" bind:value={password} class="form-control" placeholder="password" aria-label="password">
        </div>
        <input type="email" bind:value={email} class="form-control" placeholder="email" aria-label="email">

        <label>
            Enter your birthday:
            <input type="date" name="bday" />
        </label>
        <br>
        <button type=submit class="btn btn-primary">
            Validate my informations and send mail
        </button>
    </form>
</div>

<style>
    .container {
        text-align: center;
    }
</style>
