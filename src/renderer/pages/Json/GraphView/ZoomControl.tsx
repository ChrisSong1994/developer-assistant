import { useHotkeys } from '@mantine/hooks';
import { Button, Input, Flex, Dropdown } from 'antd';
import { getHotkeyHandler } from '@mantine/hooks';
import { LuFocus, LuMaximize, LuMinus, LuPlus, LuDownload } from 'react-icons/lu';
import { toJpeg, toPng, toSvg } from 'html-to-image';

import Events from '@/renderer/utils/events';
import useGraph from './stores/useGraph';
import { useFocusNode } from './hooks/useFocusNode';

enum Extensions {
  SVG = 'svg',
  PNG = 'png',
  JPEG = 'jpeg',
}

const getDownloadFormat = (format: Extensions) => {
  switch (format) {
    case Extensions.SVG:
      return toSvg;
    case Extensions.PNG:
      return toPng;
    case Extensions.JPEG:
      return toJpeg;
  }
};

export const ZoomControl = () => {
  const zoomIn = useGraph((state) => state.zoomIn);
  const zoomOut = useGraph((state) => state.zoomOut);
  const centerView = useGraph((state) => state.centerView);
  const focusFirstNode = useGraph((state) => state.focusFirstNode);
  const [searchValue, setValue, skip, nodeCount, currentNode] = useFocusNode();

  useHotkeys(
    [
      ['mod+[plus]', () => zoomIn, { usePhysicalKeys: true }],
      ['mod+[minus]', () => zoomOut, { usePhysicalKeys: true }],
      ['shift+Digit1', centerView, { usePhysicalKeys: true }],
      ['shift+Digit2', focusFirstNode, { usePhysicalKeys: true }],
    ],
    [],
  );

  const handleDownload = async (format: Extensions) => {
    const imageElement = document.querySelector("svg[id*='ref']") as HTMLElement;
    const dataURI = await getDownloadFormat(format)(imageElement, {
      quality: 1,
      backgroundColor: '#ffffff',
      pixelRatio: window.devicePixelRatio, // 匹配屏幕像素比
    });

    await Events.saveBase64ImageToLocal({
      fileName: `未命名.${format}`,
      payload: dataURI.replace(`data:image/${format};base64,`, ''),
      format,
    });
  };

  return (
    <Flex
      gap="small"
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        alignItems: 'start',
        zIndex: 100,
      }}
    >
      <Flex gap="small" align="center">
        <Button icon={<LuFocus />} onClick={focusFirstNode} />
        <Button icon={<LuMaximize />} onClick={centerView} />
        <Button icon={<LuMinus />} onClick={zoomOut} />
        <Button icon={<LuPlus />} onClick={zoomIn} />
        {/* <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                label: 'png',
                key: 'png',
              },

              {
                label: 'jpeg',
                key: 'jpeg',
              },
              {
                label: 'svg',
                key: 'svg',
              },
            ],
            onClick: ({ key }: any) => handleDownload(key),
          }}
        >
          <Button icon={<LuDownload />} />
        </Dropdown> */}
      </Flex>

      <Input
        placeholder="Search Node"
        variant="underlined"
        value={searchValue}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={getHotkeyHandler([['Enter', skip]])}
        suffix={searchValue && `${nodeCount}/${nodeCount > 0 ? currentNode + 1 : '0'}`}
      />
    </Flex>
  );
};
