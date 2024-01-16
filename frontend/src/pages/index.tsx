import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Divider,
    useMediaQuery
} from '@chakra-ui/react';
import {
    collection,
    query,
    orderBy,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import EventListItem from '@/components/EventListItem';
import EventListSkeletonItem from '@/components/EventListSkeletonItem';
import { EventListItem as EventListItemType } from '@/types';

export default function Home() {
    const [events, setEvents] = useState<EventListItemType[]>([]);
    const [isSmallerThan480] = useMediaQuery("(max-width: 480px)");

    async function getSortedEvents(): Promise<EventListItemType[]> {
        const eventsRef = collection(db, 'events');
        const eventsQ = query(eventsRef, orderBy('updatedAt', 'desc'));
        const eventsSnapshot = await getDocs(eventsQ);
        const events = await Promise.all(
            eventsSnapshot.docs.map(async (doc) => {
                const eventId = doc.id;
                const eventData = doc.data();
                const participantsNum = await getPaticipantsNum(eventId);
                return { eventId, ...eventData, participantsNum } as EventListItemType;
            })
        );
        return events;
    };

    async function getPaticipantsNum(eventId: string): Promise<number> {
        const userEventsRef = collection(db, 'userEvents');
        const userEventsQ = query(userEventsRef, where('eventId', '==', eventId), where('participationStatus', '==', 1));
        const userEventsSnapshot = await getDocs(userEventsQ);
        const participantsNum = userEventsSnapshot.size;
        return participantsNum;
    }

    useEffect(() => {
        getSortedEvents()
            .then(events => {
                setEvents(events);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <Box mt={4} mx={5} px={isSmallerThan480? 0 : 5}>
            <Heading as='h2' size='xl' pb={2}>イベント一覧</Heading>
            <Divider borderColor={'teal.200'} borderWidth={'4px'} />
            <Box pt={2} px={2}>
                {
                    events.length !== 0 ? (
                        events.map((event: EventListItemType) => {
                            return (
                                <EventListItem key={event.eventId} event={event} />
                            );
                        })
                    ) : (
                        <>
                            {[...Array(4)].map((_, index) => (
                                <EventListSkeletonItem key={index}/>
                            ))}
                        </>
                    )
                }
            </Box>
        </Box>
    );
}
