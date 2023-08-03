<script>
    import { writable } from "svelte/store";
    import {levels} from "./level.js";
    import HType from "./HType.svelte";
    let level = 1;
    let intro = true;
    let status = ["Init", "You did not make any changes."];
    let answer = "zeroToHero = undefined";
    let conColors = writable({});
    let cons = writable(new Set());
    let actualType = 'a'
    let validExpression = true

    $: currentLevel = levels[level - 1];
    $: target = currentLevel.target;
    $: availableFunctions = currentLevel.availableFunctions;
    $: isLastPuzzle = level === levels.length;
    $: showNextLevel = !isLastPuzzle && status[0] === "ok";
    $: init = currentLevel.init;
    $: showDiagram = level % 2 === 0;
    $: {
        if (level === levels.length && status[0] === "ok") {
            confirm("You have completed all puzzles. Congratulations!");
        }
    }
    let checking = Promise.resolve();

    let handleAttempt = () => {
        if (answer.includes("undefined")) {
            status = ["failed", "Using undefined is not allowed"];
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
            t,
        ].join("\n");
        let response = await fetch("https://nano.typecheck.me/", {
            method: "POST",
            body: text,
            headers: { "Content-Type": "text/plain" },
        });
        let result = await response.json();
        status = [result["status"], result["message"]];
    }


    $: (async () => {
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
                answer,
                'b = zeroToHero (Zero :: Zero SKOLEMa)',
            ].join("\n");
            let queryResponse = await fetch('https://nano.typecheck.me/b', {
                method: "POST",
                body: text,
                headers: { "Content-Type": "text/plain" },
            })
            let queryResult = await queryResponse.json();
            if (queryResult['status'] === 'ok' && queryResult['message'].includes('::')) {
                actualType = 'Zero sa -> ' + queryResult["message"].split("::")[1].trim().replaceAll('SKOLEM', 's');
                validExpression = true
            } else {
                validExpression = false

            }
    })()

    let nextLevel = () => {
        level = level + 1;
        status = ["Init", "You did not make any changes."];
        answer = "zeroToHero = undefined";
        actualType = 'a'
    };

    let skip = () => {
        if (level < levels.length) {
            level = level + 1
            status = ["Init", "You did not make any changes."];
             answer = "zeroToHero = undefined";
             actualType = 'a'
        } else {
            alert("This is the last puzzle")
        }
    }
    let dismiss = () => {
        intro = false
        console.log('hello')
    }
</script>

<dialog open={intro} class=" bg-indigo-800 inset-y-1/2 text-white p-10 z-10 rounded-md w-1/2">
    <p class="my-2">Welcome to the game of Zero to Hero. In this game, you will complete each level by implementing the function "zeroToHero". 
        This function convert a "Zero" type value to a "Hero" type value. The definition of "Zero" and "Hero" may vary from level to level. 
        Each level has a list of functions available. Make sure to use them as they are the only functions you can use.</p>
    <form method="dialog">
        <button class="bg-green-200 text-black px-4 py-1 rounded-md" on:click={dismiss}>OK</button>
    </form>
</dialog>

<main class="flex h-full flex-col bg-gray-200 overflow-hidden">
    <nav class=" flex bg-gray-100 p-1 justify-between items-center">
        <div>
            <button
                class="bg-blue-300 px-2 py-1 rounded-md"
                on:click={handleAttempt}>Attempt</button
            >
            <button
                class="bg-blue-300 px-2 py-1 rounded-md"
                on:click={skip}>Skip</button
            >
            {#if showNextLevel}
                <button
                    class="bg-green-500 text-white px-2 py-1 rounded-md"
                    on:click={nextLevel}>Next Puzzle</button
                >
            {/if}
        </div>
        <div>
            Level {level} / {levels.length}
        </div>
        <div></div>
    </nav>
    <section class="left h-full flex">
        <div class="w-1/2 p-2 flex flex-col h-full w-full">
            <div class=" h-1/2 flex flex-col">
                <div class="bg-blue-200 rounded-md p-2 mb-2">
                    Please complete the following code. 
                    Click the <span class="inline-block bg-blue-300 px-1 py-0.5 rounded-md">Attempt</span>
                    button at top left to check your answer. The
                    type is defined for you. Change only the function
                    declaration. Available functions are listed on the
                    right side.
                </div>
                <div class="code p-2 bg-white rounded-t-md">
                    zeroToHero :: {target}
                </div>

                <textarea
                    spellcheck="false"
                    class="code bg-white w-full p-2 h-full outline-none rounded-b-md"
                    bind:value={answer}
                ></textarea>

                <div class="flex flex-col mt-2 ">
                    <div class="bg-gray-100 rounded-t-md flex flex-col px-2 py-1">
                        <div class="text-lg">Your answer</div>
                        {#if validExpression}
                            <div class="text-sm text-green-600">Your definition is valid syntax (but may fail in type check).</div>
                        {:else}
                            <div class="text-sm text-red-600">Your definition is invalid syntax.</div>
                        {/if}
                    </div>
                    <div class="code bg-white p-2 rounded-b-md">
                            <HType name={'zeroToHero'} variant={showDiagram ? 'diagram' : 'text'} sig={actualType} {conColors} {cons} />
                    </div>
                </div>
 
            </div>

            <div class="output h-1/2 flex flex-col items-start">
                {#await checking}
                    <div
                        class="p-2 bg-gray-400 text-white my-2 rounded-md w-full"
                    >
                         Status: Checking
                    </div>
                {:then _}
                    {#if status[0] === "ok"}
                        <div
                            class="p-2 bg-green-500 text-white my-2 rounded-md w-full"
                        >
                        Status: Passed
                        </div>
                    {:else if status[0] === "failed"}
                        <div
                            class="p-2 bg-red-500 text-white my-2 rounded-md w-full"
                        >
                        Status: Failed
                        </div>
                    {:else}
                        <div
                            class="p-2 bg-gray-400 text-white my-2 rounded-md w-full"
                        >
                        Status: Init
                        </div>
                    {/if}
                {/await}

                <div class="p-2 bg-gray-100 rounded-t-md">Output</div>
                <div
                    class="p-2 bg-gray-700 text-white rounded-b-md rounded-r-md h-full w-full relative"
                >
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
                <h1 class="font-bold">To Implement</h1>
                <div class="code bg-white my-3 p-2 rounded-md">
                    <div>zeroToHero :: {target}</div>
                    {#if showDiagram}
                        <HType sig={target} {conColors} {cons} />
                    {/if}
                </div>

                <h1 class="font-bold">Available Functions</h1>
                {#each availableFunctions as fun}
                    <div class="code bg-white my-2 p-2 rounded-md">
                   
                        <HType name={fun.name} variant={showDiagram ? 'diagram' : 'text'} sig={fun.sig} {conColors} {cons} />
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
