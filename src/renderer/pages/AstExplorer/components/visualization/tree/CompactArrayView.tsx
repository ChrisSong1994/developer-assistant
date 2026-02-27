
import React from 'react';

interface CompactArrayViewProps {
  array: any[] | { length: number };
  onClick?: (event: React.MouseEvent) => void;
}

const CompactArrayView: React.FC<CompactArrayViewProps> = React.memo(({ array, onClick }) => {
  const count = (array as any[]).length;

  if (count === 0) {
    return <span className="p">{'[ ]'}</span>;
  } else {
    return (
      <span>
        <span className="p">{'['}</span>
        <span className="compact placeholder ge" onClick={onClick}>
          {count + ' element' + (count > 1 ? 's' : '')}
        </span>
        <span className="p">{']'}</span>
      </span>
    );
  }
}, (prevProps, nextProps) => {
  return (prevProps.array as any[]).length === (nextProps.array as any[]).length;
});

export default CompactArrayView;
