import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import NextLink from 'next/link';
import {
    Box,
    Text,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from '@chakra-ui/react';
import {
    collection,
    getDocs,
    query,
    where,
    documentId,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface EventDetail {
    eventId: string;
    title: string;
    host: string;
    category: boolean;
    dateTime: string;
    location: string;
    description: string;
    contact: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

interface eventPatipant {
    userId: string;
    name: string;
};

export default function EventDetail() {
    const router = useRouter();
    const [event, setEvent] = useState<EventDetail>();
    const [participants, setParticipants] = useState<eventPatipant[]>([]);
    const { eventId } = router.query;

    async function getEventDetail(eventId: string) {
        const eventRef = collection(db, 'events');
        const eventQ = query(eventRef, where(documentId(), '==', eventId));
        const eventSnapshot = await getDocs(eventQ);
        const eventData = eventSnapshot.docs[0].data() as EventDetail;
        return eventData;
    };

    async function getEventParticipants(eventId: string) {
        const userEventsRef = collection(db, 'userEvents');
        const userEventsQ = query(userEventsRef, where('eventId', '==', eventId), where('participationStatus', '==', 1));
        const userEventsSnapshot = await getDocs(userEventsQ);
        const participants = await Promise.all(
            userEventsSnapshot.docs.map(async (doc) => {
                const userId = doc.data().userId;
                const userRef = collection(db, 'users');
                const userQ = query(userRef, where(documentId(), '==', userId));
                const userSnapshot = await getDocs(userQ);
                const userData = userSnapshot.docs[0].data();
                const user = { userId: userId, name: userData.name } as eventPatipant;
                return user;
            })
        );
        return participants;
    };

    useEffect(() => {
        getEventDetail(eventId as string)
            .then((eventData) => {
                setEvent(eventData);
            })
            .catch((error) => {
                console.error('Error fetching events: ', error);
            });

        getEventParticipants(eventId as string)
            .then((participants) => {
                setParticipants(participants);
            })
            .catch((error) => {
                console.error('Error fetching events: ', error);
            });
    }, [eventId]);

    return (
        <Box mt={4} mx={5} px={5}>
        </Box>
    );
}