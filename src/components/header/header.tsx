import Modal from 'react-modal';
import { useCallback, useState } from 'react';
import { pick } from 'lodash';
import shallow from 'zustand/shallow';

import Icon from '../../shared/components/icon';
import { STANDARD_MODAL_STYLE } from '../../shared/constants';
import useStore from '../../store';

import './header.scss';
import classNames from 'classnames';

Modal.setAppElement('#root');

function Header() {
  return <>
    <header>
      <h1>Algebra Idle</h1>

      <div className="options">
        <button className="no-style" data-tip="Help">
          <Icon size="sm" icon="help" />
        </button>
        <button className="no-style" data-tip="Options">
          <Icon size="sm" icon="settings-knobs" />
        </button>
      </div>
    </header>
  </>;
}

export default Header;