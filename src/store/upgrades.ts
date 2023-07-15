import { mapValues } from "lodash";
import equationUpgradesConfig from "../config/equation-upgrades";
import termUpgradesConfig from "../config/term-upgrades";
import { MyCreateSlice, TermUpgrade } from "../shared/types";
import { getExponentialValue } from "../shared/utils";

type RealizedTermUpgrade = TermUpgrade & {
  cost: number;
  nextValue: number;
  numBought: number;
}

export interface UpgradesSlice {
  equationUpgrades: Record<string, boolean>,
  termUpgrades: Record<string, RealizedTermUpgrade>,

  buyUpgrade: (id: string) => void,
}

const initialTermUpgrades: Record<string, RealizedTermUpgrade> = mapValues(termUpgradesConfig, (up) => ({
  ...up,
  cost: up.baseCost,
  nextValue: getExponentialValue(up.baseValue, up.valueGrowth, 1),
  numBought: 0,
}));

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, []> = (set, get) => {
  return {
    equationUpgrades: {},
    termUpgrades: initialTermUpgrades,

    buyUpgrade: (id) => {
      const termUpgrades = get().termUpgrades;
      if (termUpgrades[id]) {
        const tu = termUpgrades[id];
        tu.cost = getExponentialValue(tu.baseCost, tu.costGrowth, tu.numBought + 1);
        tu.numBought++;
        termUpgrades[id] = tu;
      } else if (equationUpgradesConfig[id]) {
        set({equationUpgrades: {...get().equationUpgrades, [id]: true}});
      }
    },
  };
};

export default createUpgradesSlice;