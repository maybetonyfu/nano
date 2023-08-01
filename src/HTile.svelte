<script>
    import chroma from 'chroma-js';
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
    {#if text !== 'List'}
    <span class="text" style:color={textColor}>
        {text ? text : ''}
    </span>
    {/if}
    {#if text === 'List'}
        <svg class="list-icon" width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_140_226)">
                <rect width="3" height="3" fill="black"/>
                <rect y="5" width="3" height="3" fill="black"/>
                <rect y="10" width="3" height="3" fill="black"/>
                <rect x="5" width="15" height="3" fill="black"/>
                <rect x="5" y="5" width="15" height="3" fill="black"/>
                <rect x="5" y="10" width="15" height="3" fill="black"/>
            </g>
            <defs>
                <clipPath id="clip0_140_226">
                    <rect width="20" height="13" fill="white"/>
                </clipPath>
            </defs>
        </svg>

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
        grid-template-rows: 30px minmax(20px, auto);
        grid-template-columns: 35px minmax(20px, auto);
    }

    .args {
        height: 100%;
        grid-column: 2/3;
        grid-row: 2/3;
        display: flex;
        flex-direction: row;
    }

    .function {
        grid-template-rows: 20px minmax(20px, auto);
        grid-template-columns: minmax(20px, auto) 20px minmax(20px, auto);
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
        grid-template-rows: 20px minmax(20px, auto);
        grid-template-columns: minmax(20px, auto) 25px;
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
        height: 1rem;
        fill: white;
    }

    .list-icon {
        position: absolute;
        bottom: 8px;
        left: 5px;
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
        height: 4px;
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