import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    documentId
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useParams } from 'next/navigation';
import { Avatar, AvatarGroup } from '@chakra-ui/react';

interface Participant {
    id: string;
    name: string;
    imageUrl: string;
}

interface ParticipantListProps {
    eventId: string;
    status: number;
}

function ParticipantList({ eventId, status }: ParticipantListProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const params = useParams();
    async function fetchParticipants() {
        try {
            // グループに参加しているユーザーのidを取得
            const userGroupsRef = collection(db, 'userGroups');
            const userGroupsQ = query(
                userGroupsRef,
                where('groupId', '==', params.groupId)
            );
            const userGroupsSnapshot = await getDocs(userGroupsQ);
            const userIds = userGroupsSnapshot.docs.map(
                (doc) => doc.data().userId
            );

            // そのうちイベントに参加しているユーザーのidを取得
            const userEventsRef = collection(db, 'userEvents');
            const userEventsQ = query(
                userEventsRef,
                where('eventId', '==', eventId)
            );
            const userEventsSnapshot = await getDocs(userEventsQ);
            const participantIds = userEventsSnapshot.docs
                .filter((doc) => doc.data().participationStatus === 1)
                .map((doc) => doc.data().userId);

            if (participantIds.length === 0) return setParticipants([]);
            
            // クエリのin句に渡せるようにidを30個ずつに分割
            const chunkSize: number = 30;
            const participantIdChunks: string[][] = [];
            for (let i = 0; i < participantIds.length; i += chunkSize) {
                participantIdChunks.push(participantIds.slice(i, i + chunkSize));
            }

            // ユーザーのデータを取得
            const usersRef = collection(db, 'users');
            const usersSnapshots = await Promise.all(
                participantIdChunks.map((participantIds) => {
                    const usersQ = query(
                        usersRef,
                        where(documentId(), 'in', participantIds),
                        where(documentId(), 'in', userIds)
                    );
                    return getDocs(usersQ);
                })
            );
            const participantLists = usersSnapshots.flatMap((snapshot) => {
                return snapshot.docs.map((doc) => {
                    return { ...(doc.data() as Participant), id: doc.id };
                });
            });
            setParticipants(participantLists);
        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    }

    useEffect(() => {
        fetchParticipants();
    }, [status]);

    return (
        <>
            <AvatarGroup size="sm" max={4} mt={2}>
                {participants.map((participant) => (
                    <Avatar
                        name={participant.name}
                        src={participant.imageUrl}
                        bg="gray.100"
                        color="black"
                        key={participant.id}
                    />
                ))}
            </AvatarGroup>
        </>
    );
}

export default ParticipantList;
