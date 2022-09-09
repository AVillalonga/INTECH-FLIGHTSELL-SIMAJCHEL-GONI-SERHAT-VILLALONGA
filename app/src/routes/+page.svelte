<script>
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { savedFlight } from '../store.js';

	let questions = [
		{ id: 1, name: `FLIGHT1`, options: [
            {
                "option": "Champagne",
                "price" : 100,
                "selected": false
            },
            {
                "option": "Frites",
                "price" : 10,
                "selected": true
            }
        ]},
		{ id: 2, name: `FLIGHT2`, options: []},
		{ id: 3, name: `FLIGHT3`, options: []}
	];

	let selected;
    let cart = [];

	function handleSubmit() {
        savedFlight.set(cart)
        goto("/plane")
    }

    function addToCart() {
        cart = [...cart, selected];
    }

    function emptyCart() {
        cart = [];
    }
</script>

<div class="container">

<h2>Chose planes</h2>
<!-- <h2><p>Chosed flight {selected ? selected.text : ''}</p></h2> -->
<h5><p>Cart size {cart.length}</p></h5>


<form on:submit|preventDefault={addToCart}>
	<select bind:value={selected} class="form-select" >
		{#each questions as question}
			<option value={question}>
				{question.name}
			</option>
		{/each}
	</select>
    <br>

    <ul class="list-group">
        {#each selected ? selected.options : [] as { option, price }, i}
            <label class="list-group-item">
                <input class="form-check-input me-1" type=checkbox bind:checked={selected}>
                {option} for {price} euros
            </label>
        {/each}
    </ul>

	<button type=submit class="btn btn-secondary">
		Add to cart
	</button>
</form>

<br>
<button class="btn btn-success" disabled={cart.length == 0} on:click={handleSubmit}>Validate cart</button>
<button class="btn btn-danger" disabled={cart.length == 0} on:click={emptyCart}>Empty cart</button>

</div>

<style>
    .container {
        text-align: center;
    }
</style>
