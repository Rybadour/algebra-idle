import styled from "styled-components";
import { pick } from "lodash";
import shallow from "zustand/shallow";

import equationUpgradesConfig from "../config/equation-upgrades";
import { formatNumber } from "../shared/utils";
import useStore from "../store";

interface GenericUpgrade {
  id: string;
  name: string;
  cost: number;
}

export default function Upgrades() {
  const upgrades = useStore(s => pick(s.upgrades,
    ['equationUpgrades', 'termUpgrades', 'buyUpgrade']
  ), shallow);

  return <Section>
    <h2>Upgrades</h2>

    <UpgradeList>
      {Object.entries(equationUpgradesConfig).map(([eu, upgrade]) => 
        <Upgrade
          upgrade={{
            id: eu,
            name: upgrade.name,
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
    <strong>{props.upgrade.name}</strong>
    <strong>{props.upgrade.cost}</strong>
  </UpgradeButton>;
}

const Section = styled.div`
  margin-top: 20px;
  width: 300px;
`;

const UpgradeList = styled.div`
  display: flex;
  gap: 20px;
`;

const UpgradeButton = styled.button`
  height: 80px;
  padding: 6px;
`;