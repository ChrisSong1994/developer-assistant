
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import cx from 'classnames';
import CompactArrayView from './CompactArrayView';
import CompactObjectView from './CompactObjectView';
import { publish } from '../utils/pubsub';
import { useSelectedNode } from '../SelectedNodeContext';
import focusNodes from '../focusNodes';
import stringify from '../utils/stringify';
import { TreeAdapter } from '../core/TreeAdapter';

function usePrevious<T>(value: T, initialValue: T): T {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

enum OPEN_STATES {
  DEFAULT = 0,
  OPEN = 1,
  DEEP_OPEN = 2,
  FOCUS_OPEN = 3,
  CLOSED = 4,
}

enum EVENTS {
  CLICK_SELF = 0,
  CLICK_DESCENDANT = 1,
  GAIN_FOCUS = 2,
  LOOSE_FOCUS = 3,
  DEEP_OPEN = 4,
}

function transition(currentState: OPEN_STATES, event: EVENTS): OPEN_STATES {
  switch (currentState) {
    case OPEN_STATES.DEFAULT:
    case OPEN_STATES.CLOSED:
      switch (event) {
        case EVENTS.DEEP_OPEN:
          return OPEN_STATES.DEEP_OPEN;
        case EVENTS.GAIN_FOCUS:
          return OPEN_STATES.FOCUS_OPEN;
        case EVENTS.LOOSE_FOCUS:
          return OPEN_STATES.DEFAULT;
      }
      break;

    case OPEN_STATES.OPEN:
      switch (event) {
        case EVENTS.DEEP_OPEN:
          return OPEN_STATES.DEEP_OPEN;
        case EVENTS.GAIN_FOCUS:
        case EVENTS.LOOSE_FOCUS:
          return currentState;
      }
      break;

    case OPEN_STATES.DEEP_OPEN:
      return OPEN_STATES.DEEP_OPEN;

    case OPEN_STATES.FOCUS_OPEN:
      switch (event) {
        case EVENTS.GAIN_FOCUS:
          return OPEN_STATES.FOCUS_OPEN;
        case EVENTS.LOOSE_FOCUS:
          return OPEN_STATES.DEFAULT;
        case EVENTS.DEEP_OPEN:
          return OPEN_STATES.DEEP_OPEN;
      }
      break;
  }
  return currentState;
}

function useOpenState(openFromParent: boolean, isInRange: boolean): [OPEN_STATES, React.Dispatch<React.SetStateAction<OPEN_STATES>>] {
  const previousOpenFromParent = usePrevious(openFromParent, false);
  const wasInRange = usePrevious(isInRange, false);
  const [ownOpenState, setOwnOpenState] = useState(OPEN_STATES.DEFAULT);
  const previousOwnOpenState = usePrevious(ownOpenState, OPEN_STATES.DEFAULT);
  const previousComputedOpenState = useRef(OPEN_STATES.DEFAULT);
  let computedOpenState = previousComputedOpenState.current;

  if (ownOpenState !== previousOwnOpenState) {
    computedOpenState = ownOpenState;
  } else if (wasInRange !== isInRange) {
    computedOpenState = transition(
      previousComputedOpenState.current,
      isInRange && !wasInRange ? EVENTS.GAIN_FOCUS : EVENTS.LOOSE_FOCUS,
    );
    if (!isInRange && wasInRange && ownOpenState === OPEN_STATES.CLOSED) {
      setOwnOpenState(OPEN_STATES.DEFAULT);
    }
  } else if (openFromParent && !previousOpenFromParent) {
    computedOpenState = transition(
      previousComputedOpenState.current,
      EVENTS.DEEP_OPEN,
    );
  }

  useEffect(() => {
    previousComputedOpenState.current = computedOpenState;
  });

  return [computedOpenState, setOwnOpenState];
}

interface ElementProps {
  name?: string;
  value: any;
  computed?: boolean;
  open?: boolean;
  level: number;
  treeAdapter: TreeAdapter;
  autofocus?: boolean;
  isInRange?: boolean;
  hasChildrenInRange?: boolean;
  selected?: boolean;
  onClick?: (state: number, own?: boolean) => void;
  position?: number;
  parent?: any;
}

const Element: React.FC<ElementProps> = React.memo(({
  name,
  value,
  computed,
  open = false,
  level,
  treeAdapter,
  autofocus,
  isInRange = false,
  hasChildrenInRange = false,
  selected,
  onClick,
  position,
}) => {
  const opensByDefault = useMemo(
    () => (name ? treeAdapter.opensByDefault(value, name) : false),
    [treeAdapter, value, name],
  ) || level === 0;
  
  const [openState, setOpenState] = useOpenState(
    open,
    !!autofocus && (isInRange || hasChildrenInRange),
  );
  
  const elementRef = useRef<HTMLLIElement>(null);
  
  if (autofocus && isInRange && !hasChildrenInRange) {
    focusNodes('add', elementRef);
  }

  const isOpen = openState === OPEN_STATES.DEFAULT ?
    opensByDefault :
    openState !== OPEN_STATES.CLOSED;

  const onToggleClick = useCallback(
    (event: React.MouseEvent) => {
      const shiftKey = event.shiftKey;
      const newOpenState = shiftKey ? OPEN_STATES.DEEP_OPEN : (isOpen ? OPEN_STATES.CLOSED : OPEN_STATES.OPEN);
      if (onClick) {
        onClick(newOpenState, true);
      }
      setOpenState(newOpenState);
    },
    [onClick, isOpen, setOpenState],
  );

  const range = treeAdapter.getRange(value);
  let onMouseOver: React.MouseEventHandler | undefined;
  let onMouseLeave: React.MouseEventHandler | undefined;

  // enable highlight on hover if node has a range
  if (range && level !== 0) {
    onMouseOver = (event) => {
      event.stopPropagation();
      publish('HIGHLIGHT', { node: value, range });
    };

    onMouseLeave = (event) => {
      event.stopPropagation();
      publish('CLEAR_HIGHLIGHT', { node: value, range });
    };
  }

  const clickHandler = useCallback(
    () => {
      setOpenState(OPEN_STATES.OPEN);
      if (onClick) {
        onClick(OPEN_STATES.OPEN);
      }
    },
    [onClick, setOpenState],
  );

  function renderChild(key: string, childValue: any, parentNode: any, childName: string | undefined, childComputed?: boolean) {
    if (treeAdapter.isArray(childValue) || treeAdapter.isObject(childValue) || typeof childValue === 'function') {
      const ElementType = typeof childValue === 'function' ? FunctionElement : ElementContainer;
      return (
        <ElementType
          key={key}
          name={childName}
          open={openState === OPEN_STATES.DEEP_OPEN}
          value={childValue}
          computed={childComputed}
          level={level + 1}
          treeAdapter={treeAdapter}
          autofocus={autofocus}
          parent={parentNode}
          onClick={clickHandler}
          position={position}
        />
      );
    }
    return (
      <PrimitiveElement
        key={key}
        name={childName}
        value={childValue}
        computed={childComputed}
      />
    );
  }

  let valueOutput: React.ReactNode = null;
  let content: React.ReactNode = null;
  let prefix: string | null = null;
  let suffix: string | null = null;
  let showToggler = false;

  if (value && typeof value === 'object') {
    // Render a useful name for object like nodes
    if (!treeAdapter.isArray(value)) {
      const nodeName = treeAdapter.getNodeName(value);
      if (nodeName) {
        valueOutput = (
          <span className="tokenName nc" onClick={onToggleClick}>
            {nodeName}{' '}
            {selected ?
              <span className="ge" style={{ fontSize: '0.8em' }}>
                {' = $node'}
              </span> :
              null
            }
          </span>
        );
      }
    }

    if (typeof value.length === 'number') {
      if (value.length > 0 && isOpen) {
        prefix = '[';
        suffix = ']';
        const node = value;
        let elements = Array.from(treeAdapter.walkNode(value))
          .filter(({ key }) => key !== 'length')
          .map(({ key, value: childValue, computed: childComputed }) => renderChild(
            key,
            childValue,
            node,
            Number.isInteger(+key) ? undefined : key,
            childComputed,
          ));
        content = <ul className="value-body">{elements}</ul>;
      } else {
        valueOutput = (
          <span>
            {valueOutput}
            <CompactArrayView
              array={value}
              onClick={onToggleClick}
            />
          </span>
        );
      }
      showToggler = value.length > 0;
    } else {
      if (isOpen) {
        prefix = '{';
        suffix = '}';
        const node = value;
        let elements = Array.from(treeAdapter.walkNode(value))
          .map(({ key, value: childValue, computed: childComputed }) => renderChild(
            key,
            childValue,
            node,
            key,
            childComputed,
          ));
        content = <ul className="value-body">{elements}</ul>;
        showToggler = elements.length > 0;
      } else {
        let keys = Array.from(treeAdapter.walkNode(value), ({ key }) => key);
        valueOutput = (
          <span>
            {valueOutput}
            <CompactObjectView
              onClick={onToggleClick}
              keys={keys}
            />
          </span>
        );
        showToggler = keys.length > 0;
      }
    }
  }

  let classNames = cx({
    entry: true,
    highlighted: (isInRange && (!hasChildrenInRange || !isOpen)) || (!isInRange && hasChildrenInRange && !isOpen),
    toggable: showToggler,
    open: isOpen,
  });

  return (
    <li
      ref={elementRef}
      className={classNames}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}>
      {name ? <PropertyName name={name} computed={computed} onClick={onToggleClick} /> : null}
      <span className="value">
        {valueOutput}
      </span>
      {prefix ? <span className="prefix p">&nbsp;{prefix}</span> : null}
      {content}
      {suffix ? <div className="suffix p">{suffix}</div> : null}
    </li>
  );
},
(prevProps, nextProps) => {
  return prevProps.name === nextProps.name &&
    prevProps.value === nextProps.value &&
    prevProps.computed === nextProps.computed &&
    prevProps.open === nextProps.open &&
    prevProps.level === nextProps.level &&
    prevProps.treeAdapter === nextProps.treeAdapter &&
    prevProps.autofocus === nextProps.autofocus &&
    prevProps.selected === nextProps.selected &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.isInRange === nextProps.isInRange &&
    prevProps.hasChildrenInRange === nextProps.hasChildrenInRange &&
    //
    ((nextProps.isInRange || nextProps.hasChildrenInRange) ? prevProps.position === nextProps.position : true);
});

