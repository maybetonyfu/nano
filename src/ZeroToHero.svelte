<script>
    import {writable} from "svelte/store";
    import {levels} from "./level.js";
    import HType from "./HType.svelte";
    const debounce = (fn, ms = 0) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), ms);
        };
    };
    let level = 1;
    let intro = false;
    let status = ["Init", "You did not make any changes."];
    let answer = "undefined";
    let conColors = writable({});
    let cons = writable(new Set());
    let actualType = 'a'
    let validExpression = true
    let pointFree = false
    let parseError = ""
    $: currentLevel = levels[level - 1];
    $: target = currentLevel.target;
    $: availableFunctions = currentLevel.availableFunctions;
    $: isLastPuzzle = level === levels.length;
    $: showNextLevel = !isLastPuzzle && status[0] === "ok";
    $: init = currentLevel.init;
    $: showDiagram = level % 2 === 0;
    $: testing = currentLevel.testing
    $: zeroType = currentLevel.zeroType
    $: lhs = pointFree ? currentLevel.lhsPointFree : currentLevel.lhsNormal
    $: {
        if (level === levels.length && status[0] === "ok") {
            confirm("You have completed all puzzles. Congratulations!");
        }
    }
    let checking = Promise.resolve();
    let handleAttempt = () => {
        if (answer.includes("undefined")) {
            status = ["failed", "Using undefined is not allowed"];
        } else if (answer.includes('zeroToHero')) {
            status = ['failed', 'Cannot recursively define the function']
        } else {
            checking = typeCheck(answer);
        }
    };

    let typeCheck = async (t) => {
        let funs = availableFunctions.map(
            (f) => `${f.name} :: ${f.sig}\n${f.name} = undefined`
        );
        let text = [
            ...init,
            "und = undefined",
            ...funs,
            `zeroToHero :: ${target}`,
            lhs + ' ' + t,
        ].join("\n");
        let response = await fetch("https://nano-znog.onrender.com/", {
            method: "POST",
            body: text,
            headers: {"Content-Type": "text/plain"},
        });
        let result = await response.json();
        status = [result["status"], result["message"]];
    }



    let realtimeCheck = (debounce(async () => {
        parseError = "Checking ..."
        let funs = availableFunctions.map(
            (f) => `${f.name} :: ${f.sig}\n${f.name} = undefined`
        );
        let text = [
            ...init,
            `data SKOLEMa = A`,
            `data SKOLEMb = B`,
            `data SKOLEMc = C`,
            `data SKOLEMd = D`,
            `data SKOLEMe = E`,
            ...funs,
            lhs + ' ' + answer,
            testing,
        ].join("\n");
        let queryResponse = await fetch('https://nano-znog.onrender.com/b', {
            method: "POST",
            body: text,
            headers: {"Content-Type": "text/plain"},
        })
        let queryResult = await queryResponse.json();
        if (queryResult['status'] === 'ok' && queryResult['message'].includes('::')) {
            actualType = zeroType + ' -> ' + queryResult["message"].split("::")[1].trim().replaceAll('SKOLEM', '_');
            console.log(actualType)
            validExpression = true
        } else {
            validExpression = false
            let errorMessage =  queryResult['message'].match(/error[^\|]*\|/g)
            if (errorMessage.length !== 0) {
                parseError = errorMessage[0].replaceAll('|', '').replaceAll(/\(line\s\d+\)/g, '').replaceAll('SKOLEM', '')
                if (parseError.includes("Couldn't match")) {
                    parseError = "Your definition is not well-typed."
                }
            }
        }
    }, 300))

    let nextLevel = () => {
        level = level + 1;
        status = ["Init", "You did not make any changes."];
        answer = "undefined";
        actualType = 'a'
        realtimeCheck()

    };

    let skip = () => {
        if (level < levels.length) {
            level = level + 1
            status = ["Init", "You did not make any changes."];
            answer = "undefined";
            actualType = 'a'
            realtimeCheck()

        } else {
            alert("This is the last puzzle")
        }
    }

    let dismiss = () => {
        intro = false
    }

    let togglePointFree = () => {
        pointFree = !pointFree
        realtimeCheck()

    }

    let toggleDiagram = () => {
        showDiagram = !showDiagram
    }
</script>

<dialog open={intro} class=" bg-indigo-800 inset-y-1/2 text-white p-10 z-10 rounded-md w-1/2">
    <p class="my-2">Welcome to the game of Zero to Hero. In this game, you will complete each level by implementing the
        function "zeroToHero".
        This function convert a "Zero" type value to a "Hero" type value. The definition of "Zero" and "Hero" may vary
        from level to level.
        Each level has a list of functions available. Make sure to use them as they are the only functions you can
        use.</p>
    <form method="dialog">
        <button class="bg-green-200 text-black px-4 py-1 rounded-md" on:click={dismiss}>OK</button>
    </form>
</dialog>

