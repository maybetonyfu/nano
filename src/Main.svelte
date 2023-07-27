<script>
    import {signature, ast, arity, isValid} from "./store.js";
    import Type from "./Type.svelte"

</script>

<main>
    <div>
        <label>Haskell Type Signature:</label>
    </div>
    <div>
        <input bind:value={$signature}/>
    </div>
    <div>
        Text notation:
    </div>
    <div style:color={$isValid ? "#5ECE9F" : "#EB6868"}>{$signature}</div>
    <div>
        Graphic notation:
    </div>
    <div style="overflow-x: auto">
        <div style="display:grid;width: max-content" style:grid-template-columns={`repeat(${$arity === 0 ? 1:$arity}, auto)`}>
            <Type ast={$ast}></Type>
        </div>
    </div>

</main>

<style>
    :global(body) {
        display: grid;
        grid-template-columns: 1fr minmax(800px, 1000px) 1fr;
        grid-template-rows: auto;
        font-family: Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif;
    }
    :global(#app) {
        grid-column: 2/3;
    }
    main {
        width: calc(100% - 300px);
        display: flex;
        flex-direction: column;
        font-size: 1.5rem;
    }

    * + * {
        margin-top: 1.5rem;
    }
    input {
        font-size: 1rem;
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #ccc;
    }

</style>