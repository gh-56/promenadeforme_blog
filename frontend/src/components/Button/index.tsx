import './style.css';

interface ButtonProps {
  className?: string;
  text: string;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({ className, text, onClick, type = 'button' }: ButtonProps) => {
  return (
    <button
      className={`button ${className || ''}`}
      type={type || 'button'}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
