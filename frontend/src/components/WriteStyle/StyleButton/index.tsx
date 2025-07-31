interface StyleButtonProps {
  active: boolean;
  label: string;
  onToggle: (style: string) => void;
  style: string;
}

const StyleButton = ({ active, label, onToggle, style }: StyleButtonProps) => {
  let className = 'RichEditor-styleButton';
  if (active) {
    className += ' RichEditor-activeButton';
  }
  return (
    <span
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
    >
      {label}
    </span>
  );
};

export default StyleButton;
