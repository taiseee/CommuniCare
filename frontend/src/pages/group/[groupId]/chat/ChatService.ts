import {
    getAuth,
    GoogleAuthProvider,
    Auth,
    AuthProvider
} from 'firebase/auth';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    deleteDoc,
    getDocs,
    CollectionReference,
    Timestamp,
    where,
    documentId
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { useParams } from 'next/navigation';

export interface Message {
    id: string;
    text: string;
    timestamp: Timestamp;
    uid: string;
    profile: Profile | undefined;
}

interface ChangedData {
    type: string;
    newIndex: number;
    oldIndex: number;
    message: Message;
}

// プロフィールの型定義
export interface Profile {
    id: string;
    name: string;
    age: number;
    gender: number;
    interests: string;
    hobbies: string;
    selfIntroduction: string;
}
class ChatService {
    auth: Auth = getAuth();
    storage: FirebaseStorage = getStorage();
    provider: AuthProvider = new GoogleAuthProvider();
    groupId: string = useParams().groupId as string;
    messagesRef: CollectionReference = collection(
        db,
        'groups',
        this.groupId,
        'messages'
    );
    members: Profile[] = [];


    async fetchMembers(setMembers: React.Dispatch<React.SetStateAction<Profile[]>>) {
        // グループに所属するユーザーのidを取得
        const userGroupsRef = collection(db, 'userGroups');
        const userGroupsQ = query(
            userGroupsRef,
            where('groupId', '==', this.groupId)
        );
        const userGroupsSnapshot = await getDocs(userGroupsQ);
        const userIds = userGroupsSnapshot.docs.map((doc) => doc.data().userId);

        // ユーザーのプロフィールを取得
        const usersRef = collection(db, 'users');
        const usersQ = query(usersRef, where(documentId(), 'in', userIds));
        const usersSnapshot = await getDocs(usersQ);
        const members: Profile[] = [];
        usersSnapshot.forEach((doc) => {
            members.push({
                ...doc.data(),
                id: doc.id
            } as Profile);
        });
        setMembers(members);
        console.log("init");
    }

    async addMessage(textMessage: string | null, imageUrl: string | null) {
        let data: any;
        const user = this.auth.currentUser;
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        try {
            if (textMessage && textMessage.length > 0) {
                data = await addDoc(this.messagesRef, {
                    text: textMessage,
                    timestamp: serverTimestamp(),
                    uid: user.uid
                });
            }
        } catch (error) {
            console.error(
                'Error writing new message to Firebase Database',
                error
            );
        }

        return data;
    }

    async deleteMessage(messageId: string) {
        const message = doc(db, 'messages', messageId);
        try {
            await deleteDoc(message);
        } catch (error) {
            console.error('Error removing message: ', error);
        }
    }

    createListener(
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
        members: Profile[]
    ) {
        const q = query(
            this.messagesRef,
            orderBy('timestamp')
        );

        return onSnapshot(q, (querySnapshot) => {
            const changedData: ChangedData[] = [];
            querySnapshot.docChanges().forEach((change) => {
                const data = change.doc.data();

                changedData.push({
                    type: change.type,
                    newIndex: change.newIndex,
                    oldIndex: change.oldIndex,
                    message: {
                        id: change.doc.id,
                        text: data.text,
                        timestamp: data.timestamp,
                        uid: data.uid,
                        profile: members.find((member) => member.id === data.uid)
                    }
                });
            });

            this.updateMessages(changedData, setMessages);
        });
    }

    updateMessages(
        changes: ChangedData[],
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    ) {
        setMessages((prev) => {
            const newMessages = [...prev];

            changes.forEach((change) => {
                if (change.type === 'added') newMessages.push(change.message);
                if (change.type === 'modified') {
                    const index = newMessages.findIndex(
                        (item) => item.id === change.message.id
                    );
                    if (index >= 0) newMessages.splice(index, 1, change.message);
                }
                if (change.type === 'removed') {
                    const index = newMessages.findIndex(
                        (item) => item.id === change.message.id
                    );
                    if (index >= 0) newMessages.splice(index, 1);
                }
            });

            return newMessages;
        });
    }
}

export default ChatService;
