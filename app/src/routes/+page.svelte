<h1>Chose your plane</h1>
<script>
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { savedFlight } from '../store.js';



	let questions = [
		{ id: 1, text: `FLIGHT1` },
		{ id: 2, text: `FLIGHT2` },
		{ id: 3, text: `FLIGHT3` }
	];

    const flightIdStore = writable("FLIGHTCHOICE");

	let selected;
    let answer = '';

	function handleSubmit() {
        savedFlight.set(selected)
        goto("/plane")
    }
</script>

<h2><p>Chosed flight {selected ? selected.text : ''}</p></h2>

<form on:submit|preventDefault={handleSubmit}>
	<select bind:value={selected} on:change="{() => answer = ''}" class="form-select" >
		{#each questions as question}
			<option value={question}>
				{question.text}
			</option>
		{/each}
	</select>

	<button disabled={selected == null} type=submit class="btn btn-primary">
		Chose this
	</button>
</form>

