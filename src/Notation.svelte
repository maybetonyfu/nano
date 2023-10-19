<script>
import HType from "./HType.svelte";
import {writable} from "svelte/store";
let conColors = writable({});
let cons = writable(new Set());
let sig = ''


</script>

<div class="p-4 flex flex-col gap-y-4">
    <h1>Haskell Diagrammatic Type Notation</h1>
    <div class="border p-3 border-black">
        <label for="sig">Type signature</label>
        <input id="sig" bind:value={sig} class="bg-stone-200 px-2 py-1">
    </div>
    {#if sig !== ''}
        <div class="mr-2 border p-3 border-black">

        <HType name="_" variant="diagram" sig={sig} {conColors} {cons}/>
        </div>
    {/if}

</div>