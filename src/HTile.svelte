<script>
    import chroma from 'chroma-js';
    import ListSymbol from "./ListSymbol.svelte";
    import NumberSymbol from "./NumberSymbol.svelte";
    import BoolSymbol from "./BoolSymbol.svelte";
    import TupleSymbol from "./TupleSymbol.svelte";
    export let color;
    export let predicates = [];
    export let hasSibling;
    export let icon = null;
    export let variant = 'app';
    export let text = null;
    const innerConner = 9
    const outerConner = 10
    const gap = 2
    const connerStyles = {
        'outerHalf': `polygon(${outerConner}px 0, 100% 0, 100% 100%, 0 100%, 0 ${outerConner}px)`,
        'outerFull': `polygon(${outerConner}px 0, 100% 0, 100% calc(100% - ${outerConner}px), calc(100% - ${outerConner}px) 100%, 0 100%, 0 ${outerConner}px)`,
        'innerHalf': `polygon(${innerConner}px 0, 100% 0, 100% 100%, 0 100%, 0 ${innerConner}px)`,
        'innerFull': `polygon(${innerConner}px 0, 100% 0, 100% calc(100% - ${innerConner}px), calc(100% - ${innerConner}px) 100%, 0 100%, 0 ${innerConner}px)`,
    }

    let width,
        height,
        outerConnerStyle,
        innerConnerStyle,
        marginStyle,
        textColor;

    $: outerConnerStyle = hasSibling ? connerStyles.outerHalf : connerStyles.outerFull;
    $: innerConnerStyle = hasSibling ? connerStyles.innerHalf : connerStyles.innerFull;
    $: marginStyle = (() => {
        console.log(text)

        let offset = 0;
        if (variant === 'function-curried' && hasSibling) {
            offset = -12
        } else if (variant === 'function-curried') {
            offset = -10
        } else if (hasSibling) {
            offset = -2
        }

        return `${offset}px`
    })()

    $: innerWidth = `${width - gap * 2}px`;
    $: innerHeight = `${height - gap * 2}px`;
    $: textColor =  (() => {
        try {
            return chroma(color).luminance() > 0.5 ? 'black' : 'white';
        } catch (_) {
            return 'black'
        }
    })()

</script>
<section class={variant}
         style:clip-path={outerConnerStyle}
         bind:offsetWidth={width}
         bind:offsetHeight={height}
         style:margin-right={marginStyle}
>
    <div class="inner"
         style:width={innerWidth}
         style:height={innerHeight}
         style:background-color={color}
         style:clip-path={innerConnerStyle}
    ></div>
    {#if text === 'Li'}
        <div class="absolute bottom-1 left-1">
            <ListSymbol class="w-5 h-5"></ListSymbol>
        </div>

    {:else if text === '(,)'}
        <div class="absolute bottom-1 left-1"  style:color={textColor} >
            <TupleSymbol class="w-6 h-6"></TupleSymbol>
        </div>
    {:else if text === 'Int'}
        <div class="absolute bottom-1 left-1"  style:color={textColor} >
            <NumberSymbol class="w-5 h-5"></NumberSymbol>
        </div>
    {:else if text === 'Bool'}
        <div class="absolute bottom-1 left-1"  style:color={textColor} >
            <BoolSymbol class="w-5 h-5"></BoolSymbol>
        </div>
    {:else}
        <span class="text" style:color={textColor}>
            {text ? text.slice(0,2) : ''}
        </span>
    {/if}

    <div class="predicates">
        {#each predicates as pred}
            <div class="pred-wrapper">
                <div class="pred" style:background-color={pred}></div>
                <div class="pred-bar"></div>
            </div>
        {/each}
    </div>

    {#if variant === 'function-curried'}
        <svg class="function-icon" width="39" height="18" viewBox="0 0 39 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H7L15.5 9H9.5L1 1Z" />
            <path d="M1 17H7L15.5 9H9.5L1 17Z" />
            <path d="M12.5 1H18.5L27 9H21L12.5 1Z" />
            <path d="M12.5 17H18.5L27 9H21L12.5 17Z" />
            <path d="M24 1H30L38.5 9H32.5L24 1Z" />
            <path d="M24 17H30L38.5 9H32.5L24 17Z" />
        </svg>

        <div class="arg">
            <slot></slot>
        </div>
    {:else if variant === 'function'}
        <svg class="function-icon" width="39" height="18" viewBox="0 0 39 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H7L15.5 9H9.5L1 1Z" />
            <path d="M1 17H7L15.5 9H9.5L1 17Z" />
            <path d="M12.5 1H18.5L27 9H21L12.5 1Z" />
            <path d="M12.5 17H18.5L27 9H21L12.5 17Z" />
            <path d="M24 1H30L38.5 9H32.5L24 1Z" />
            <path d="M24 17H30L38.5 9H32.5L24 17Z" />
        </svg>

        <div class="arg">
            <slot name="arg"></slot>
        </div>
        <div class="body">
            <slot name="body"></slot>
        </div>
    {:else}
        <div class="args">
            <slot></slot>
        </div>
    {/if}
</section>
<style>
    section {
        height: 100%;
        position: relative;
        display: grid;
        background-color: black;
    }

    .app {
        grid-template-rows: 15px minmax(20px, auto);
        grid-template-columns: 35px minmax(15px, auto);
    }

    .args {
        height: 100%;
        grid-column: 2/3;
        grid-row: 2/3;
        display: flex;
        flex-direction: row;
    }

    .function {
        grid-template-rows: 15px minmax(20px, auto);
        grid-template-columns: minmax(15px, auto) 20px minmax(15px, auto);
    }   

    .arg {
        height: 100%;
        grid-column: 1/2;
        grid-row: 2/3;
    }

    .body {
        height: 100%;
        grid-column: 3/4;
        grid-row: 2/3;
    }

    .function-curried {
        grid-template-rows: 15px minmax(20px, auto);
        grid-template-columns: minmax(15px, auto) 25px;
    }

    .inner {
        position: absolute;
        top: 2px;
        left: 2px;
    }
    .text {
        position: absolute;
        bottom: 3px;
        left: 5px;
        font-size: 1.1rem;
        font-family: 'Orbitron', sans-serif;
        font-weight: 500;
    }
    .function-icon {
        position: absolute;
        top: 3px;
        left: 10px;
        height: 12px;
        fill: white;
    }


    .predicates {
        position: absolute;
        top: 5px;
        right: 0;
        display: flex;
        flex-direction: column;
        width: 18px;
    }

    .pred {
        border-radius: 5px;
        border: black 2px solid;
        width: 8px;
        height: 7px;
    }
    .pred-bar {
        height: 2px;
        width: 100%;
        background-color: black;
    }
    .pred-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1px;
    }

</style>