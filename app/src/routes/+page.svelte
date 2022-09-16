<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { flights, savedFlight, all_flights } from "../store.js";
    // Data

    let selected;

    // Computed

    const addToCart = () => {
        $savedFlight = [...$savedFlight, selected];
    };

    const cleanCart = () => {
        $savedFlight = [];
    };

    // Method

    onMount(async () => {
        $flights = [...(await all_flights())];
    });

    function handleSubmit() {
        console.log($savedFlight);
        goto("/plane");
    }
</script>

<div class="container">
    <div class="row">
        <div class="col-10 offset-1">
            <h2 class="my-5">Chose planes</h2>
        </div>
    </div>

    <div class="row">
        <div class="col-10 offset-1">
            <h5>Cart size {$savedFlight.length}</h5>
        </div>
    </div>

    <div class="row">
        <div class="col-10 offset-1">
            <form on:submit|preventDefault={addToCart}>
                <select bind:value={selected} class="form-select">
                    {#each $flights as flight}
                        <option
                            value={flight}
                            disabled={flight.disponibility === 0}
                        >
                            {flight.location_flight_departure_idTolocation.name}
                            - {flight.location_flight_destination_idTolocation
                                .name} | {flight.price}€ | {flight.disponibility}
                            places left
                        </option>
                    {/each}
                </select>

                <ul class="list-group mt-5">
                    {#each selected ? selected.flight_opts : [] as option}
                        <label class="list-group-item">
                            <input
                                class="form-check-input me-1"
                                type="checkbox"
                                bind:checked={option.checked}
                            />
                            {option.name} for {option.value} { option.isPercent === 0 ? 'euros' : '%' }
                        </label>
                    {/each}
                </ul>

                <button type="submit" class="btn btn-secondary my-5">Add to cart</button
                >
            </form>
            <button
                class="btn btn-success"
                disabled={$savedFlight.length === 0}
                on:click={handleSubmit}>Validate cart</button
            >
            <button
                class="btn btn-danger"
                disabled={$savedFlight.length === 0}
                on:click={cleanCart}>Empty cart</button
            >
        </div>
    </div>
</div>

<style>
    /* Todo revoir le style R: Non*/
    .container {
        text-align: center;
    }
</style>
