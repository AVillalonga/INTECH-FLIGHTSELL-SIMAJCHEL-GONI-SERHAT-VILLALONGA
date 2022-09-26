<div class="container">
    <h2>Thanks for traveling with us</h2>
    Here is a recap of your order

    <div class="list-group">

       
       
    
      </div>





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