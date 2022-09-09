<script>
    import { savedFlight } from '../../store.js';

    let flights = [];

    let name = '';
    let age;
    let email = '';

	savedFlight.subscribe(value => {
        if(Object.prototype.toString.call(value) === '[object Array]') {
            flights = [...value];
        }
	});

    function sendInfos() {
        alert(`data is ${name} ${age} ${email}`)
    }

</script>

<div class="container">

<h6>Plane are : </h6>
<ul class="list-group">
	{#each flights as { id, name}, i}
		<li class="list-group-item">
            {name}
        </li>
	{/each}
</ul>
<p>Fill your informations</p>

<form on:submit|preventDefault={sendInfos}>
    <input type="text" bind:value={name}>
    <input type="date" bind:value={age}>
    <input type="email" bind:value={email}>
    <button type=submit class="btn btn-primary">
		Validate my informations
	</button>
</form>
</div>

<style>
    .container {
        text-align: center;
    }
</style>
