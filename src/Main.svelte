<script>
    import { writable } from "svelte/store";
    import HType from "./HType.svelte";
    let level = 1;
    let intro = true;
    let status = ["Init", "You did not make any changes."];
    let answer = "zeroToHero = undefined";
    let conColors = writable({});
    let cons = writable(new Set());
    let levels = [
        {
            init: ["data Zero a = Zero", "data Hero a = Hero"],
            target: "Zero a -> Hero a",
            availableFunctions: [
                { name: "runZero", sig: "Zero a -> a", comment: "" },
                { name: "mkHero", sig: "a -> Hero a", comment: "" },
                {
                    name: "(.)",
                    sig: "(b -> c) -> (a -> b) -> a -> c",
                    comment: "",
                },
            ],
        },
        {
            init: ["data Zero a = Zero", "data Hero a = Hero"],
            target: "Zero a -> Hero (a, a)",
            availableFunctions: [
                { name: "f1", sig: "Zero a -> Hero a", comment: "" },
                { name: "f2", sig: "Zero a -> (a, a)", comment: "" },
                { name: "f3", sig: "Hero a -> Hero (a, a)", comment: "" },
                {
                    name: "(.)",
                    sig: "(b -> c) -> (a -> b) -> a -> c",
                    comment: "",
                },
            ],
        },
        {
            init: ["data Zero a b = Zero", "data Hero a b = Hero"],
            target: "Zero a b -> Hero b b",
            availableFunctions: [
                { name: "f1", sig: "Zero a b -> Hero b a", comment: "" },
                { name: "f2", sig: "Zero a a -> Hero a a", comment: "" },
                { name: "f3", sig: "Zero a b -> Zero b a", comment: "" },
                { name: "f4", sig: "Zero a b -> Zero b b", comment: "" },
                {
                    name: "(.)",
                    sig: "(b -> c) -> (a -> b) -> a -> c",
                    comment: "",
                },
            ],
        },
        {
            init: ["data Zero a b c = Zero", "data Hero a b = Hero"],
            target: "Zero a b c -> Hero c a",
            answer: "zeroToHero = undefined",
            availableFunctions: [
                { name: "f1", sig: "Zero a b c-> Zero c b a", comment: "" },
                { name: "f2", sig: "Zero a b c -> Zero a c c", comment: "" },
                { name: "f3", sig: "Zero a b c -> Hero b c", comment: "" },
                {
                    name: "(.)",
                    sig: "(b -> c) -> (a -> b) -> a -> c",
                    comment: "",
                },
            ],
        },
        {
            init: ["data Zero a b c = Zero", "data Hero a b c = Hero"],
            target: "(a -> d) -> (b -> d)  -> (c -> d) -> Zero a b c ->  Hero a d c",
            availableFunctions: [
                {
                    name: "fmap",
                    sig: "(c -> d) -> Zero a b c -> Zero a b d",
                    comment: "",
                },
                { name: "f1", sig: "Zero a b c -> Zero c a b", comment: "" },
                { name: "f2", sig: "Zero a b c -> Hero a b c", comment: "" },
                {
                    name: "(.)",
                    sig: "(b -> c) -> (a -> b) -> a -> c",
                    comment: "",
                },
            ],
        },
        {
            init: ["data Zero a b c d = Zero", "data Hero a b c d = Hero"],
            target: "Zero a b c d ->  Hero d d d d",
            availableFunctions: [
                {
                    name: "f1",
                    sig: "Zero a b c d -> Zero a a b b",
                    comment: "",
                },
                {
                    name: "f2",
                    sig: "Zero a b c d -> Hero c c d d",
                    comment: "",
                },
                {
                    name: "f3",
                    sig: "Zero a b c d -> Zero d c b a",
                    comment: "",
                },
                {
                    name: "(.)",
                    sig: "(b -> c) -> (a -> b) -> a -> c",
                    comment: "",
                },
            ],
        },
    ];
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
    };

    let nextLevel = () => {
        level = level + 1;
        status = ["Init", "You did not make any changes."];
        answer = "zeroToHero = undefined";
    };

    let skip = () => {
        if (level < levels.length) {
            level = level + 1
            status = ["Init", "You did not make any changes."];
             answer = "zeroToHero = undefined";
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
        <div />
    </nav>
    <section class="left h-full flex">
        <div class="w-1/2 p-2 flex flex-col h-full w-full">
            <div class=" h-1/2 flex flex-col">
                <div class="bg-blue-200 rounded-md p-2 mb-2">
                    Please complete the following code. 
                    Click the <span class="inline-block bg-blue-300 px-1 py-0.5 rounded-md">Attempt</span> button at top left to check your answer. The
                    type is defined for you. Change only the function
                    declaration. Available functions are listed on the
                    right side.
                </div>
                <div class=" code p-2 bg-white rounded-t-md">
                    zeroToHero :: {target}
                </div>
                <textarea
                    spellcheck="false"
                    class=" code bg-white w-full p-2 h-full outline-none rounded-b-md"
                    bind:value={answer}
                />
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
                    {:else if status[0] == "failed"}
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
                        <div>{fun.name} :: {fun.sig}</div>
                        {#if showDiagram}
                            <HType sig={fun.sig} {conColors} {cons} />
                        {/if}
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
