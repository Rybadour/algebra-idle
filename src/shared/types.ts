import { StoreApi } from "zustand";

export interface EquationUpgrade {
  id: string;
  name: string;
  cost: number;
  newTerms: {
    id: string;
    value: string;
  }[];
}

export interface TermUpgrade {
  id: string;
  name: string;
  baseCost: number;
  costGrowth: number;
  term: string;
  baseValue: number;
  valueGrowth: number;
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T