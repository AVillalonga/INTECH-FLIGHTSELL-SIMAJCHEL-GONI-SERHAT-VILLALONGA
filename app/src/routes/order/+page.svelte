<div class="container">
    <h2>Thanks for traveling with us</h2>
    Here is a recap of your order

    {#if order}
        <div class="list-group">
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
        
        
        
        </div>
    {/if}






    You will received the following tickets to your mails
    
</div>

<script>
    import { getOrderRecap, orderId, savedFlight } from '../../store.js';
    import { onMount } from "svelte";

    // Data

    let flights = [];
    let order;

    console.log($orderId);
    

	savedFlight.subscribe(value => {
        if(Object.prototype.toString.call(value) === '[object Array]') {
            flights = [...value];
        }
	});

    onMount(async () => {
        order = await getOrderRecap($orderId);
        console.log(order);
    });


    
</script>

<style>
    /* Todo revoir le style R: Non*/
    .container {
        text-align: center;
    }
</style>