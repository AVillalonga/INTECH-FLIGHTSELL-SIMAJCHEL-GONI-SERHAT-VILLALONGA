<div class="container">
    <h2>Thanks for traveling with us</h2>
    Here is a recap of your order

    {#if tickets.length != 0}
        <div class="list-group">
            <h6 class="list-group-item">Order passed at {order.created_at} </h6>

            {#each tickets as ticket}
                <a href="#" class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">
                            {ticket.departure} - {ticket.destination}
                        </h6>
                        <small class="text-muted">{parseFloat(ticket.price) * (ticket.hasOwnProperty('devise') ? parseFloat(ticket.devise.value) : 1)} {(ticket.hasOwnProperty('devise') ? ticket.devise.name : "€")}</small>
                    </div>
                    {#if ticket.ticket_option.filter(opt => opt.checked).length > 0}
                        <small>With the following options</small>
                    {/if}
                    {#each ticket.ticket_option as option}
                        {#if option.checked}
                            <div class="d-flex w-100 justify-content-between">
                                <small class="text-muted">{option.name}</small>
                                <small class="text-muted">{option.value} { option.isPercent === 0 ? 'euros' : '%' }</small>
                            </div>
                        {/if}
                    {/each}
                </a>
            {/each}
        </div>
    {/if}






    You will received the following tickets to your mails
    
</div>

<script>
    import { getOrderRecap, orderId, savedFlight } from '../../store.js';
    import { onMount } from "svelte";

    // Data

    let tickets = [];
    let order;


    console.log($orderId);

    onMount(async () => {
        order = await getOrderRecap($orderId);
        tickets = order.tickets
        console.log(order);
    });


    
</script>

<style>
    /* Todo revoir le style R: Non*/
    .container {
        text-align: center;
    }
</style>