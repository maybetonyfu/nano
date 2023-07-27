import {writable} from "svelte/store";
import {haskellType, semantics, gatherNames, countArity} from "./grammar";

const localVarColors = [
    'rgb(239,177,177)',
    'rgb(246,189,131)',
    'rgb(246,246,131)',
    'rgb(189,246,131)',
    'rgb(131,246,131)',
    'rgb(131,246,189)',
    'rgb(131,246,246)',
    'rgb(131,189,246)',
    'rgb(131,131,246)',
    'rgb(189,131,246)',
    'rgb(246,131,246)',
    'rgb(246,131,189)'
]

const localConColors = [
    'rgb(143,61,61)',
    'rgb(143,102,61)',
    'rgb(143,143,61)',
    'rgb(102,143,61)',
    'rgb(61,143,61)',
    'rgb(61,143,102)',
    'rgb(61,143,143)',
    'rgb(61,102,143)',
    'rgb(61,61,143)',
    'rgb(102,61,143)',
    'rgb(143,61,143)',
    'rgb(143,61,102)',
]

const localContextColors = [
    'rgb(239,177,177)',
    'rgb(246,246,131)',
    'rgb(189,246,131)',
    'rgb(131,246,189)',
    'rgb(131,189,246)',
    'rgb(189,131,246)',
    'rgb(246,131,189)'
].reverse()

const defaultConColors = {
    "List": "#DFA378",
    "Function": "#959595",
    "Maybe": "#9790E8",
    "IO": "#75DDE3",
    "Tuple": '#70D8F9',
    "Unit": '#F8F8F8'
}

const defaultContextColors = {

}

export const signature = writable('a b')
export const isValid = writable(false)
export const ast = writable({})
export const vars = writable(new Set())
export const cons = writable(new Set())
export const varColors = writable({})
export const conColors = writable({})
export const contextColors = writable({})
export const context = writable(new Map())

signature.subscribe(sig => {
    const matchResult = haskellType.match(sig)
    const valid = matchResult.succeeded()
    if (valid) {
        const adapter = semantics(matchResult)
        const ast_ = adapter.parse()
        const names = gatherNames(ast_)
        const varColors_ = Object.fromEntries(
            Array.from(names.vars).map((v, i) => {
                return [v, localVarColors[i]]
            })
        )
        const conColors_ = Object.fromEntries(
            Array.from(names.cons).map((c, i) => {
                return [c, defaultConColors[c] || localConColors[i]]
            })
        )


        if (ast_['context']) {
            const predicates = ast_['context'] ? ast_['context']['predicates'] : []
            const contextColors_ = Object.fromEntries(
                Array.from(new Set(predicates.map(p => p['class']['source']))).map((c, i) => {
                    return [c, defaultContextColors[c] || localContextColors[i]]
                })
            )
            contextColors.set(contextColors_)

            const context_ = predicates.reduce((accu, curr) => {
                const class_ = curr['class']['source']
                const var_ = curr['var']['source']
                const otherClasses = accu.get(var_) || []
                return accu.set(var_, [...otherClasses, class_])
            }, new Map())
            context.set(context_)
        }

        isValid.set(true)
        ast.set(ast_)
        vars.set(names.vars)
        cons.set(names.cons)
        varColors.set(varColors_)
        conColors.set(conColors_)


    } else {
        isValid.set(false)
    }

})

