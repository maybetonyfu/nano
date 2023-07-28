import {grammar} from "ohm-js"

export const nodeType = {
    VAR: 'var',
    CON: 'con',
    APP: 'app',
    FUN: 'fun',
    TUPLE: 'tuple',
    PAREN: 'paren',
    LIST: 'list',
    CLASS: 'class',
    UNIT: 'unit'
}
export const haskellType = grammar(String.raw`
Signature {
    fullType = context spaces "=>" spaces type -- withContext
                | type
    type = tfun | tapp  | simpleType
    simpleType =
        | tforall
        | tcon
        | tvar
        | unit
        | "(" (tforall | tfun | tapp) ")" -- paren
        | "[" type "]" -- list
        | "(" spaces type spaces ("," spaces type)+ ")" -- tuple

    unit = "()"
    tforall = "forall" spaces (tvar spaces)* "." spaces type
    tfun = type spaces "->" spaces type
    tapp = (~ "forall") (tcon|tvar) (spaces simpleType)+
    tcon = upper ((alnum | "'") *)
    tvar = lower ((alnum | "'") *)
    tclass = tcon spaces tvar -- single
      | "(" tcon (spaces (tvar|tcon))+ ")" -- multiple
    context = tclass
      |  "(" tclass spaces ("," spaces tclass)* ")" -- multiple
}
`)

export const semantics = haskellType.createSemantics()
semantics.addOperation('parse', {
    tclass_single(a, _b, c) {
        return {
            type: nodeType.CLASS,
            predicates: [{"class": a.parse(), "var": c.parse()}],
        }
    },
    context(a) {
        return a.parse()
    },
    fullType(a) {
        return a.parse()
    },
    fullType_withContext(a, b, c, d, e) {
        //context spaces "=>" spaces type
        // a       b      c    d      e
        return {
            ...e.parse(),
            context: a.parse()
        }
    },
    context_multiple(a, b, c, d, e, f, g) {
        // "(" tclass spaces ("," spaces tclass)* ")"
        // a    b      c      d    e      f       g
        const classes = [b.parse(), ...f.parse()]
        return {
            type: nodeType.CLASS,
            predicates: classes.flatMap(c => c.predicates)
        }
    },
    tforall(a, b, c, d, e, f, g) {
        return g.parse()
    },
    simpleType_paren(_a, b, _c) {
        return {
            type: nodeType.PAREN,
            child: b.parse(),
            start: _a.source.startIdx,
            end: _c.source.endIdx
        }
    },
    simpleType_list(a, b, c) {
        return {
            type: nodeType.LIST,
            child: b.parse(),
            start: a.source.startIdx,
            end: c.source.endIdx
        }
    },
    simpleType_tuple(a, b, c, d, e, f, g, h) {
        //"(" spaces type spaces ("," spaces type)+ ")"
        // a   b      c    d       e   f      g       h
        return {
            type: nodeType.TUPLE,
            children: [c.parse(), ...g.parse()],
            start: a.source.startIdx,
            end: h.source.endIdx
        }

    },
    unit(a) {
        return {
            type: nodeType.UNIT,
            start: a.source.startIdx,
            end: a.source.endIdx
        }
    },
    tfun(a, _x, _y, _z, b) {
        return {
            type: nodeType.FUN,
            arg: a.parse(),
            result: b.parse(),
            start: a.source.startIdx,
            end: b.source.endIdx
        }
    },
    tvar(a, b) {
        return {
            type: nodeType.VAR,
            source: a.sourceString + b.sourceString,
            start: a.source.startIdx,
            end: b.source.endIdx
        }
    },
    tcon(a, b) {
        return {
            type: nodeType.CON,
            source: a.sourceString + b.sourceString,
            start: a.source.startIdx,
            end: b.source.endIdx
        }
    },
    _iter(...children) {
        return children.map(c => c.parse())
    },
    tapp(a, b, c) {
        return {
            type: nodeType.APP,
            children: [a.parse(), ...c.parse()],
            start: a.source.startIdx,
            end: c.source.endIdx
        }
    }
})


export const gatherNames = (ast, vars = new Set(), cons = new Set()) => {
    switch (ast.type) {
        case nodeType.VAR:
            return {vars: new Set([...vars, ast.source]), cons}
        case nodeType.CON:
            return {vars, cons: new Set([...cons, ast.source])}
        case nodeType.UNIT:
            return {vars, cons: new Set([...cons, 'Unit'])}
        case nodeType.PAREN:
            return gatherNames(ast.child)
        case nodeType.APP: {
            let names = ast.children.map(child => gatherNames(child, vars, cons))
            let allVars = names.map(n => n.vars).reduce((acc, cur) => new Set([...acc, ...cur]), new Set())
            let allCons = names.map(n => n.cons).reduce((acc, cur) => new Set([...acc, ...cur]), new Set())
            return {vars: allVars, cons: allCons}
        }

        case nodeType.LIST: {
            let ames = gatherNames(ast.child, vars, cons)
            return {vars: ames.vars, cons: new Set([...ames.cons, "List"])}
        }

        case nodeType.FUN: {
            let argNames = gatherNames(ast.arg, vars, cons)
            let resultNames = gatherNames(ast.result, vars, cons)
            return {
                vars: new Set([...argNames.vars, ...resultNames.vars]),
                cons: new Set([...argNames.cons, ...resultNames.cons, "Function"])
            }
        }
        case nodeType.TUPLE:
            let names = ast.children.map(child => gatherNames(child, vars, cons))
            let allVars = names.map(n => n.vars).reduce((acc, cur) => new Set([...acc, ...cur]), new Set())
            let allCons = names.map(n => n.cons).reduce((acc, cur) => new Set([...acc, ...cur]), new Set())
            return {vars: allVars, cons: new Set([...allCons, "Tuple"])}

    }
    return {vars, cons}
}

export const countArity = ast => {
    if (ast['type'] === nodeType.FUN) {
        return 1 + countArity(ast['result'])
    } else {
        return 0
    }
}