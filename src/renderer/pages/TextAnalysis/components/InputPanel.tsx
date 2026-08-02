/**
 * 顶部共享输入区：textarea + 操作栏（复制/清空/导入文件）
 */
import { Input, Tooltip } from 'antd';
import { memo } from 'react';

import ActionsBarWrap from '@/renderer/components/ActionsBarWrap';
import Copy from '@/renderer/components/Copy';
import Icon from '@/renderer/components/Icon';
import Events from '@/renderer/utils/events';

interface IProps {
  value: string;
  onChange: (value: string) => void;
}

const InputPanel = ({ value, onChange }: IProps) => {
  const handleClear = () => onChange('');

  const handleImport = async () => {
    const res = await Events.getFileFromLocalPath();
    if (res?.fileValue) onChange(res.fileValue);
  };

  return (
    <div>
      <ActionsBarWrap palcement="right">
        <Tooltip title="导入文件">
          <Icon type="icon-folder" size={18} onClick={handleImport} />
        </Tooltip>
        <Copy value={value} size={18} />
        <Tooltip title="清空">
          <Icon type="icon-delete" size={18} onClick={handleClear} />
        </Tooltip>
      </ActionsBarWrap>
      <Input.TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="请输入要分析的文本…"
        spellCheck={false}
        autoSize={{ minRows: 8, maxRows: 16 }}
        style={{ border: '1px solid #e8e8e8', borderRadius: 4 }}
      />
    </div>
  );
};

export default memo(InputPanel);
