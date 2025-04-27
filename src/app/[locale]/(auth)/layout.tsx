'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Sidebar from '@/components/sidebar/Sidebar';
import withAuth from '@/lib/withAuth';
import { auth } from '@/firebase/config';
import styles from './layout.module.css';

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles['main-content']} style={{ marginLeft: isOpen ? '200px' : '60px' }}>
        <Navbar isOpen={isOpen} user={user} />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default withAuth(AuthLayout);
