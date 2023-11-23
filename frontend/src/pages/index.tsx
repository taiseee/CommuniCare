import { useRouter } from 'next/router'
import { signOut } from "firebase/auth";
import { auth } from "./firebase"

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;

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
  )
}
