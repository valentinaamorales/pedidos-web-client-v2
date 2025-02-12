'use client'

import { useParams } from 'next/navigation';

export default function UserDetails() {
  const { userId } = useParams();
  return (
    <main>
      <h1>User Details from user {userId}</h1>
    </main>
  );
}
