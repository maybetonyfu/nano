export let levels = [
    {
        name: 'Trial',
        init: ["data Zero a = DontUseMeZero", "data Hero a = DontUseMeHero"],
        target: "Zero a -> Hero a",
        testing: 'b = zeroToHero (DontUseMeZero :: Zero SKOLEMa)',
        zeroType: 'Zero _a',
        lhsNormal: 'zeroToHero z =',
        lhsPointFree: 'zeroToHero =',
        availableFunctions: [
            {name: "f", sig: "Zero a -> Hero a", comment: ""},
        ],
    },
    {
        name: 'Trial',
        init: ["data Zero a = DontUseMeZero", "data Hero a = DontUseMeHero"],
        target: "Zero a -> Hero a",
        testing: 'b = zeroToHero (DontUseMeZero :: Zero SKOLEMa)',
        zeroType: 'Zero _a',
        lhsNormal: 'zeroToHero z =',
        lhsPointFree: 'zeroToHero =',
        availableFunctions: [
            {name: "runZero", sig: "Zero a -> a", comment: ""},
            {name: "mkHero", sig: "a -> Hero a", comment: ""},
            {
                name: "(.)",
                sig: "(b -> c) -> (a -> b) -> a -> c",
                comment: "New function",
            },
        ],

    },
    {
        name: 'Clone',
        init: ["data Zero a = DontUseMeZero", "data Hero a = DontUseMeHero"],
        target: "Zero a -> Hero (a, a)",
        testing: 'b = zeroToHero (DontUseMeZero :: Zero SKOLEMa)',
        zeroType: 'Zero _a',
        lhsNormal: 'zeroToHero z =',
        lhsPointFree: 'zeroToHero =',
        availableFunctions: [
            {name: "f1", sig: "Zero a -> Hero a", comment: ""},
            {name: "f2", sig: "Zero a -> (a, a)", comment: ""},
            {name: "f3", sig: "Hero a -> Hero (a, a)", comment: ""},
            {name: "($)", sig: "(a -> b) -> a -> b", comment: "New function"},
            {
                name: "(.)",
                sig: "(b -> c) -> (a -> b) -> a -> c",
                comment: "",
            },
        ],
    },
    {
        name: 'Tuple',
        init: ["data Zero a b = DontUseMeZero", "data Hero a = DontUseMeHero"],
        target: "Zero a b -> Hero (a, b)",
        testing: 'b = zeroToHero (DontUseMeZero :: Zero SKOLEMa SKOLEMb)',
        zeroType: 'Zero _a _b',
        lhsNormal: 'zeroToHero z =',
        lhsPointFree: 'zeroToHero =',
        availableFunctions: [
            {name: "fst", sig: "(a, b) -> a", comment: ""},
            {name: "snd", sig: "(a, b) -> b", comment: ""},
            {name: "f1", sig: "Zero a b -> Zero a (a, b)", comment: ""},
            {name: "f2", sig: "Zero a b -> Hero (b, a)", comment: ""},
            {name: "f3", sig: "Zero a b -> (Hero a, Hero b)", comment: ""},
            {name: "($)", sig: "(a -> b) -> a -> b", comment: ""},
            {name: "curry", sig: "((a, b) -> c) -> a -> b -> c", comment: "New function"},
            {
                name: "(.)",
                sig: "(b -> c) -> (a -> b) -> a -> c",
                comment: "",
            },
        ],
    },
    {
        init: ["data Zero a b = DontUseMeZero", "data Hero a b = DontUseMeHero"],
        target: "Zero a b -> Hero b b",
        testing: 'b = zeroToHero (DontUseMeZero :: Zero SKOLEMa SKOLEMb)',
        zeroType: 'Zero _a _b',
        lhsNormal: 'zeroToHero z =',
        lhsPointFree: 'zeroToHero =',
        availableFunctions: [
            {name: "f1", sig: "Zero a b -> Hero b a", comment: ""},
            {name: "f2", sig: "Zero a a -> Hero a a", comment: ""},
            {name: "f3", sig: "Zero a b -> Zero b a", comment: ""},
            {name: "f4", sig: "Zero a b -> Zero b b", comment: ""},
            {name: "($)", sig: "(a -> b) -> a -> b", comment: ""},
            {name: "curry", sig: "((a, b) -> c) -> a -> b -> c", comment: ""},
            {name: "uncurry", sig: "(a -> b -> c) -> (a, b) -> c", comment: "New function"},

            {
                name: "(.)",
                sig: "(b -> c) -> (a -> b) -> a -> c",
                comment: "",
            },
        ],
    },
    // {
    //     name: "Curry",
    //     init: ["data Zero a b = DontUseMeZero", "data Hero a = DontUseMeHero"],
    //     target: "Zero a b -> Hero b",
    //     testing: 'b = zeroToHero (DontUseMeZero :: Zero SKOLEMa SKOLEMb)',
    //     zeroType: 'Zero _a _b',
    //     lhsNormal: 'zeroToHero z =',
    //     lhsPointFree: 'zeroToHero =',
    //     availableFunctions: [
    //         {name: "f1", sig: "Zero a b -> Hero (a -> b)", comment: ""},
    //         {name: 'f2', sig: 'Zero a b -> Hero a', comment: ''},
    //         {name: '(<*>)', sig:'Hero (a -> b) -> Hero a -> Hero b', comment: ''},
    //         {name: "($)", sig: "(a -> b) -> a -> b", comment: ""},
    //         {name: "curry", sig: "((a, b) -> c) -> a -> b -> c", comment: ""},
    //         {name: "uncurry", sig: "(a -> b -> c) -> (a, b) -> c", comment: ""},
    //         {
    //             name: "(.)",
    //             sig: "(b -> c) -> (a -> b) -> a -> c",
    //             comment: "",
    //         },
    //     ],
    // },

    // {
    //     init: ["data Zero a b c = DontUseMeZero", "data Hero a b = DontUseMeHero"],
    //     target: "Zero a b c -> Hero c a",
    //     answer: "zeroToHero = undefined",
    //     testing:  'b = zeroToHero (DontUseMeZero :: Zero SKOLEMa SKOLEMb SKOLEMc)',
    //     zeroType: 'Zero _a _b _c',
    //     lhsNormal: 'zeroToHero z =',
    //     lhsPointFree: 'zeroToHero =',
    //     availableFunctions: [
    //         {name: "f1", sig: "Zero a b c-> Zero c b a", comment: ""},
    //         {name: "f2", sig: "Zero a b c -> Zero a c c", comment: ""},
    //         {name: "f3", sig: "Zero a b c -> Hero b c", comment: ""},
    //         {name: "($)", sig: "(a -> b) -> a -> b", comment: ""},
    //         {name: "curry", sig: "((a, b) -> c) -> a -> b -> c", comment: ""},
    //         {name: "uncurry", sig: "(a -> b -> c) -> (a, b) -> c", comment: ""},
    //         {
    //             name: "(.)",
    //             sig: "(b -> c) -> (a -> b) -> a -> c",
    //             comment: "",
    //         },
    //     ],
    // },
    // {
    //     init: ["data Zero a b c = DontUseMeZero", "data Hero a b c = DontUseMeHero"],
    //     target: "(a -> d) -> (b -> d)  -> (c -> d) -> Zero a b c ->  Hero a d c",
    //     testing:  'b = zeroToHero (undefined :: SKOLEMa -> SKOLEMd) (undefined :: SKOLEMb -> SKOLEMd) (undefined :: SKOLEMc -> SKOLEMd) (DontUseMeZero :: Zero SKOLEMa SKOLEMb SKOLEMc)',
    //     zeroType: '(_a -> _d) -> (_b -> _d) -> (_c -> _d) -> Zero _a _b _c',
    //     lhsNormal: 'zeroToHero ad bd cd z =',
    //     lhsPointFree: 'zeroToHero ad bd cd =',
    //     availableFunctions: [
    //         {
    //             name: "fmap",
    //             sig: "(c -> d) -> Zero a b c -> Zero a b d",
    //             comment: "",
    //         },
    //         {name: "f1", sig: "Zero a b c -> Zero c a b", comment: ""},
    //         {name: "f2", sig: "Zero a b c -> Hero a b c", comment: ""},
    //         {name: "($)", sig: "(a -> b) -> a -> b", comment: ""},
    //         {name: "curry", sig: "((a, b) -> c) -> a -> b -> c", comment: ""},
    //         {name: "uncurry", sig: "(a -> b -> c) -> (a, b) -> c", comment: ""},
    //         {
    //             name: "(>>>)",
    //             sig: "(a -> b)  -> (b -> c) -> a -> c",
    //             comment: "New function",
    //         },
    //         {
    //             name: "(.)",
    //             sig: "(b -> c) -> (a -> b) -> a -> c",
    //             comment: "",
    //         },
    //     ],
    // },
    // {
    //     init: ["data Zero a b c d = DontUseMeZero", "data Hero a b c d = DontUseMeHero"],
    //     target: "Zero a b c d ->  Hero d d d d",
    //     testing:  'b =  zeroToHero (DontUseMeZero :: Zero SKOLEMa SKOLEMb SKOLEMc SKOLEMd)',
    //     zeroType: 'Zero _a _b _c _d',
    //     lhsNormal: 'zeroToHero z =',
    //     lhsPointFree: 'zeroToHero =',
    //     availableFunctions: [
    //         {
    //             name: "f1",
    //             sig: "Zero a b c d -> Zero a a b b",
    //             comment: "",
    //         },
    //         {
    //             name: "f2",
    //             sig: "Zero a b c d -> Hero c c d d",
    //             comment: "",
    //         },
    //         {
    //             name: "f3",
    //             sig: "Zero a b c d -> Zero d c b a",
    //             comment: "",
    //         },
    //         {name: "($)", sig: "(a -> b) -> a -> b", comment: ""},
    //         {name: "curry", sig: "((a, b) -> c) -> a -> b -> c", comment: ""},
    //         {name: "uncurry", sig: "(a -> b -> c) -> (a, b) -> c", comment: ""},
    //         {
    //             name: "(.)",
    //             sig: "(b -> c) -> (a -> b) -> a -> c",
    //             comment: "",
    //         },
    //     ],
    // },
    // {
    //     init: ["data Zero a b c d = DontUseMeZero", "data Hero a = DontUseMeHero"],
    //     target: "Zero (a -> b -> c -> d) a b c  -> Hero d",
    //     testing:  'b =  zeroToHero (DontUseMeZero :: Zero (SKOLEMa -> SKOLEMb -> SKOLEMc -> SKOLEMd) SKOLEMa SKOLEMb SKOLEMc)',
    //     zeroType: 'Zero (_a -> _b -> _c -> _d) _a _b _c',
    //     lhsNormal: 'zeroToHero z =',
    //     lhsPointFree: 'zeroToHero =',
    //     availableFunctions: [
    //         {
    //             name: "f1",
    //             sig: "Zero (a -> b) a c d -> Zero () b c d",
    //             comment: "",
    //         },
    //         {
    //             name: "f2",
    //             sig: "Zero a b c d -> Zero b c d a",
    //             comment: "",
    //         },
    //         {
    //             name: "f3",
    //             sig: "Zero a b c d -> Hero d",
    //             comment: "",
    //         },
    //         {name: "($)", sig: "(a -> b) -> a -> b", comment: ""},
    //         {name: "curry", sig: "((a, b) -> c) -> a -> b -> c", comment: ""},
    //         {name: "uncurry", sig: "(a -> b -> c) -> (a, b) -> c", comment: ""},
    //         {
    //             name: "(>>>)",
    //             sig: "(a -> b)  -> (b -> c) -> a -> c",
    //             comment: "",
    //         },
    //         {
    //             name: "(.)",
    //             sig: "(b -> c) -> (a -> b) -> a -> c",
    //             comment: "",
    //         },
    //     ],
    // },
];