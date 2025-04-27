import React, { useEffect, useRef, useState } from 'react';
import { signOut } from '@firebase/auth';
import Skeleton from 'react-loading-skeleton';
import Image from 'next/image';
import Avatar from 'react-avatar';
import { doc, getDoc } from '@firebase/firestore';
import { useLocale } from 'use-intl';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslations } from 'next-intl';
import { auth, db } from '@/firebase/config';
import useClickOutside from '@/hooks/useClickOutside';
import SelectInput, { Option } from '@/components/selectInput/SelectInput';
import { usePathname, useRouter } from '@/i18n/navigation';
import styles from './Navbar.module.css';

enum LOCALES {
  EN = 'en',
  HY = 'hy',
}

const LOCALE_OPTIONS = [
  {
    label: 'English',
    value: LOCALES.EN,
  },
  {
    label: 'Հայերեն',
    value: LOCALES.HY,
  },
];

interface NavbarProps {
  user: any;
  isOpen: boolean;
}

const Navbar = ({ user, isOpen }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const locale = useLocale();

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocale, setSelectedLocale] = useState<Option>(
    () => LOCALE_OPTIONS.filter((el) => el.value === locale)[0],
  );

  const t = useTranslations('Profile');

  const popupRef = useRef<HTMLDivElement>(null);

  useClickOutside(popupRef, () => setIsPopupShown(false));

  const getUser = async () => {
    try {
      const uid = user?.uid;

      if (uid) {
        const userDoc = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();

          setFirstName(data.firstName);
          setLastName(data.lastName);
          setBase64Image(data.profilePic || null);
        } else {
          console.error('User not found in Firestore');
        }
      }
    } catch (err: any) {
      console.error(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getUser();
    })();
  }, [user]);

  const handleLocaleChange = (nextLocale: Option) => {
    router.replace({ pathname }, { locale: nextLocale.value });
    setSelectedLocale(nextLocale);
  };

  return (
    <header className={`${styles.navbar} ${!isOpen ? styles.collapsed : ''}`}>
      <SelectInput
        options={LOCALE_OPTIONS}
        value={selectedLocale}
        onChange={(value) => handleLocaleChange(value)}
      />
      <div className={styles['navbar-right']} ref={popupRef}>
        {isLoading ? (
          <Skeleton borderRadius="50%" height={40} width={40} />
        ) : base64Image ? (
          <Image
            alt="Profile picture"
            className={styles.avatar}
            height={40}
            src={base64Image}
            width={40}
            onClick={() => setIsPopupShown(!isPopupShown)}
          />
        ) : (
          <Avatar
            className={styles.avatar}
            color="#ABB1BB"
            name={`${firstName} ${lastName}`}
            round="50%"
            size="40px"
            onClick={() => setIsPopupShown(!isPopupShown)}
          />
        )}
        {isPopupShown && (
          <div className={styles['actions-popup']}>
            <button
              className={styles.button}
              onClick={() => {
                setIsPopupShown(false);
                router.push('/profile');
              }}
            >
              {t('profile')}
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setIsPopupShown(false);
                signOut(auth);
              }}
            >
              {t('log-out')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
