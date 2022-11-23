import { TermUpgrade } from "../shared/types";

const termUpgrades: Record<string, TermUpgrade> = {
  const1: {
    id: '',
    name: 'Bigger Number Please!',
    baseCost: 20,
    costGrowth: 1.1,
    term: 'const1',
    baseValue: 1,
    valueGrowth: 1.3,
  },
};

Object.keys(termUpgrades).forEach((id) => {
  termUpgrades[id].id = id;
});

export default termUpgrades;