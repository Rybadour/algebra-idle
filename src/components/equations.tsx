import React from "react";
import styled from "styled-components";
import {Reorder} from "framer-motion";
import { pick } from "lodash";
import shallow from "zustand/shallow";

import { formatNumber } from "../shared/utils";
import useStore from "../store";

const TINY_SYMBOLS = ['+', '×']
const REPLACE_SYMBOLS: Record<string, string> = {
  '*': '×',
};

export function Equations() {
  const equations = useStore(s => pick(s.equations, [
    'points', 'pointsPerSec', 'equations', 'variables', 'terms', 'updateEquation'
  ]), shallow);

  return <Page>
    <Totals>
      <div>{formatNumber(equations.points, 0, 0)} Points</div>
      <PerSec>Per sec (PS) = {formatNumber(equations.pointsPerSec, 0, 1)}</PerSec>
    </Totals>

    {Object.keys(equations.equations).map(variable => {
      const equation = equations.equations[variable];
      return <Equation key={variable}>
        <Result>
          <Value>({formatNumber(equations.variables[variable], 0, 1)})</Value>
          <span>{variable} =</span>
        </Result>
        <Reorder.Group
          as="div"
          axis="x"
          values={equation}
          onReorder={(newEquation) => equations.updateEquation(variable, newEquation)}
          style={ReorderEquationStyles}
        >
          {equation.map((term) => {
            const termSymbol = equations.terms[term];
            const displayed = REPLACE_SYMBOLS[termSymbol] ?? termSymbol;
            return <Reorder.Item key={term} value={term} as="span">
              <ItemStyled isTinySymbol={TINY_SYMBOLS.includes(displayed)}>{displayed}</ItemStyled>
            </Reorder.Item>;
          })}
        </Reorder.Group>
      </Equation>
    })}
  </Page>;
}

const Page = styled.div`
  margin-top: 20px;
  width: 800px;
`;

const ReorderEquationStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 5,
  alignItems: 'center',
};

const Totals = styled.div`
  font-size: 30px;
  color: #EEE;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PerSec = styled.div`
  font-size: 22px;
  color: #BBB;
  margin-top: 10px;
`;

const Equation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const Result = styled.span`
  color: #BBB;
  font-size: 24px;
  width: 20%;
  text-align: right;
`;

const Value = styled.span`
  font-size: 16px;
  margin-right: 5px;
`;


const ItemStyled = styled.div<{isTinySymbol: boolean}>`
  padding: 4px;
  font-weight: bold;
  font-size: ${props => props.isTinySymbol ? '26px' : '20px'};
  vertical-align: middle;
  color: #EEE;
  cursor: grab;

  &:hover {
    outline: 1px solid grey;
    border-radius: 3px;
  }
`;