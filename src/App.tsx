import React, { useEffect } from 'react';
import ReactDOM from "react-dom";

import Header from './components/header/header';
import ReactTooltip from 'react-tooltip';

import './App.scss';
import { Equations } from './components/equations';
import useStore from './store';
import Upgrades from './components/upgrades';

function App() {
  return (
    <div className="App">
      <Header />

      <Content />

      <ReactTooltip place="bottom" effect="solid" className="standard-tooltip" />
    </div>
  );
}

let lastTime: number = performance.now();
function Content() {
  const updateEquations = useStore(s => s.equations.update);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (performance.now() - lastTime) / 1000;
      updateEquations(elapsed);
      lastTime = performance.now();
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return <div className="content">
    <Upgrades></Upgrades>
    <Equations></Equations>
  </div>;
}

export default App;
