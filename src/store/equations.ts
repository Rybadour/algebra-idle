import { create, all, OperatorNode } from "mathjs";

import { IRealizedTerm, MyCreateSlice } from "../shared/types";
import { TermType, terms } from "../config/terms";

export interface EquationsSlice {
  points: number,
  pointsPerSec: number,
  equations: Record<string, string[]>,
  variables: Record<string, number>,
  terms: Record<string, IRealizedTerm>,
  unusedTerms: string[],

  update: (elapsed: number) => void,
  updateEquation: (key: string, symbols: string[]) => void,
  addTermToEquation: (key: string, newSymbol: string) => void,
}

const math = create(all);

const termCounts: Record<TermType, number> = {
  x: 0,
  y: 0,
  plus: 0,
  multi: 0,
  div: 0,
  sqrt: 0,
  rightParen: 0,
  const: 0,
};
const initialTerms = [
  createConstant(1),
  createTerm('plus'),
  createTerm('y'),
];
const initialTermMap: Record<string, IRealizedTerm> = {};
initialTerms.forEach((term) => {
  initialTermMap[term.id] = term;
})
const initialEquations: EquationsSlice["equations"] = {
  PS: [initialTerms[0].id],
  X: [],
  Y: [],
};
const initialVariables = evaluateEquations(initialEquations, initialTermMap);

const createEquationsSlice: MyCreateSlice<EquationsSlice, []> = (set, get) => {
  return {
    points: 0,
    pointsPerSec: initialVariables["PS"],
    equations: initialEquations,
    variables: initialVariables,
    terms: initialTermMap,
    unusedTerms: [initialTerms[1].id, initialTerms[2].id],

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

function evaluateEquations(equations: EquationsSlice["equations"], terms: Record<string, IRealizedTerm>) {
  const variables: Record<string, number> = {};
  Object.keys(equations).reverse().forEach(variable => {
    const equation = equations[variable].map(term => terms[term].functionalTerm);
    variables[variable] = evaluateEquation(equation, variables);
  });
  return variables;
}

function createTerm(type: TermType): IRealizedTerm {
  termCounts[type] += 1;
  return {
    type,
    id: type + "-" + termCounts[type],
    ...terms[type],
  }
}

function createConstant(initialValue: number) {
  const term = createTerm("const");
  term.functionalTerm = initialValue + "";
  return term;
}

export default createEquationsSlice;