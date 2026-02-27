
import React from 'react';

interface CompactObjectViewProps {
  keys: string[];
  onClick?: (event: React.MouseEvent) => void;
}

const CompactObjectView: React.FC<CompactObjectViewProps> = ({ keys, onClick }) => {
  if (keys.length === 0) {
    return <span className="p">{'{ }'}</span>;
  } else {
    let displayKeys = keys;
    if (keys.length > 5) {
      displayKeys = keys.slice(0, 5).concat([`... +${keys.length - 5}`]);
    }
    return (
      <span>
        <span className="p">{'{'}</span>
        <span className="compact placeholder ge" onClick={onClick}>
          {displayKeys.join(', ')}
        </span>
        <span className="p">{'}'}</span>
      </span>
    );
  }
};

export default CompactObjectView;
