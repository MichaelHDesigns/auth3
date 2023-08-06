'use client';

import Head from 'next/head'
import Image from 'next/legacy/image'
import styles from '@styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { getSession, useSession, signOut } from "next-auth/react";


export default function Home() {

  const { data: session } = useSession()

  function handleSignOut(){
    signOut()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
      </Head>

      {session ? User({ session, handleSignOut }) : Guest()}
    </div>

  )
}

// Guest
function Guest(){
  return (
    <main className="container mx-auto text-center py-20">
          <h3 className='text-4xl font-bold'>TikToken Homepage</h3>


          <div className='flex justify-center'>
            <Link href={'/login'} legacyBehavior><a className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
      style={{
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 0 10px black',
        borderRadius: '20px',
      }}
    >Sign In</a></Link>
          </div>
      </main>
  )
}

// Authorize User
function User({ session, handleSignOut }){

  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return(
<main className="container mx-auto text-center py-20">
  <h3 className='text-4xl font-bold'>User Homepage</h3>
<br />
  <div className='details'>
    <h5>{capitalizeFirstLetter(session.user.name)}</h5>
    <h5>{session.user.email}</h5>
  </div>
<br />

  <div className="flex justify-center">
    <Link href="/js/profile" legacyBehavior>
      <a
        className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
        style={{
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 0 10px black',
          borderRadius: '20px',
        }}
      >
        Profile
      </a>
    </Link>
  </div>

  <div className="flex justify-center">
    <button
      onClick={handleSignOut}
      className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
      style={{
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 0 10px black',
        borderRadius: '20px',
      }}
    >
      Log Out
    </button>
  </div>
</main>
  )
}


export async function getServerSideProps({ req }){
  const session = await getSession({ req })

  if(!session){
    return {
      redirect : {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}