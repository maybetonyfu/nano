<script>
    import { getContext } from "svelte";
    import { nodeType } from "./grammar";

    export let ast;
    let varSymbols = getContext('varSymbols')
    
</script>

<div>
    {#if ast['type'] === undefined} 
        <div></div>
    {:else if ast['type'] === nodeType.APP}
        <div class="flex gap-x-1">
            {#each ast['children'] as child}
                <svelte:self ast={child} ></svelte:self>
            {/each}
        </div>

    {:else if ast['type'] === nodeType.CLASS}
        <div></div>
    {:else if ast['type'] === nodeType.CON}
         <div>{ast['source']}</div>
    {:else if ast['type'] === nodeType.FUN}
        <div class="gap-x-1">
            <svelte:self ast={ast['arg']}></svelte:self>
            <div> -> </div>
            <svelte:self ast={ast['result']}></svelte:self>
        </div>
    {:else if ast['type'] === nodeType.LIST}
        <div>[</div> 
        <svelte:self ast={ast['child']} ></svelte:self>
        <div>]</div>
    {:else if ast['type'] === nodeType.UNIT}
        <div>()</div>
    {:else if ast['type'] === nodeType.PAREN}
        <div>
            <div>(</div> 
            <svelte:self ast={ast['child']} ></svelte:self>
            <div>)</div>
        </div>
    {:else if ast['type'] === nodeType.TUPLE}
        <div>(</div>
        <div class="gap-x-1">
            {#each ast['children'] as child, ind}
            <div>
                <svelte:self ast={child}></svelte:self>
                    {#if ind !== ast['children'].length - 1}
                        <div>,</div>
                    {/if}

            </div>
        {/each}
        </div>
        <div>)</div>
    {:else if ast['type'] === nodeType.VAR}
        <div>{$varSymbols.get(ast['source'])}</div>
    {/if}

</div>

<style>
    div {
        display: flex;
    }
</style>