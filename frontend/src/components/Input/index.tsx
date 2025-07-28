import './style.css';

interface InputProps {
  className?: string;
  id?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  className,
  id,
  type,
  placeholder,
  value,
  onChange,
}: InputProps) => {
  const inputClassName = `input ${className || ''}`;
  return (
    <input
      className={inputClassName}
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
