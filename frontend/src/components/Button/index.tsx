import type { ReactNode } from 'react';
import './style.css';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
}

const Button = ({
  className,
  children,
  onClick,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      className={`button ${className || ''}`}
      type={type || 'button'}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
