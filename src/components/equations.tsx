import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import {Reorder} from "framer-motion";
import { pick } from "lodash";
import shallow from "zustand/shallow";

import { formatNumber } from "../shared/utils";
import useStore from "../store";
import { useDrag, useDrop } from "react-dnd";
import { IRealizedTerm } from "../shared/types";

interface TermItem {
  id: string;
  index: number;
}

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
      return <Equation 
        key={variable}
        equation={equation}
        variable={variable}
        variableValue={equations.variables[variable]}
      />;
    })}
  </Page>;
}

interface EquationProps {
  equation: string[],
  variable: string,
  variableValue: number,
}

function Equation(props: EquationProps) {
  const equations = useStore(s => pick(s.equations, [
    'terms', 'updateEquation', 'addTermToEquation'
  ]), shallow);

  const moveTerm = useCallback((dragIndex, hoverIndex) => {
    const newTerms = [...props.equation];
    [newTerms[hoverIndex], newTerms[dragIndex]] = [newTerms[dragIndex], newTerms[hoverIndex]];
    equations.updateEquation(props.variable, newTerms);
  }, [props.equation, props.variable, equations]);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'term',
    drop: (term: TermItem) => {
      equations.addTermToEquation(props.variable, term.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return <Equation$ ref={drop}>
    <Result>
      <Value>({formatNumber(props.variableValue, 0, 1)})</Value>
      <span>{props.variable} =</span>
    </Result>
    <TermList>
    {props.equation.map((t, i) => {
      const term = equations.terms[t];
      const displayed = term.visualTerm ?? term.functionalTerm;
      return <Term key={t} index={i} term={term} displayedTerm={displayed} moveTerm={moveTerm} />;
    })}
    </TermList>
  </Equation$>;
}

interface ITermProps {
  index: number;
  term: IRealizedTerm;
  displayedTerm: string;
  moveTerm: (dragIndex: number, hoverIndex: number) => void,
}

function Term(props: ITermProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<TermItem, TermItem, {handlerId: string | Symbol | null}>({
    accept: 'selfterm',
    collect: (monitor) => {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover: (item, monitor) => {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = props.index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return;

      // Get pixels to the top
      const hoverClientY = clientOffset.x - hoverBoundingRect.left
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      props.moveTerm(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'selfterm',
    item: () => {
      return { id: props.term.id, index: props.index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return <ItemStyled ref={ref} isTinySymbol={TINY_SYMBOLS.includes(props.displayedTerm)}>{props.displayedTerm}</ItemStyled>
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

const Equation$ = styled.div`
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

const TermList = styled.div`
  display: flex;
`;