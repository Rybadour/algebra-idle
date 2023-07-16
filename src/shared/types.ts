import { StoreApi } from "zustand";
import { TermType } from "../config/terms";

export interface IEquationUpgrade {
  id: string;
  name: string;
  cost: number;
  newTerms: {
    id: string;
    value: string;
  }[];
}

export interface ITermUpgrade {
  id: string;
  name: string;
  baseCost: number;
  costGrowth: number;
  term: string;
  baseValue: number;
  valueGrowth: number;
}

export interface ITerm {
  label: string;
  functionalTerm: string;
  visualTerm?: string;
  closingTerm?: string;
}

export interface IRealizedTerm extends ITerm {
  type: TermType;
  id: string;
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T