interface InputProps {
  className?: string;
  id?: string;
  name?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  className,
  id,
  name,
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
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
