import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import createEquationsSlice, { EquationsSlice } from "./equations";
import createUpgradesSlice, { UpgradesSlice } from "./upgrades";

export type FullStore = {
  equations: EquationsSlice,
  upgrades: UpgradesSlice,
}

const useStore = create<FullStore>((set, get) => {
  const equations = createLens(set, get, 'equations');
  const upgrades = createLens(set, get, 'upgrades');

  return {
    equations: createEquationsSlice(...equations),
    upgrades: createUpgradesSlice(...upgrades),
  }
});

export default useStore;