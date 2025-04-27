'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { Link, useRouter } from '@/i18n/navigation';
import { auth, db } from '@/firebase/config';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import styles from './page.module.css';

const SignUp: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/profile');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const addUser = async (uid: string, email: string) => {
    try {
      const userDoc = doc(db, 'users', uid);
      await setDoc(userDoc, {
        uid,
        email,
        createdAt: serverTimestamp(),
        firstName: '',
        lastName: '',
        username: '',
        position: '',
        phone: '',
        location: '',
        timezone: '',
      });
    } catch (error) {
      console.error('Error adding user to Firestore: ', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (userCredential?.user) {
        await addUser(userCredential.user.uid, userCredential.user.email!);
      }
      setEmail('');
      setPassword('');
      router.push('/profile');
    } catch (error) {
      console.error('Error signing up: ', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles.container}>
        <h2 className={styles.title}>Sign Up</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            required
            onChange={(value) => setEmail(value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            required
            onChange={(value) => setPassword(value)}
          />
          <Button text="Sign Up" type="submit" variant="primary" />
          {/*<button className={styles.button} type="submit"></button>*/}
          <p className={styles.linkContainer}>
            Have an account?{' '}
            <Link className={styles.link} href="/login">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
