<script>
import {writable} from "svelte/store";
import {haskellType, semantics, gatherNames} from "./grammar";
import { localVarColors, localConColors, defaultConColors, defaultContextColors, localContextColors} from "./color.js"
import HDiagram from "./HDiagram.svelte";
import { setContext } from "svelte";
export let sig;
export let conColors;
export let cons

let ast = {}
let vars = new Set()
let varColors = writable({})
let classColors = writable({})
let typeClasses = writable(new Map())
setContext('varColors', varColors)
setContext('conColors', conColors)
setContext('classColors', classColors)
setContext('typeClasses', typeClasses)

$: {
    const matchResult = haskellType.match(sig)
    const valid = matchResult.succeeded()
    if (valid) {
        const adapter = semantics(matchResult)
        ast = adapter.parse()
        const names = gatherNames(ast)

        vars = (names.vars)
        Array.from(names.cons).forEach(c => {
            $cons.add(c)
        })

        const _varColors = Object.fromEntries(
            Array.from(names.vars).map((v, i) => {
                return [v, localVarColors[i]]
            })
        )

        const _conColors = Object.fromEntries(
            Array.from($cons).map((c, i) => {
                return [c, defaultConColors[c] || localConColors[i]]
            })
        )
        
        if (ast['context']) {
            const predicates = ast['context'] ? ast['context']['predicates'] : []
            const _classColors = Object.fromEntries(
                Array.from(new Set(predicates.map(p => p['class']['source']))).map((c, i) => {
                    return [c, defaultContextColors[c] || localContextColors[i]]
                })
            )

            const _typeClasses = predicates.reduce((accu, curr) => {
                const class_ = curr['class']['source']
                const var_ = curr['var']['source']
                const otherClasses = accu.get(var_) || []
                return accu.set(var_, [...otherClasses, class_])    
            }, new Map())
            classColors.set(_classColors)
            typeClasses.set(_typeClasses)
        }

        varColors.set(_varColors)
        conColors.set(_conColors)
    } 

}

</script>
<div class="w-max my-2">
    <HDiagram ast={ast} hasSibling={false}></HDiagram>
</div>