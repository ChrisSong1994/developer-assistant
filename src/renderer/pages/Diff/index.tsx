import { DiffEditor } from '@/components/MonacaEditor';

const Signature = (props: any) => {
  return (
    <div>
      <DiffEditor original="111" modified="222" />
    </div>
  );
};

export default Signature;
