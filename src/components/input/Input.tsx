import React, { useState, forwardRef } from 'react';
import Image from 'next/image';
import styles from './Input.module.css';

interface InputProps {
  value?: string;
  onChange: (value: any) => void;
  onClick?: () => void;
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      onClick,
      label,
      leftIcon,
      rightIcon,
      placeholder,
      type = 'text',
      disabled = false,
      required = false,
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);

    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon || type === 'password');

    const padding = (() => {
      if (hasLeftIcon && hasRightIcon) return '0 56px 0 56px';
      if (hasRightIcon) return '0 56px 0 20px';
      if (hasLeftIcon) return '0 20px 0 56px';
      return '0 20px';
    })();

    return (
      <div className={styles.container}>
        {label && (
          <label className={styles.label} htmlFor="user-input">
            {label}
          </label>
        )}
        <div className={styles['input-container']}>
          {leftIcon && (
            <Image
              alt="Left icon"
              className={styles['icon-left']}
              height={24}
              src={leftIcon}
              width={24}
            />
          )}
          <input
            disabled={disabled}
            placeholder={placeholder}
            ref={ref}
            required={required}
            style={{ padding }}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={onClick}
          />
          {rightIcon && (
            <Image
              alt="Right icon"
              className={styles['icon-right']}
              height={24}
              src={rightIcon}
              width={24}
            />
          )}
          {type === 'password' && (
            <Image
              alt="Eye icon"
              className={styles['icon-right']}
              height={24}
              src={showPassword ? '/icons/eye.svg' : '/icons/eye-closed.svg'}
              style={{ cursor: 'pointer' }}
              width={24}
              onClick={handleShowPassword}
            />
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
