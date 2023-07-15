import styled from "styled-components";
import { pick } from "lodash";
import shallow from "zustand/shallow";

import equationUpgradesConfig from "../config/equation-upgrades";
import { autoFormatNumber } from "../shared/utils";
import useStore from "../store";

interface GenericUpgrade {
  id: string;
  name: string;
  description: string;
  descriptionTerm?: string;
  cost: number;
}

export default function Upgrades() {
  const upgrades = useStore(s => pick(s.upgrades,
    ['equationUpgrades', 'termUpgrades', 'buyUpgrade']
  ), shallow);

  return <Section>
    <Title>Upgrades</Title>

    <UpgradeList>
      {Object.entries(equationUpgradesConfig).map(([eu, upgrade]) => 
        <Upgrade
          key={eu}
          upgrade={{
            id: eu,
            name: upgrade.name,
            description: "Gain new term: ",
            descriptionTerm: upgrade.newTerms[0].value,
            cost: upgrade.cost,
          }}
          onClick={upgrades.buyUpgrade}
        />
      )}
      {Object.entries(upgrades.termUpgrades).map(([tu, upgrade]) => 
        <Upgrade
          key={tu}
          upgrade={{
            id: tu,
            name: upgrade.name,
            description: "Improve constant from " + autoFormatNumber(upgrade.nextValue) + " to " + autoFormatNumber(upgrade.nextValue),
            cost: upgrade.cost,
          }}
          onClick={upgrades.buyUpgrade}
        />
      )}
    </UpgradeList>
  </Section>;
}

function Upgrade(props: {upgrade: GenericUpgrade, onClick: (id: string) => void}) {
  return <UpgradeButton>
    <UpgradeName>{props.upgrade.name}</UpgradeName>
    <UpgradeDesc>
      <span>{props.upgrade.description}</span>
      <Term>{props.upgrade.descriptionTerm}</Term>
    </UpgradeDesc>
    <strong>{autoFormatNumber(props.upgrade.cost)} points</strong>
  </UpgradeButton>;
}

const Section = styled.div`
  margin-top: 20px;
  width: 200px;
`;

const Title = styled.h2`
  color: white;
`;

const UpgradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UpgradeButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  height: 100px;
  padding: 8px;
  background-color: #365e9e;
  color: #DDD;
  border-radius: 5px;
  border: none;

  &:hover {
    outline: 2px solid #DDD;
  }
`;

const UpgradeName = styled.strong`
  color: #BBB;
`;

const UpgradeDesc = styled.strong`
  margin: 0;
  vertical-align: middle;
`;

const Term = styled.strong`
  font-size: 20px;
  vertical-align: middle;
`;