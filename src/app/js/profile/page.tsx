'use client';

import Head from 'next/head'
import Image from 'next/image'
import styles from '@styles/Home.module.css'
import Link from 'next/link'
import { getSession, useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile Page</title>
      </Head>

      {session ? <User session={session} /> : <Guest />}
    </div>
  );
}

// Authorize User
function User({ session }) {
  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <main className="container mx-auto text-center py-20">
      <h3 className='text-4xl font-bold'>Profile Page</h3>
      <br />
      <div className='details'>
        <h5>{capitalizeFirstLetter(session.user.name)}</h5>
        <h5>{session.user.email}</h5>
      </div>
      <br />

  <div className="flex justify-center">
    <Link href="/home" legacyBehavior>
      <a
        className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
        style={{
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 0 10px black',
          borderRadius: '20px',
        }}
      >
        Home Page
      </a>
    </Link>
  </div>

    </main>
  );
}

// Guest
function Guest() {
  return (
    <main className="container mx-auto text-center py-20">
      <h3 className='text-4xl font-bold'>Guest Homepage</h3>

      <div className='flex justify-center'>
        <Link href={'/home'} legacyBehavior>
          <a className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
            style={{
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 0 10px black',
              borderRadius: '20px',
            }}
          >Sign In</a>
        </Link>
      </div>
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}