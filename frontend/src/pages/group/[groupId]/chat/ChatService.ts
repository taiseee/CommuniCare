import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    Auth,
    AuthProvider
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    CollectionReference,
    DocumentData,
    Timestamp,
    startAt,
    startAfter
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import {
    getStorage,
    FirebaseStorage
} from 'firebase/storage';

interface TextMessage {
    text: string;
    timestamp: Timestamp;
    uid: string;
}

interface ImageMessage {
    imageUrl: string;
    timestamp: Timestamp;
    uid: string;
}

export interface Message {
    id: string;
    text?: string;
    imageUrl?: string;
    timestamp: Timestamp;
    uid: string;
}

interface ChangedData {
    type: string;
    newIndex: number;
    oldIndex: number;
    data: Message;
}

class ChatService {
    auth: Auth = getAuth();
    storage: FirebaseStorage = getStorage();
    provider: AuthProvider = new GoogleAuthProvider();
    messages_ref: CollectionReference = collection(db, 'messages');
    // InitMessageMax = 10;
    // FetchMessageMax = 10;

    // async init(
    //     setObserveFrom: React.Dispatch<
    //         React.SetStateAction<DocumentData | null>
    //     >
    // ) {
    //     const q = query(
    //         this.messages_ref,
    //         orderBy('timestamp', 'desc'),
    //         limit(this.InitMessageMax)
    //     );
    //     const docs = (await getDocs(q)).docs;
    //     const oldestMessage = docs[docs.length - 1];
    //     setObserveFrom(oldestMessage);
    // }

    async addMessage(textMessage: string | null, imageUrl: string | null) {
        let data: any;
        const user = this.auth.currentUser;
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        try {
            if (textMessage && textMessage.length > 0) {
                console.log('added textMessage');
                data = await addDoc(this.messages_ref, {
                    text: textMessage,
                    timestamp: serverTimestamp(),
                    uid: user.uid
                });
            } else if (imageUrl && imageUrl.length > 0) {
                console.log('added imageaurlMessage');
                data = await addDoc(this.messages_ref, {
                    imageUrl: imageUrl,
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
        // observeFrom: DocumentData | null
    ) {
        console.log('createListener');
        const q = query(
            this.messages_ref,
            orderBy('timestamp'),
            // startAt(observeFrom)
        );

        return onSnapshot(q, (querySnapshot) => {
            const changedData: ChangedData[] = [];
            querySnapshot.docChanges().forEach((change) => {
                const data = change.doc.data();

                changedData.push({
                    type: change.type,
                    newIndex: change.newIndex,
                    oldIndex: change.oldIndex,
                    data: {
                        id: change.doc.id,
                        text: data?.text,
                        imageUrl: data?.imageUrl,
                        timestamp: data.timestamp,
                        uid: data.uid
                    }
                });
            });
            console.log('changedData', changedData);

            this.updateMessages(changedData, setMessages);
        });
    }

    updateMessages(
        changes: ChangedData[],
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    ) {
        console.log('updateMessages');
        setMessages((prev) => {
            const newMessages = [...prev];

            changes.forEach((change) => {
                if (change.type === 'added') newMessages.push(change.data);
                if (change.type === 'modified') {
                    const index = newMessages.findIndex(
                        (item) => item.id === change.data.id
                    );
                    if (index >= 0) newMessages.splice(index, 1, change.data);
                }
                if (change.type === 'removed') {
                    const index = newMessages.findIndex(
                        (item) => item.id === change.data.id
                    );
                    if (index >= 0) newMessages.splice(index, 1);
                }
            });

            return newMessages;
        });
    }

    async requestNotificationsPermissions() {
        // ...
    }

    async saveMessagingDeviceToken() {
        // ...
    }
}

export default ChatService;
