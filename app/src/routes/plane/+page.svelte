<script>
    import { savedFlight, sendOrder, orderId, getBasketPrice } from '../../store.js';
    import { goto } from '$app/navigation';

    let flights = [];
    let tickets = [];

    let name = "your name"
    let age
    let email = "your email"
    let totalPrice = "processing"

	savedFlight.subscribe(async value =>  {
        if(Object.prototype.toString.call(value) === '[object Array]') {
            flights = [...value];
            console.log(flights);
            totalPrice = await getBasketPrice(flights);
        }
	});

    async function sendInfos() {
        const customerInfo = {
            name : name,
            mail : email,
        };
        console.log(flights);
        
        const order_info = await sendOrder(customerInfo, flights);
        $orderId = order_info.id

        console.log($orderId);
        console.log("-------");
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
                    <small class="text-muted">{parseFloat(flight.price) * (flight.hasOwnProperty('devise') ? parseFloat(flight.devise.value) : 1)} {(flight.hasOwnProperty('devise') ? flight.devise.name : "€")}</small>
                </div>
                {#if flight.options.filter(opt => opt.checked).length > 0}
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
    {#if flights.length != 0 && totalPrice}
        <h5 class="list-group-item">Total is 
            {(parseFloat(totalPrice) * (flights[0].hasOwnProperty('devise') ? parseFloat(flights[0].devise.value) : 1)).toFixed(2)} {(flights[0].hasOwnProperty('devise') ? flights[0].devise.name : "€")}
        </h5>
    {/if}
    </ul>

    <p>Fill your informations</p>

    <form on:submit|preventDefault={sendInfos}>
        <div class="input-group mb-3">
            <input type="text" bind:value={name} class="form-control" placeholder="name" aria-label="name">
        </div>
        <input type="email" bind:value={email} class="form-control" placeholder="email" aria-label="email">

        <br>
        
        <button type=submit class="btn btn-primary">
            Validate, Pay and Get my tickets
        </button>
    </form>
</div>

<style>
    .container {
        text-align: center;
    }
</style>
