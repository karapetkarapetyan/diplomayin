'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import Image from 'next/image';
import Avatar from 'react-avatar';
import Skeleton from 'react-loading-skeleton';
import { useTranslations } from 'next-intl';
import withAuth from '@/lib/withAuth';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import { auth, db } from '@/firebase/config';
import styles from './page.module.css';
import 'react-loading-skeleton/dist/skeleton.css';

function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('Profile');

  // Fetch user data from Firestore
  const getUser = async () => {
    try {
      setIsLoading(true);
      const uid = user?.uid;

      if (uid) {
        const userDoc = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setUsername(data.username);
          setPosition(data.position);
          setEmail(data.email);
          setPhone(data.phone);
          setLocation(data.location);
          setTimezone(data.timezone);
          setBase64Image(data.profilePic || null); // Fetch stored profile picture
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

  const handleSubmit = async () => {
    try {
      const uid = user?.uid;
      const formData = {
        firstName,
        lastName,
        username,
        position,
        email,
        phone,
        location,
        timezone,
        profilePic: base64Image,
      };

      if (uid) {
        const userDoc = doc(db, 'users', uid);
        await updateDoc(userDoc, formData);
        await getUser();
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error(err.message || 'Failed to update profile');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64Image(reader.result as string); // Set Base64 string
      };

      reader.readAsDataURL(file);
    }
  };

  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`;

  return (
    <main className={styles.container}>
      <div className={styles['user-info-block']}>
        <div className={styles['inner-container']}>
          <div className={styles['user-info']}>
            {isLoading ? (
              <Skeleton borderRadius="50%" height={110} width={110} />
            ) : base64Image ? (
              <Image
                alt="Profile picture"
                className={styles['profile-picture']}
                height={110}
                src={base64Image}
                width={110}
              />
            ) : firstName || lastName ? (
              <Avatar color="#ABB1BB" name={`${firstName} ${lastName}`} round="50%" size="110" />
            ) : (
              <Image alt="Default avatar" height={110} src="/default-avatar.png" width={110} />
            )}
            {isLoading ? (
              <div className={styles['text-wrapper']}>
                <Skeleton borderRadius="8px" height={28} width={300} />
                <Skeleton borderRadius="8px" height={28} width={300} />
              </div>
            ) : (
              <div className={styles['text-wrapper']}>
                <p className={styles.name}>{fullName}</p>
                <p className={styles.position}>{userData?.position || ''}</p>
                <p className={styles.location}>
                  {[userData?.location, userData?.timezone].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
          <div className={styles.buttons}>
            <Button
              text={t('upload')}
              variant="primary"
              onClick={() => {
                if (fileInputRef?.current !== null) {
                  fileInputRef.current.click();
                }
              }}
            />
            <input
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              type="file"
              onChange={handleFileChange}
            />
            <Button
              text={t('delete')}
              variant="secondary"
              onClick={() => {
                setBase64Image('');
              }}
            />
          </div>
        </div>
      </div>
      {/* Form to update user details */}
      <div className={styles['form-container']}>
        <div className={styles['form-inner-wrapper']}>
          <Input
            label={t('firstname')}
            placeholder="eg. Jon"
            type="text"
            value={firstName}
            onChange={setFirstName}
          />
          <Input
            label={t('lastname')}
            placeholder="eg. Smith"
            value={lastName}
            onChange={setLastName}
          />
        </div>
        <div className={styles['form-inner-wrapper']}>
          <Input
            label={t('username')}
            placeholder="eg. JonSmith"
            value={username}
            onChange={setUsername}
          />
          <Input
            label={t('position')}
            placeholder="eg. Developer"
            value={position}
            onChange={setPosition}
          />
        </div>
      </div>
      <div className={styles['form-container']}>
        <div className={styles['form-inner-wrapper']}>
          <Input
            label={t('email')}
            leftIcon="/icons/Mail.svg"
            value={email}
            disabled
            onChange={setEmail}
          />
          <Input label={t('phone')} leftIcon="/icons/Phone.svg" value={phone} onChange={setPhone} />
        </div>
      </div>
      <div className={styles['form-container']}>
        <Input
          label={t('location')}
          leftIcon="/icons/location.svg"
          value={location}
          onChange={setLocation}
        />
        <Input
          label={t('time')}
          leftIcon="/icons/clock.svg"
          value={timezone}
          onChange={setTimezone}
        />
      </div>
      {/*<div className={styles['form-container']}>*/}
      {/*  <div className={styles['form-inner-wrapper']}>*/}
      {/*    <Input*/}
      {/*      label="Current Password"*/}
      {/*      leftIcon="/icons/key.svg"*/}
      {/*      type="password"*/}
      {/*      value={currentPassword}*/}
      {/*      onChange={setCurrentPassword}*/}
      {/*    />*/}
      {/*    <Input*/}
      {/*      label="New Password"*/}
      {/*      leftIcon="/icons/key.svg"*/}
      {/*      type="password"*/}
      {/*      value={newPassword}*/}
      {/*      onChange={setNewPassword}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*  <Input*/}
      {/*    label="Confirm Password"*/}
      {/*    leftIcon="/icons/key.svg"*/}
      {/*    type="password"*/}
      {/*    value={passwordConfirm}*/}
      {/*    onChange={setPasswordConfirm}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className={styles.buttons} style={{ justifyContent: 'flex-end' }}>
        <Button text={t('profile')} variant="secondary" onClick={() => {}} />
        <Button text={t('save-changes')} variant="primary" onClick={handleSubmit} />
      </div>
    </main>
  );
}

export default withAuth(ProfilePage);
