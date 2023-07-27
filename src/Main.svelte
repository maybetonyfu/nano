<script>
    import {signature, ast, arity} from "./store.js";
    import Type from "./Type.svelte"

</script>

<main>
    <label>Haskell Type Signature:</label><input bind:value={$signature} />
    <div>
        <span>Text signature: </span> <span>{$signature}</span>
    </div>
    <div style="display:grid" style:grid-template-columns={`repeat(${$arity === 0 ? 1:$arity}, auto)`}>
        <Type ast={$ast}></Type>
    </div>
</main>

<style>
    main {
        width: calc(100% - 300px);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.5rem;
    }
    * + * {
        margin-top: 1.5rem;
    }


</style>