<script>
    import { savedFlight } from '../../store.js';

    let flight;
    
    let name;
    let age;
    let email;

	savedFlight.subscribe(value => {
		flight = value;
	});

</script>

<h1>Plane is {flight ? flight.text : 'XXX'}</h1>
<p>Fill your informations</p>

<input value={name}>
<input type="date" value={age}>
<input type="email" value={email}>



