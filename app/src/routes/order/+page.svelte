<div class="container">
    <h2>Thanks for traveling with us</h2>
    Here is a recap of your order

    <div class="list-group">

        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">PRS - CDG</h6>
                <small class="text-muted">400e</small>
            </div>
            <small>With the following options</small>
            <div class="d-flex w-100 justify-content-between">
                <small class="text-muted">Champagnes</small>
                <small class="text-muted">30e</small>
            </div>
        </a>
       
        {#each flights as flight}
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">
                        {flight.location_flight_departure_idTolocation.name} - {flight.location_flight_destination_idTolocation.name}
                    </h6>
                    <small class="text-muted">{flight.price}€</small>
                </div>
                {#if flight.flight_option.length > 0}
                    <small>With the following options</small>
                {/if}
                <div class="d-flex w-100 justify-content-between">
                    {#each flight.flight_option as { option, price, checked }, i}
                        {#if checked}
                            <small class="text-muted">{option}</small>
                            <small class="text-muted">{price}€</small>
                        {/if}
                    {/each}
                </div>
            </a>
        {/each}

       
    
      </div>





    You will received the following tickets to your mails
    
</div>

<script>
    import { savedFlight } from '../../store.js';
    // Data

    let flights = [];

	savedFlight.subscribe(value => {
        if(Object.prototype.toString.call(value) === '[object Array]') {
            flights = [...value];
        }
	});
</script>

<style>
    /* Todo revoir le style R: Non*/
    .container {
        text-align: center;
    }
</style>