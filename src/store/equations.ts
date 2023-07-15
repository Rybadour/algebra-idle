import { create, all, OperatorNode } from "mathjs";

import { MyCreateSlice } from "../shared/types";

export interface EquationsSlice {
  points: number,
  pointsPerSec: number,
  equations: Record<string, string[]>,
  variables: Record<string, number>,
  terms: Record<string, string>,

  update: (elapsed: number) => void,
  updateEquation: (key: string, symbols: string[]) => void,
  addTermToEquation: (key: string, newSymbol: string) => void,
}

const math = create(all);

const initialTerms = {
  sqrt1: "sqrt(",
  rightParen1: ")",
  x1: "X",
  x2: "X",
  y1: "Y",
  y2: "Y",
  plus1: "+",
  plus2: "+",
  multi1: "*",
  div1: "/",
  frac1: "0.1",
  const1: "4",
};
const initialEquations: EquationsSlice["equations"] = {
  PS: ["x2", "multi1", "sqrt1", "x1", "rightParen1"],
  X: ["y2", "div1", "frac1"],
  Y: ["const1"],
};
const initialVariables = evaluateEquations(initialEquations, initialTerms);

const createEquationsSlice: MyCreateSlice<EquationsSlice, []> = (set, get) => {
  return {
    points: 0,
    pointsPerSec: initialVariables["PS"],
    equations: initialEquations,
    variables: initialVariables,
    terms: initialTerms,

    update: (elapsed) => {
      set({points: get().points + get().pointsPerSec * elapsed});
    },

    updateEquation: (key, equation) => {
      const newEquations = {...get().equations};
      newEquations[key] = equation;

      const variables = evaluateEquations(newEquations, get().terms);
      set({
        equations: newEquations,
        pointsPerSec: variables["PS"],
        variables: variables,
      })
    },

    addTermToEquation: (key, newSymbol) => {
      const newEquations = {...get().equations};
      newEquations[key] = newEquations[key].concat([newSymbol]);

      const variables = evaluateEquations(newEquations, get().terms);
      set({
        equations: newEquations,
        pointsPerSec: variables["PS"],
        variables,
      });
    }
  };
};

function evaluateEquation(equation: string[], scope: Record<string, number>) {
  try {
    const node = math.parse(equation.join(' '));
    node.traverse((node, path, parent) => {
      if ((node.type === 'OperatorNode')) {
        if (((node as OperatorNode).op === '*') && ((node as OperatorNode).implicit)) {
          throw new Error('Invalid syntax: Implicit multiplication found');
        }
      }
    });
    const code = node.compile();
    return code.evaluate(scope);
  } catch(err) {
    return 0;
  }
}

function evaluateEquations(equations: EquationsSlice["equations"], terms: Record<string, string>) {
  const variables: Record<string, number> = {};
  Object.keys(equations).reverse().forEach(variable => {
    const equation = equations[variable].map(term => terms[term]);
    variables[variable] = evaluateEquation(equation, variables);
  });
  return variables;
}

export default createEquationsSlice;