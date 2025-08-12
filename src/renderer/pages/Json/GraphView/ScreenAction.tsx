import { useState, useEffect } from 'react';
import { Button } from 'antd';
import Icon from '@/renderer/components/Icon';
const ScreenAction = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleRequestFullScreen = () => {
    const graph = document.getElementById('jsongraph') as HTMLElement | null;
    if (graph) {
      graph.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const handleExitFullScreen = () => {
    document.exitFullscreen();
    setIsFullScreen(false);
  };

  useEffect(() => {
    if (window.fullScreen) {
      setIsFullScreen(true);
    }
  }, []);

  return (
    <div
      className="screen-action"
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        alignItems: 'start',
        zIndex: 100,
      }}
    >
      {isFullScreen ? (
        <Button
          icon={<Icon type="icon-tuichuquanping" withHoverBg size={18} />}
          onClick={handleExitFullScreen}
        ></Button>
      ) : (
        <Button icon={<Icon type="icon-quanping" withHoverBg size={18} />} onClick={handleRequestFullScreen}></Button>
      )}
    </div>
  );
};

export default ScreenAction;
