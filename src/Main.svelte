<script>
    import Router from 'svelte-spa-router'
    import ZeroToHero from "./ZeroToHero.svelte";
    import Notation from "./Notation.svelte";
    const routes = {
        '/': ZeroToHero,
        '/notation': Notation,
    }
</script>

<body>
    <Router {routes} />
</body>