import { css, cx } from '@emotion/css';
import { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Icon from '@/components/Icon';

interface IProps {
  value: string;
  className?: string;
  size?: number;
}

const CopyComponent = (props: IProps) => {
  const { value, className, size = 20 } = props;
  const timer = useRef<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    setCopied(true);
    timer.current = setTimeout(() => {
      setCopied(false);
      clearTimeout(timer.current);
      timer.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  return (
    <CopyToClipboard text={value} onCopy={handleCopy}>
      <span className={cx(className, css(`cursor:pointer;`))}>
        {copied ? (
          <Icon
            className={css(`
            color: #52c41a;
            font-size:${size}px;
          `)}
            type="icon-icon_duihao-xian"
          />
        ) : (
          <Icon
            className={css(`
          font-size:${size}px;
        `)}
            type="icon-kaobei"
          />
        )}
      </span>
    </CopyToClipboard>
  );
};

export default CopyComponent;
