import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import createEquationsSlice, { EquationsSlice } from "./equations";

export type FullStore = {
  equations: EquationsSlice,
}

const useStore = create<FullStore>((set, get) => {
  const equations = createLens(set, get, 'equations');

  return {
    equations: createEquationsSlice(...equations),
  }
});

export default useStore;