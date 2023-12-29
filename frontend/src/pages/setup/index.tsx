import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useAuthContext } from '@/provider/AuthProvider';

export default function Setup() {
    const { user } = useAuthContext();
    const handleClick = async () => {
        if (user?.uid) {
            return setDoc(
                doc(db, 'users', user?.uid),
                {
                    uid: user?.uid,
                    name: '武石航汰',
                },
                {
                    merge: true
                }
            ).then(() => {
                // TODO: ここでリダイレクトや成功popupなどを実装
                console.log('書き込み成功！！');
            });
        }
    }

    return (
        <>
            <h1>Setup</h1>
            <button onClick={handleClick}>
                更新！！
            </button>
        </>
    );
}