export let levels = [
    {
        init: ["data Zero a = Zero", "data Hero a = Hero"],
        target: "Zero a -> Hero a",
        testing: 'b = zeroToHero (Zero :: Zero SKOLEMa)',
        zeroType: 'Zero sa', 
        availableFunctions: [
            {name: "runZero", sig: "Zero a -> a", comment: ""},
            {name: "mkHero", sig: "a -> Hero a", comment: ""},
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
        testing: 'b = zeroToHero (Zero :: Zero SKOLEMa)',
        zeroType: 'Zero sa', 
        availableFunctions: [
            {name: "f1", sig: "Zero a -> Hero a", comment: ""},
            {name: "f2", sig: "Zero a -> (a, a)", comment: ""},
            {name: "f3", sig: "Hero a -> Hero (a, a)", comment: ""},
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
        testing: 'b = zeroToHero (Zero :: Zero SKOLEMa SKOLEMb)',
        zeroType: 'Zero sa sb', 
        availableFunctions: [
            {name: "f1", sig: "Zero a b -> Hero b a", comment: ""},
            {name: "f2", sig: "Zero a a -> Hero a a", comment: ""},
            {name: "f3", sig: "Zero a b -> Zero b a", comment: ""},
            {name: "f4", sig: "Zero a b -> Zero b b", comment: ""},
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
        testing:  'b = zeroToHero (Zero :: Zero SKOLEMa SKOLEMb SKOLEMc)',
        zeroType: 'Zero sa sb sc', 
        availableFunctions: [
            {name: "f1", sig: "Zero a b c-> Zero c b a", comment: ""},
            {name: "f2", sig: "Zero a b c -> Zero a c c", comment: ""},
            {name: "f3", sig: "Zero a b c -> Hero b c", comment: ""},
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
        testing:  'b = zeroToHero (undefined :: SKOLEMa -> SKOLEMd) (undefined :: SKOLEMb -> SKOLEMd) (undefined :: SKOLEMc -> SKOLEMd) Zero :: (Zero SKOLEMa SKOLEMb SKOLEMc)',
        zeroType: '(sa -> sd) -> (sb -> sd) -> (sc -> sd) -> Zero sa sb sc', 
        availableFunctions: [
            {
                name: "fmap",
                sig: "(c -> d) -> Zero a b c -> Zero a b d",
                comment: "",
            },
            {name: "f1", sig: "Zero a b c -> Zero c a b", comment: ""},
            {name: "f2", sig: "Zero a b c -> Hero a b c", comment: ""},
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
        testing:  'b =  zeroToHero (Zero :: Zero SKOLEMa SKOLEMb SKOLEMc SKOLEMd)',
        zeroType: 'Zero sa sb sc sd', 
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