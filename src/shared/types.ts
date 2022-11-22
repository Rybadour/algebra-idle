import { StoreApi } from "zustand";

export interface EquationUpgrade {
  id: string;
  baseCost: number;
  costGrowth: number;
  newTerms: string[];
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T