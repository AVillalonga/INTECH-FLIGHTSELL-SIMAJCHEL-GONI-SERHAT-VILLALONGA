
<div class="container">
    <h2>Chose planes</h2>
    <!-- <h2><p>Chosed flight {selected ? selected.text : ''}</p></h2> -->
    <h5><p>Cart size {$savedFlight.length}</p></h5>
    
    <form on:submit|preventDefault={addToCart}>
        <select bind:value={selected} class="form-select">
            {#each $flights as flight}
                <option value={flight}>
                    {flight.departureName} - {flight.arrivalName}  {flight.price}€
                </option>
            {/each}
        </select>

        <br>
    
        <ul class="list-group">
            {#each selected ? selected.option : [] as { option, price, checked }, i}
                <label class="list-group-item">
                    <input class="form-check-input me-1" type=checkbox bind:checked={checked}>
                    {option} for {price} euros
                </label>
            {/each}
        </ul>
    
        <button type=submit class="btn btn-secondary">Add to cart</button>
    </form>
    
    <br>
    <button class="btn btn-success" disabled={$savedFlight.length === 0} on:click={handleSubmit}>Validate cart</button>
    <button class="btn btn-danger" disabled={$savedFlight.length === 0} on:click={cleanCart}>Empty cart</button>
    <button on:click={sendmail}>ENVOYER UN MAIL</button>
</div>

<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { flights, savedFlight, all_flights } from '../store.js';
    // Data

	let selected;

    // Computed
    
    const sendmail = async () => {
        const response = await fetch(
        'http://localhost:3000/sendmail',
        {
            method: 'POST'
        },
    );
        return (await response.json());
    };

    const addToCart = () => {
		$savedFlight = [...$savedFlight, selected];
	};

    const cleanCart = () => {
        $savedFlight = [];
    };

    // Method

    onMount(async () => {
        $flights = [...$flights, ...(await all_flights())];
    });

	function handleSubmit() {
        console.log($savedFlight)
        goto("/plane")
    }

</script>

<style>
    /* Todo revoir le style */
    .container {
        text-align: center;
    }
</style>
