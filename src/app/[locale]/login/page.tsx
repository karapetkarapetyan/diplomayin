'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useRouter } from '@/i18n/navigation';
import { auth } from '@/firebase/config';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import styles from './page.module.css';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
      router.push('/profile');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
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
          {/*<button className={styles.button} type="submit">*/}
          {/*  Login*/}
          {/*</button>*/}
          <Button text="Login" type="submit" variant="primary" />
          <p className={styles.linkContainer}>
            Don&apos;t have an account?{' '}
            <Link className={styles.link} href="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