const NOT_COMPUTED = {};

const FunctionElement: React.FC<ElementProps> = React.memo((props) => {
  const [computedValue, setComputedValue] = useState<any>(NOT_COMPUTED);
  const [error, setError] = useState<Error | null>(null);
  const { name, value, parent, computed, treeAdapter } = props;

  if (computedValue !== NOT_COMPUTED) {
    if (treeAdapter.isArray(computedValue) || treeAdapter.isObject(computedValue)) {
      return (
        <ElementContainer
          {...props}
          value={computedValue}
          level={props.level + 1}
        />
      );
    }
    return (
      <PrimitiveElement
        name={name}
        value={computedValue}
        computed={computed}
      />
    );
  }

  return (
    <li className="entry">
      {name ? <PropertyName name={name} computed={computed} /> : null}
      <span className="value">
        <span
          className="ge invokeable"
          title="Click to invoke function"
          onClick={() => {
            try {
              const compVal = value.call(parent);
              // eslint-disable-next-line no-console
              console.log(compVal);
              setComputedValue(compVal);
            } catch (err: any) {
              // eslint-disable-next-line no-console
              console.error(`Unable to run "${name}": `, err.message);
              setError(err);
            }
          }}>
          (...)
        </span>
      </span>
      {error ?
        <span>
          {' '}
          <i
            title={error.message}
            className="fa fa-exclamation-triangle"
          />
        </span> :
        null
      }
    </li>
  );
});

