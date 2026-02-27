
import React from 'react';

let nodes: Set<React.RefObject<HTMLElement>>;

export default function focusNodes(message: 'init' | 'add' | 'focus', arg?: any) {
  switch (message) {
    case 'init':
      nodes = new Set();
      break;
    case 'add':
      if (nodes) {
        nodes.add(arg);
      }
      break;
    case 'focus': {
      const root = arg.current as HTMLElement;
      if (!root || !nodes) return;
      
      const size = nodes.size;
      try {
        if (size === 1) {
          const firstNode = nodes.values().next().value;
          if (firstNode && firstNode.current) {
            firstNode.current.scrollIntoView();
          }
        } else if (size > 1) {
          const rootRect = root.getBoundingClientRect();
          const center = (rootRect.y + rootRect.height) / 2 + rootRect.y;
          const closest = Array.from(nodes).reduce<[HTMLElement, number] | null>((closest, element) => {
            if (!element.current) {
              return closest;
            }
            const elementRect = element.current.getBoundingClientRect();
            const distance = elementRect.y - center;
            const minDistance = Math.min(
              Math.abs(distance),
              Math.abs(distance + elementRect.height),
            );

            if (!closest || closest[1] > minDistance) {
              return [element.current, minDistance];
            }
            return closest;
          }, null);
          if (closest) {
            closest[0].scrollIntoView();
          }
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('Unable to scroll node into view:', e.message);
      }
    }
  }
}
