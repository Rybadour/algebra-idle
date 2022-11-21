import React, { useState } from "react";
import styled from "styled-components";
import {Reorder} from "framer-motion";

export function Equations() {
  const [rootItems, setRootItems] = useState(["PS", "=", "X", "+", "Y"]);
  const [xItems, setXItems] = useState(["X", "=", "Y", "/", "0.2"]);

  return <Page>
    <Totals>
      <div>1,245 Points</div>
      <PerSec>Per sec (PS) = 5.5</PerSec>
    </Totals>

    <EquationDescription>Root Equation</EquationDescription>
    <Reorder.Group as="div" axis="x" values={rootItems} onReorder={setRootItems} style={EquationStyles}>
      {rootItems.map((item) => (
        <Reorder.Item key={item} value={item} as="span">
          <ItemStyled>{item}</ItemStyled>
        </Reorder.Item>
      ))}
    </Reorder.Group>

    <EquationDescription>Equation for X</EquationDescription>
    <Reorder.Group as="div" axis="x" values={xItems} onReorder={setXItems} style={EquationStyles}>
      {xItems.map((item) => (
        <Reorder.Item key={item} value={item} as="span">
          <ItemStyled>{item}</ItemStyled>
        </Reorder.Item>
      ))}
    </Reorder.Group>
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