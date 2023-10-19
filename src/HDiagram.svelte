<script>
        import { getContext } from "svelte";
        import {nodeType} from "./grammar.js";
        import Tile from "./HTile.svelte";
        export let ast;
    // export let sig;
    export let hasSibling = false;
    let varColors = getContext('varColors');
    let conColors = getContext('conColors');
    let classColors = getContext('classColors');
    let typeClasses = getContext('typeClasses')
    let varSymbols = getContext('varSymbols')
    let currentClasses;
    let color;
    $: {
        console.log(ast['type'])
        if (ast['type']) {
            color = calculateColor(ast, {varColors: $varColors, conColors: $conColors})
        }

        if (ast['type'] === nodeType.VAR) {
            currentClasses = ($typeClasses.get(ast.source) || []).map(c => $classColors[c])
        } else if (ast['type'] === nodeType.APP && ast.children[0].type === nodeType.VAR) {
            currentClasses = ($typeClasses.get(ast.children[0].source) || []).map(c => $classColors[c])
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
    <Tile color={color} hasSibling={hasSibling} text={$varSymbols.get(ast.source)} predicates={currentClasses}></Tile>
{:else if ast.type === nodeType.UNIT}
    <Tile color={color} hasSibling={hasSibling} text={'( )'}></Tile>
{:else if ast.type === nodeType.CON}
    <Tile color={color} hasSibling={hasSibling} text={ast.source}></Tile>
{:else if ast.type === nodeType.APP}
    <Tile color={color}
          hasSibling={hasSibling}
          text={ast.children[0].source}
          predicates={currentClasses}
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
    <Tile color={color} hasSibling={hasSibling} text="Li" textColor="black">
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