<main class="flex h-full flex-col bg-gray-200 overflow-hidden">
    <nav class=" flex bg-gray-100 p-1 justify-between items-center">
        <div>
            <button
                    class="bg-blue-300 px-2 py-1 rounded-md"
                    on:click={handleAttempt}>Attempt
            </button
            >
            <button
                    class="bg-blue-300 px-2 py-1 rounded-md"
                    on:click={skip}>Skip
            </button
            >
            {#if showNextLevel}
                <button
                        class="bg-green-500 text-white px-2 py-1 rounded-md"
                        on:click={nextLevel}>Next Puzzle
                </button
                >
            {/if}
        </div>
        <div>
            Level {level} / {levels.length}
        </div>
        <div class="flex gap-2 items-center">
            <div>Toggle Diagram</div>
            <button on:click={toggleDiagram}
                    class={"flex items-center space-x-2 bg-gray-400 w-14 h-8 px-1 rounded-full " + (showDiagram ? "justify-end" : 'justify-start') }>
                <div class={"rounded-full w-6 h-6 " + (showDiagram ? "bg-green-300" : 'bg-gray-800')}></div>
            </button>
        </div>
    </nav>
    <section class="left h-full flex">
        <div class="w-1/2 p-2 flex flex-col h-full w-full gap-y-2">
            <div class=" flex flex-col">
                <h1 class="bg-gray-300 text-gray-700 font-bold p-2 rounded-t-md"> To Implement</h1>
                <div class="code bg-white p-2 rounded-b-md">
                    <HType name={'zeroToHero'} variant={showDiagram ? 'diagram' : 'text'} sig={target}
                           {conColors} {cons}/>
                </div>
            </div>
            <div  class="flex flex-col">
                <h1 class="bg-gray-300 text-gray-700 font-bold p-2 rounded-t-md"> Your Answer</h1>

                <div class="code bg-white p-2">
                    <HType name={'zeroToHero'} variant={showDiagram ? 'diagram' : 'text'} sig={actualType}
                           {conColors} {cons}/>
                </div>
                {#if validExpression}
                    <div class="p-2 text-sm text-black bg-green-200 rounded-b-md">Your definition has valid syntax, but it may still fail to type
                        check.
                    </div>
                {:else}
                    <div class="p-2 text-sm text-black bg-red-200 rounded-b-md">{parseError}
                    </div>
                {/if}
            </div>
            <div class="flex flex-col h-1/3">
                <div class="bg-gray-300 text-gray-700 font-bold p-2 rounded-t-md flex justify-between items-center">
                    <h1 >Edit code here </h1>
                    <div class="flex gap-x-2 items-center">
                        <h2>Point free</h2>
                        <button on:click={togglePointFree}
                                class={"flex items-center space-x-2 bg-gray-400 w-14 h-8 px-1 rounded-full " + (pointFree ? "justify-end" : 'justify-start') }>
                            <div class={"rounded-full w-6 h-6 " + (pointFree ? "bg-green-300" : 'bg-gray-700')}></div>
                        </button>
                    </div>
                </div>



                    <div class="flex h-full">
                        <div class="p-2 code bg-gray-100 font-bold text-gray-600"> {lhs} </div>
                        <textarea
                                spellcheck="false"
                                class="flex-grow code bg-white p-2 outline-none"
                                bind:value={answer}
                                on:input={realtimeCheck}
                        ></textarea>
                    </div>
            </div>

            <div class="output flex flex-grow flex-col items-start">
                {#await checking}
                    <div
                            class="p-2 bg-gray-400 text-white  rounded-t-md w-full"
                    >
                        Status: Checking
                    </div>
                {:then _}
                    {#if status[0] === "ok"}
                        <div
                                class="p-2 bg-green-500 text-white rounded-t-md w-full"
                        >
                            Status: Passed
                        </div>
                    {:else if status[0] === "failed"}
                        <div
                                class="p-2 bg-red-500 text-white rounded-t-md w-full"
                        >
                            Status: Failed
                        </div>
                    {:else}
                        <div
                                class="p-2 bg-gray-400 text-white rounded-t-md w-full"
                        >
                            Status: Init
                        </div>
                    {/if}
                {/await}

                <div class="p-2 bg-gray-700 text-white rounded-b-md h-full w-full relative">
                    <div class="absolute inset-2 overflow-auto">
                        <pre>{status[1]}</pre>
                    </div>
                </div>
            </div>

        </div>

    <aside
            class="right m-2 p-2 w-1/2 bg-gray-100 w-full rounded-md relative"
    >
        <div class="absolute inset-2 overflow-auto">

            <h1 class="font-bold">Available Functions</h1>
            {#each availableFunctions as fun}
                <div class="code bg-white my-2 p-2 rounded-md">
                    {#if fun.comment}
                        <div>
                            <div class="text-gray-100 bg-green-600 rounded-full w-max px-3">{fun.comment}</div>
                        </div>
                    {/if}
                    <HType name={fun.name} variant={showDiagram ? 'diagram' : 'text'} sig={fun.sig} {conColors}
                           {cons}/>
                </div>
            {/each}
        </div>
    </aside>
    </section>

</main>

<style>
    :global(body, html, #app) {
        height: 100%;
    }

    .code {
        font-family: "Roboto Mono", monospace;
    }

</style>
