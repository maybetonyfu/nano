<script>
    import {nodeType} from "./grammar.js";
    import Tile from "./Tile.svelte";
    import {varColors, conColors, context, contextColors} from "./store.js";

    export let ast;
    export let hasSibling = false;

    let color, contexts;
    $: {
        if (ast['type']) {
            color = calculateColor(ast, {varColors: $varColors, conColors: $conColors})

        }

        if (ast['type'] === nodeType.VAR) {
            contexts = ($context.get(ast.source) || []).map(c => $contextColors[c])
        } else if (ast['type'] === nodeType.APP && ast.children[0].type === nodeType.VAR) {
            contexts = ($context.get(ast.children[0].source) || []).map(c => $contextColors[c])
        }
    }

    function calculateColor(ast, {varColors, conColors}) {
        if (ast.type === nodeType.VAR) {
            return varColors[ast.source]
        } else if (ast.type === nodeType.CON) {
            return conColors[ast.source]
        } else if (ast.type === nodeType.APP) {
            return calculateColor(ast.children[0], {varColors, conColors})
        } else if (ast.type === nodeType.LIST) {
            return conColors['List']
        } else if (ast.type === nodeType.FUN) {
            return conColors['Function']
        } else if (ast.type === nodeType.TUPLE) {
            return conColors['Tuple']
        } else if (ast.type === nodeType.UNIT) {
            console.log(conColors)
            console.log('unit')
            return conColors['Unit']
        }
        else {
            return undefined
        }
    }


</script>
{#if ast['type'] === undefined}
    <span>Nothing to show here</span>
{:else if ast.type === nodeType.PAREN}
    <svelte:self hasSibling={hasSibling} ast={ast.child}></svelte:self>
{:else if ast.type === nodeType.VAR}
    <Tile color={color} hasSibling={hasSibling} text={ast.source} predicates={contexts}></Tile>
{:else if ast.type === nodeType.UNIT}
    <Tile color={color} hasSibling={hasSibling} text={'( )'}></Tile>
{:else if ast.type === nodeType.CON}
    <Tile color={color} hasSibling={hasSibling} text={ast.source.slice(0,2)}></Tile>
{:else if ast.type === nodeType.APP}
    <Tile color={color}
          hasSibling={hasSibling}
          text={ast.children[0].source.slice(0,2)}
          predicates={contexts}
    >
        {#each ast.children.slice(1) as child, index}
            <svelte:self
                    ast={child}
                    hasSibling={index < ast.children.length - 2 || hasSibling}
            ></svelte:self>
        {/each}

    </Tile>
{:else if ast.type === nodeType.TUPLE}
    <Tile color={color} hasSibling={hasSibling} text="(,)">
        {#each ast.children as child, index}
            <svelte:self
                    ast={child}
                    hasSibling={index < ast.children.length - 1  || hasSibling}
            ></svelte:self>
        {/each}

    </Tile>
{:else if ast.type === nodeType.LIST}
    <Tile color={color} hasSibling={hasSibling} text="List">
        <svelte:self
                hasSibling={hasSibling}
                ast={ast.child}></svelte:self>
    </Tile>
{:else if ast.type === nodeType.FUN && ast.result.type === nodeType.FUN}
    <div style="display: grid;grid-template-columns: repeat(2, auto); height: 100%">
        <Tile variant="function-curried" color={color} hasSibling={hasSibling}>
            <svelte:self ast={ast.arg} ></svelte:self>

        </Tile>
        <svelte:self ast={ast.result} hasSibling={hasSibling}></svelte:self>
    </div>

{:else if ast.type === nodeType.FUN}
    <Tile color={color} variant="function"
          hasSibling={hasSibling}>
        <svelte:self
                slot="arg"
                ast={ast.arg}></svelte:self>
        <svelte:self
                slot="body"
                hasSibling={hasSibling}
                ast={ast.result}></svelte:self>

    </Tile>
{/if}

<style>

</style>