interface PrimitiveElementProps {
  name?: string;
  value: any;
  computed?: boolean;
}

const PrimitiveElement: React.FC<PrimitiveElementProps> = React.memo(({
  name,
  value,
  computed,
}) => {
  return (
    <li className="entry">
      {name ? <PropertyName name={name} computed={computed} /> : null}
      <span className="value">
        <span className="s">{stringify(value)}</span>
      </span>
    </li>
  );
});

interface PropertyNameProps {
  name: string;
  computed?: boolean;
  onClick?: React.MouseEventHandler;
}

const PropertyName: React.FC<PropertyNameProps> = React.memo(({ name, computed, onClick }) => {
  return (
    <span className="key">
      <span className="name nb" onClick={onClick}>
        {computed ? <span title="computed">*{name}</span> : name}
      </span>
      <span className="p">:&nbsp;</span>
    </span>
  );
});

export default function ElementContainer(props: ElementProps) {
  const [selected, setSelected] = useState(false);
  const setSelectedNode = useSelectedNode();
  
  // Need to check if isInRange exists on treeAdapter before calling?
  // TreeAdapter class has isInRange.
  const isInRange = props.treeAdapter.isInRange(props.value, props.name || '', props.position || -1);
  
  const onClick = useCallback(
    (state: number, own?: boolean) => {
      if (own) {
        if (state === OPEN_STATES.CLOSED) {
          setSelectedNode(null);
          setSelected(false);
        } else {
          setSelectedNode(props.value, () => setSelected(false));
          setSelected(true);
        }
      }
      if (props.onClick) {
        props.onClick(state);
      }
    },
    [props.value, props.onClick, setSelectedNode],
  );

  return (
    <Element
      {...props}
      selected={selected}
      hasChildrenInRange={
        props.treeAdapter.hasChildrenInRange(props.value, props.name || '', props.position || -1)
      }
      isInRange={isInRange}
      onClick={onClick}
    />
  );
}
