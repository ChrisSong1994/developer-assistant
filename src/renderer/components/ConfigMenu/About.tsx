import { Button, Modal } from 'antd';

import { useGlobalData } from '@/hooks';
import Events from '@/utils/events';
import logo from '../../../assets/logo.png';

interface IAboutProps {
  open: boolean;
  onClose: () => void;
}

const About = (props: IAboutProps) => {
  const { open, onClose } = props;
  const { appVersion } = useGlobalData();

  return (
    <Modal title="关于" open={open} onCancel={onClose} footer={<Button onClick={onClose}>关闭</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} style={{ width: 60, height: 60, marginBottom: 6 }} alt="Developer Assistant" />
        <span style={{ marginBottom: 6 }}> v{appVersion} </span>
        <p style={{ textIndent: 28 }}>
          开发者助手是一款开源免费的开发小工具集，涉及到json数据、文本diff、色彩转换、二维码和图片编辑等；假如你喜欢它请不要吝啬
          Star🌟，假如你发现问题或者有好的建议请
          <a onClick={() => Events.openUrl({ url: 'https://github.com/ChrisSong1994/developer-assistant/issues' })}>
            前往
          </a>
          沟通。
        </p>
      </div>
    </Modal>
  );
};

export default About;
