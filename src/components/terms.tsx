import { ConnectDragPreview, ConnectDragSource, useDrag } from "react-dnd";
import styled from "styled-components";

export function Terms() {
  return <TermsSection>
    <Title>Variables and Operators</Title>

    <Term label="ADD" term="plus2"></Term>
    <Term label="Y Variabl" term="y1"></Term>
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

const Term$ = styled.span`
  color: white;
  padding: 3px;
  cursor: grab;
  :hover {
    border: 1px solid #BBB;
    border-radius: 3px;
  }
`;