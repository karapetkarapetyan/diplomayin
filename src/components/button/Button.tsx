import React from 'react';
import styles from './Button.module.css';

interface IButtonProps {
  text: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<IButtonProps> = ({ text, onClick, variant, type = 'button', ...rest }) => (
  <button
    className={`${styles.button} ${variant === 'secondary' ? styles.secondary : styles.primary}`}
    type={type}
    onClick={onClick}
    {...rest}
  >
    {text}
  </button>
);

export default Button;
