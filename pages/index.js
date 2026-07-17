import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from '../components/head';

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/shop');
  }, []);
  return <Head title="Doughmains" />;
}
