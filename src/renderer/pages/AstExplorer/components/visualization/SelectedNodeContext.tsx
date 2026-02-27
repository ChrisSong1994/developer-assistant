
import React, { createContext, useContext } from 'react';

type SetSelectedNode = (node: any, cb?: () => void) => void;

const SelectedNodeContext = createContext<SetSelectedNode | null>(null);

export function useSelectedNode() {
  const context = useContext(SelectedNodeContext);
  if (!context) {
    throw new Error('useSelectedNode must be used within a SelectedNodeContext');
  }
  return context;
}

let unselectCallback: (() => void) | null = null;

function setSelectedNode(node: any, cb?: () => void) {
  if (unselectCallback) {
    unselectCallback();
  }
  if (node) {
    (window as any).$node = node;
    unselectCallback = cb || null;
  } else {
    unselectCallback = null;
    delete (window as any).$node;
  }
}

export function SelectedNodeProvider(props: { children: React.ReactNode }) {
  return <SelectedNodeContext.Provider value={setSelectedNode} {...props} />;
}
