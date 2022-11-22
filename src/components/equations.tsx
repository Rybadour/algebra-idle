import React, { useState } from "react";
import styled from "styled-components";
import {Reorder} from "framer-motion";
import { ClientRequest } from "http";
import { formatNumber } from "../shared/utils";
import useStore from "../store";
import { pick } from "lodash";
import shallow from "zustand/shallow";

export function Equations() {
  const equations = useStore(s => pick(s.equations, [
    'points', 'pointsPerSec', 'equations', 'updateEquation'
  ]), shallow);

  return <Page>
    <Totals>
      <div>{formatNumber(equations.points, 0, 0)} Points</div>
      <PerSec>Per sec (PS) = {formatNumber(equations.pointsPerSec, 0, 1)}</PerSec>
    </Totals>

    {Object.keys(equations.equations).map(variable => {
      const equation = equations.equations[variable];
      return <Reorder.Group
        as="div"
        axis="x"
        values={equation}
        onReorder={(newEquation) => equations.updateEquation(variable, newEquation)}
        style={EquationStyles}
      >
        <Result>{variable} =</Result>
        {equation.map((item) => (
          <Reorder.Item key={item} value={item} as="span">
            <ItemStyled>{item}</ItemStyled>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    })}
  </Page>;
}

const Page = styled.div`
  margin-top: 20px;
  width: 800px;
`;

const EquationStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 5,
  alignItems: 'center',
};

const EquationDescription = styled.h2`
  color: #BBB;
  font-size: 18px;
  margin-top: 30px;
`;

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

const Result = styled.span`
  color: #BBB;
  font-size: 24px;
`;

const ItemStyled = styled.div`
  padding: 4px;
  font-weight: bold;
  font-size: 20px;
  color: #EEE;

  &:hover {
    outline: 1px solid grey;
    border-radius: 3px;
  }
`;