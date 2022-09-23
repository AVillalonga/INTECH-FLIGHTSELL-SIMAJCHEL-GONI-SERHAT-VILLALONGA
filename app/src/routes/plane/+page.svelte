<script>
    import { savedFlight, sendOrder, send_user } from '../../store.js';
    import { goto } from '$app/navigation';

    let flights = [];
    let tickets = [];

    let name = "tot"
    let age
    let email = "t@t.fr"

	savedFlight.subscribe(value => {
        if(Object.prototype.toString.call(value) === '[object Array]') {
            flights = [...value];
            console.log(flights);
        }
	});

    async function sendInfos() {
        const customerInfo = {
            name : name,
            mail : email,
        };
        console.log(flights);

        
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
                    {flight.departure} - {flight.destination}
                </h6>
                <small class="text-muted">{parseFloat(flight.price) * (flight.hasOwnProperty('devise') ? parseFloat(flight.devise.rate) : 1)} {(flight.hasOwnProperty('devise') ? flight.devise.name : "€")}</small>
            </div>
            {#if flight.options.length > 0}
            <small>With the following options</small>
            {/if}
                {#each flight.options as option}
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
