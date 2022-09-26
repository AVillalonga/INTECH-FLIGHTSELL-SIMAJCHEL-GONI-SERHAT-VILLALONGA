<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { flights, savedFlight, all_flights, all_rates } from "../store.js";

    /**
     * Fields
     */
    let rates = [];
    let devise;
    let selected;

    /**
     * Add to cart
     */
    const addToCart = () => {
        const newInstance = Object.assign({}, selected);

        if (devise != "") newInstance.devise = devise;
        newInstance.options = selected.options.filter(option => option.active === true);
        $savedFlight = [...$savedFlight, newInstance];
        console.log($savedFlight);
    };

    /**
     * Clean cart
     */
    const cleanCart = () => {
        $savedFlight = [];
    };

    /**
     * OnMount
     */
    onMount(async () => {
        rates = await all_rates();
        $flights = [...(await all_flights())];
    });

    /**
     * Handle submit
     */
    function handleSubmit() {
        goto("/plane");
    }

</script>

<!-- Main container -->
<div class="container">
    <!-- Header -->
    <div class="row">
        <div class="col">
            <h2>FLIGHT SELL</h2>
        </div>
    </div>

    <!-- Cart -->
    <div class="row">
        <div class="col">
            <h2>Cart</h2>
            <div class="row">
                {#each $savedFlight as flight}
                    <div class="col-10 offset-1">
                        <b>{ flight.reference }</b> { flight.departure } > { flight.destination }
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Currency Rate -->
    <div class="row">
        <div class="col">
            <h2>Selectionner un converteur de euro ?</h2>
            <select bind:value={devise} class="form-select">
                <option value="" selected>EUR</option>
                {#each rates as rate}
                    <option value={rate}>
                        {rate.name}
                    </option>
                {/each}
            </select>
        </div>
    </div>

    <!-- Plane selector -->
    <div class="row">
        <div class="col">
            <form on:submit|preventDefault={addToCart} class="planeSelector">
                <select bind:value={selected} class="form-select">
                    {#each $flights as flight}
                        <option
                            value={flight}
                            disabled={flight.disponibility === 0}
                        >
                            {flight.departure} > {flight.destination} | {parseFloat(
                                flight.price
                            ) *
                                (devise.hasOwnProperty("value")
                                    ? parseFloat(devise.value)
                                    : 1)}
                            {devise.hasOwnProperty("name") ? devise.name : "€"}
                            | {flight.disponibility} places left | {flight.origin}
                        </option>
                    {/each}
                </select>

                <ul class="list-group">
                    {#each (selected ? selected.options : []) as option, optionIncrement}
                        <label class="list-group-item">
                            <input
                                class="form-check-input me-1"
                                type="checkbox"
                                bind:checked={selected.options[optionIncrement].active}
                            />
                            <span class="optionName">{option.name === "AR" ? "Allé/Retour" : option.name }</span> - {option.value}
                            {option.value_type === 1 ? "€" : ""}
                            {option.value_type === 2 ? "%" : ""}
                            {option.value_type === 3 ? "€ (reduction)" : ""}
                            {option.value_type === 4 ? "% (reduction)" : ""}

                        </label>
                    {/each}
                </ul>

                <button type="submit" class="btn btn-primary">Add to cart</button>
            </form>
        </div>
    </div>

    <!-- Buttons -->
    <div class="row">
        <div class="col">
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
    .container {
        margin: 32px auto;
        border: 1px solid #00000030 !important;
    }
    .container > .row {
        padding: 16px 0;
    }

    .container > .row:nth-child(1) {
        background-image: linear-gradient(-120deg, #00000050, #00000010);
        color: #ffffff;
        text-align: center;
        letter-spacing: 10px;
        font-weight: bold;
        font-size: 48px !important;
    }

    .container > .row:nth-child(2n + 1) {
        background-color: #00000020;
    }

    .list-group-item {
        border-radius: 0;
    }

    .planeSelector select {
        border-radius: 0;
        margin-bottom: 16px;
    }

    .optionName {
        background-color: #00000020;
        padding: 0 6px;
    }

    .btn-primary {
        margin-top: 16px;
    }
</style>
