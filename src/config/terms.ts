import { ITerm } from "../shared/types"

export const terms = {
  x: {
    functionalTerm: "X",
    label: "X Variable", 
  },
  y: {
    functionalTerm: "Y",
    label: "Y Variable", 
  },
  plus: {
    functionalTerm: "+",
    label: "Add Operator",
  },
  multi: {
    functionalTerm: "*",
    visualTerm: "x",
    label: "Multiply Operator",
  },
  div: {
    functionalTerm: "/",
    label: "Divide Operator",
  },
  sqrt: {
    functionalTerm: "sqrt(",
    label: "Square Root",
    closingTerm: "rightParen",
  },
  rightParen: {
    functionalTerm: ")",
    label: "Right Parenthesis",
  },
  const: {
    functionalTerm: "",
    label: "Constant"
  }
} satisfies Record<string, ITerm>;

export type TermType = keyof typeof terms;