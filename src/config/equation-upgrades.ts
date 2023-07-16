import { IEquationUpgrade } from "../shared/types";

const equationUpgrades: Record<string, IEquationUpgrade> = {
  first: {
    id: '',
    name: 'Gotta start somewhere',
    cost: 100,
    newTerms: [{
      id: 'add1',
      value: '+',
    }]
  },
};

Object.keys(equationUpgrades).forEach((id) => {
  equationUpgrades[id].id = id;
});

export default equationUpgrades;