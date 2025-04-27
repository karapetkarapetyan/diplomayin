import { useEffect, MutableRefObject } from 'react';

// Define the types for the ref and callback function
const useOutsideClick = (ref: MutableRefObject<HTMLElement | null>, callback: () => void) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []); // Empty dependency array to run effect once on mount and cleanup on unmount
};

export default useOutsideClick;
