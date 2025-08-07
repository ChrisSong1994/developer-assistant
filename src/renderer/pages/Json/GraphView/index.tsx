import React, { useEffect } from 'react';
import { Box, LoadingOverlay, useComputedColorScheme, MantineProvider } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import styled from 'styled-components';
import { debounce } from 'lodash';
import { Space } from 'react-zoomable-ui';
import { Canvas } from 'reaflow';
import type { ElkRoot } from 'reaflow';
import { useLongPress } from 'use-long-press';
import { CustomEdge } from './CustomEdge';
import { CustomNode } from './CustomNode';
import { ZoomControl } from './ZoomControl';
import useGraph from './stores/useGraph';

const StyledEditorWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  --bg-color: #f7f7f7;
  --line-color-1: #ebe8e8;
  --line-color-2: #f2eeee;

  background-color: var(--bg-color);
  background-image: linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(90deg, var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(var(--line-color-2) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-color-2) 1px, transparent 1px);
  background-position: -1.5px -1.5px, -1.5px -1.5px, -1px -1px, -1px -1px;
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;

  .jsoncrack-space {
    cursor: url('/assets/cursor.svg'), auto;
  }

  :active {
    cursor: move;
  }

  .dragging,
  .dragging button {
    pointer-events: none;
  }

  text {
    fill: #4f5660 !important;
  }

  rect {
    fill: #f6f8fa;
  }

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const layoutOptions = {
  'elk.layered.compaction.postCompaction.strategy': 'EDGE_LENGTH',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
};

const GraphCanvas = (props: { value: string }) => {
  const graphStore = useGraph();
  const setLoading = useGraph((state) => state.setLoading);
  const centerView = useGraph((state) => state.centerView);
  const direction = useGraph((state) => state.direction);
  const nodes = useGraph((state) => state.nodes);
  const edges = useGraph((state) => state.edges);
  const colorScheme = useComputedColorScheme();
  const [paneWidth, setPaneWidth] = React.useState(2000);
  const [paneHeight, setPaneHeight] = React.useState(2000);

  useEffect(() => {
    graphStore.setGraph(props.value);
  }, [props.value]);

  const onLayoutChange = React.useCallback(
    (layout: ElkRoot) => {
      if (layout.width && layout.height) {
        const areaSize = layout.width * layout.height;
        const changeRatio = Math.abs((areaSize * 100) / (paneWidth * paneHeight) - 100);

        setPaneWidth(layout.width + 50);
        setPaneHeight((layout.height as number) + 50);

        setTimeout(() => {
          window.requestAnimationFrame(() => {
            if (changeRatio > 70) centerView();
            setLoading(false);
          });
        });
      }
    },
    [paneHeight, paneWidth, centerView, setLoading],
  );

  return (
    <Canvas
      className="jsongraph-canvas"
      onLayoutChange={onLayoutChange}
      node={(p) => <CustomNode {...p} />}
      edge={(p) => <CustomEdge {...p} />}
      nodes={nodes}
      edges={edges}
      arrow={null}
      maxHeight={paneHeight}
      maxWidth={paneWidth}
      height={paneHeight}
      width={paneWidth}
      direction={direction}
      layoutOptions={layoutOptions}
      key={[direction, colorScheme].join('-')}
      pannable={false}
      zoomable={false}
      animated={false}
      readonly={true}
      dragEdge={null}
      dragNode={null}
      fit={true}
    />
  );
};

export const GraphView = (props: { value: string }) => {
  const setViewPort = useGraph((state) => state.setViewPort);
  const viewPort = useGraph((state) => state.viewPort);
  const loading = useGraph((state) => state.loading);
  const gesturesEnabled = true;
  const [debouncedLoading] = useDebouncedValue(loading, 300);

  const callback = React.useCallback(() => {
    const canvas = document.querySelector('.jsongraph-canvas') as HTMLDivElement | null;
    canvas?.classList.add('dragging');
  }, []);

  const bindLongPress = useLongPress(callback, {
    threshold: 150,
    onFinish: () => {
      const canvas = document.querySelector('.jsongraph-canvas') as HTMLDivElement | null;
      canvas?.classList.remove('dragging');
    },
  });

  const blurOnClick = React.useCallback(() => {
    if ('activeElement' in document) (document.activeElement as HTMLElement)?.blur();
  }, []);

  const debouncedOnZoomChangeHandler = debounce(() => {
    setViewPort(viewPort!);
  }, 300);

  return (
    <MantineProvider>
      <Box pos="relative" h="calc(100vh - 100px)" w="100%">
        <LoadingOverlay visible={debouncedLoading} />
        <ZoomControl />
        <StyledEditorWrapper
          onContextMenu={(e) => e.preventDefault()}
          onClick={blurOnClick}
          key={String(gesturesEnabled)}
          {...bindLongPress()}
        >
          <Space
            onUpdated={() => debouncedOnZoomChangeHandler()}
            onCreate={setViewPort}
            onContextMenu={(e) => e.preventDefault()}
            treatTwoFingerTrackPadGesturesLikeTouch={gesturesEnabled}
            pollForElementResizing
            className="jsoncrack-space"
          >
            <GraphCanvas value={props.value} />
          </Space>
        </StyledEditorWrapper>
      </Box>
    </MantineProvider>
  );
};
