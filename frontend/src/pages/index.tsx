import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/pages/firebase";
import { useRequireLogin } from "@/hooks/useRedirectLogin";

export default function Home() {
  useRequireLogin();
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const handleClick = () => {
    signOut(auth).then(() => {
      router.push('/signin');
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <div>
      <h1>{user?.email}</h1>
      <button onClick={handleClick}>Sign Out</button>
    </div>
  );
}
