
import React, { useReducer, useMemo, useRef, useLayoutEffect } from 'react';
import Element from './tree/Element';
import { publish } from './utils/pubsub';
import { treeAdapterFromParseResult } from './core/TreeAdapter';
import { SelectedNodeProvider } from './SelectedNodeContext';
import focusNodes from './focusNodes';
import './css/tree.css';

const STORAGE_KEY = 'tree_settings';

interface TreeSettings {
  autofocus: boolean;
  hideFunctions: boolean;
  hideEmptyKeys: boolean;
  hideLocationData: boolean;
  hideTypeKeys: boolean;
  [key: string]: boolean;
}

function initSettings(): TreeSettings {
  const storedSettings = window.localStorage.getItem(STORAGE_KEY);
  return storedSettings ?
    JSON.parse(storedSettings) :
    {
      autofocus: true,
      hideFunctions: true,
      hideEmptyKeys: false,
      hideLocationData: false,
      hideTypeKeys: false,
    };
}

function reducer(state: TreeSettings, action: { name: string; checked: boolean }): TreeSettings {
  const newState = { ...state, [action.name]: action.checked };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

function makeCheckbox(name: string, settings: TreeSettings, updateSettings: React.Dispatch<{ name: string; checked: boolean }>) {
  return (
    <input
      type="checkbox"
      name={name}
      checked={!!settings[name]}
      onChange={event => updateSettings({ name: event.target.name, checked: event.target.checked })}
    />
  );
}

interface TreeProps {
  parseResult: {
    ast: any;
    treeAdapter: {
      type: string;
      options?: any;
    };
  };
  position?: number;
}

export default function Tree({ parseResult, position }: TreeProps) {
  const [settings, updateSettings] = useReducer(reducer, null, initSettings);
  
  const treeAdapter = useMemo(
    () => treeAdapterFromParseResult(parseResult, settings),
    [parseResult.treeAdapter, settings],
  );
  
  const rootElement = useRef<HTMLUListElement>(null);

  focusNodes('init');
  useLayoutEffect(() => {
    focusNodes('focus', rootElement);
  });

  return (
    <div className="tree-visualization container">
      <div className="toolbar">
        <label title="Auto open the node at the cursor in the source code">
          {makeCheckbox('autofocus', settings, updateSettings)}
          Autofocus
        </label>
        &#8203;
        {treeAdapter.getConfigurableFilters().map((filter: any) => (
          <span key={filter.key}>
            <label>
              {makeCheckbox(filter.key, settings, updateSettings)}
              {filter.label}
            </label>
            &#8203;
          </span>
        ))}
      </div>
      <ul 
        ref={rootElement} 
        onMouseLeave={() => { publish('CLEAR_HIGHLIGHT'); }}
        className="tree-root"
      >
        <SelectedNodeProvider>
          <Element
            value={parseResult.ast}
            level={0}
            treeAdapter={treeAdapter}
            autofocus={settings.autofocus}
            position={position}
          />
        </SelectedNodeProvider>
      </ul>
    </div>
  );
}
