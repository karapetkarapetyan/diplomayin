import React, { useRef, useState } from 'react';
import Image from 'next/image';
import useClickOutside from '@/hooks/useClickOutside';
import styles from './SelectInput.module.css';

export type Option = { label: string; value: string };

interface SelectProps {
  value: Option;
  onChange: (value: Option) => void;
  label?: string;
  placeholder?: string;
  options: Option[];
}

const SelectInput: React.FC<SelectProps> = ({ value, onChange, label, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };

  useClickOutside(popupRef, () => setIsOpen(false));

  return (
    <div className={styles.container} ref={popupRef}>
      {label && (
        <label className={styles.label} htmlFor="user-select">
          {label}
        </label>
      )}
      <div className={styles['input-container']} onClick={handleToggleDropdown}>
        <div className={styles['input-text']}>{value.label || placeholder}</div>
        <Image
          alt="Right icon"
          className={isOpen ? `${styles['icon-right']} ${styles.open}` : styles['icon-right']}
          height={24}
          src="/icons/arrow.svg"
          width={24}
        />
        {isOpen && (
          <div className={styles.dropdown}>
            {options.map((option, index) => (
              <div className={styles.option} key={index} onClick={() => handleOptionClick(option)}>
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInput;
