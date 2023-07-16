import { useDrag } from "react-dnd";
import styled from "styled-components";
import shallow from "zustand/shallow";
import useStore from "../store";
import { pick } from "lodash";

export function Terms() {
  const equations = useStore(s => pick(s.equations, [
    'unusedTerms', 'terms'
  ]), shallow);

  return <TermsSection>
    <Title>Variables and Operators</Title>

    <TermList>
      {equations.unusedTerms.map((t) => {
        const term = equations.terms[t];
        return <Term key={t} label={term.label} term={t}></Term>;
      })}
    </TermList>
  </TermsSection>
}

interface ITermProps {
  label: string;
  term: string;
}

function Term(props: ITermProps) {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: 'term',
    item: { id: props.term },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }))
  return <Term$ ref={drag} {...collected}>
    {props.label}
  </Term$>;
}

const TermsSection = styled.div`
  margin-top: 20px;
  width: 300px;
`;

const Title = styled.h2`
  color: white;
`;

const TermList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Term$ = styled.div`
  color: #CCC;
  padding: 3px;
  cursor: grab;
  :hover {
    border: 1px solid #BBB;
    border-radius: 3px;
  }
`;