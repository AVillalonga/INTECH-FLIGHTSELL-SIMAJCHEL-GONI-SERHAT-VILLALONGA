<script>
    import { savedFlight, send_order, send_user } from '../../store.js';

    let flights = [];
    let tickets = [];

    let name = '';
    let age;
    let email = '';

	savedFlight.subscribe(value => {
        if(Object.prototype.toString.call(value) === '[object Array]') {
            flights = [...value];
        }
	});

    async function sendInfos() {
        const user_info = await send_user(name, email)
        const ticket_info = await send_order(flights, user_info)
        addTicket(ticket_info)
    }

    function addTicket(ticket_result) {
        console.log(ticket_result)
		tickets = tickets.concat(ticket_result)
    }

</script>

<div class="container">

    <h6>Plane are : </h6>
    <ul class="list-group">
        {#each flights as flight}
            <li class="list-group-item">
                {flight.departureName} - {flight.arrivalName}  {flight.price}€
            </li>
        {/each}
    </ul>
    <p>Fill your informations</p>

    <form on:submit|preventDefault={sendInfos}>
        <input type="text" bind:value={name}>
        <input type="email" bind:value={email}>
        <button type=submit class="btn btn-primary">
            Validate my informations
        </button>
    </form>

    <ul class="list-group">
        {#each tickets as ticket}
           <p>
            Voici votre id de ticket : {ticket}
           </p>
        {/each}

        <h1>IL FAUT G2RER LENVOIE DE MAIL</h1>
    </ul>
</div>

<style>
    .container {
        text-align: center;
    }
</style>
