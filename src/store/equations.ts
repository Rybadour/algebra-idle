import { create, all, OperatorNode } from "mathjs";

import { MyCreateSlice } from "../shared/types";

export interface EquationsSlice {
  points: number,
  pointsPerSec: number,
  equations: Record<string, string[]>

  update: (elapsed: number) => void,
  updateEquation: (key: string, symbols: string[]) => void,
}

const initialEquations: EquationsSlice["equations"] = {
  PS: ["sqrt(", "X", ")", "+", "Y"],
  X: ["Y", "/", "0.1"],
  Y: ["4"]
};

const createEquationsSlice: MyCreateSlice<EquationsSlice, []> = (set, get) => {
  function evaluateEquations(equations: EquationsSlice["equations"]): number {
    const variables: Record<string, number> = {};
    Object.keys(equations).reverse().forEach(variable => {
      const equation = equations[variable];
      variables[variable] = evaluateEquation(equation, variables);
    });

    return variables["PS"];
  }

  return {
    points: 0,
    pointsPerSec: evaluateEquations(initialEquations),
    equations: initialEquations,

    update: (elapsed) => {
      set({points: get().points + get().pointsPerSec * elapsed});
    },

    updateEquation: (key, symbols) => {
      const newEquations = {...get().equations};
      newEquations[key] = symbols;

      set({
        equations: newEquations,
        pointsPerSec: evaluateEquations(newEquations),
      })
    },
  };
};

const math = create(all);
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

export default createEquationsSlice;