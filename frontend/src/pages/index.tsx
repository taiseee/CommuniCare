import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
    Box,
    Heading,
    Divider,
    Flex,
    Spacer,
    Text,
    Badge,
    SkeletonText,
    useMediaQuery,
} from '@chakra-ui/react';
import {
    collection,
    query,
    orderBy,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface EventListItem {
    eventId: string;
    title: string;
    host: string;
    category: boolean;
    location: string;
    updatedAt: Timestamp;
    participantsNum: number;
}

export default function Home() {
    const [events, setEvents] = useState<EventListItem[]>([]);

    async function getSortedEvents(): Promise<EventListItem[]> {
        const eventsRef = collection(db, 'events');
        const eventsQ = query(eventsRef, orderBy('updatedAt', 'desc'));
        const eventsSnapshot = await getDocs(eventsQ);
        const events = await Promise.all(
            eventsSnapshot.docs.map(async (doc) => {
                const eventId = doc.id;
                const eventData = doc.data();
                const participantsNum = await getPaticipantsNum(eventId);
                return { eventId, ...eventData, participantsNum } as EventListItem;
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
        <Box mt={4} mx={5} px={5}>
            <Heading as='h2' size='xl' pb={2}>イベント一覧</Heading>
            <Divider borderColor={'teal.200'} borderWidth={'4px'} />
            <Box pt={2} px={2}>
                {
                    events.length !== 0 ? (
                        events.map((event: EventListItem) => {
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

function EventListItem({ event }: { event: EventListItem }) {
    const [isSmallerThan480] = useMediaQuery("(max-width: 480px)");
    return (
        <Box as={NextLink} href={`/${event.eventId}`} _hover={{ "& .underlineOnHover": { textDecoration: "underline" } }}>
            <Box pb={2}>
                <Flex py={1}>
                    <Box>
                        <Badge me={1}>{event.host}</Badge>
                        {event.category ?
                            <Badge variant='subtle' colorScheme='green'>ボランティア</Badge>
                            :
                            <Badge variant='subtle' colorScheme='blue'>地域活動</Badge>
                        }
                    </Box>
                    <Spacer />
                    <Text ps={2} color={'grey'} fontSize='sm'>
                        {event.updatedAt.toDate().toLocaleDateString()}
                    </Text>
                </Flex>
                <Text fontSize='lg' fontWeight={'bold'} py={1} className="underlineOnHover">
                    {event.title}
                </Text>
                <Flex py={1} direction={isSmallerThan480 ? "column" : "row"}>
                    <Flex>
                        <Box pt={1} pe={1}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 12q.825 0 1.413-.587T14 10q0-.825-.587-1.412T12 8q-.825 0-1.412.588T10 10q0 .825.588 1.413T12 12m0 10q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2q3.175 0 5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22" />
                            </svg>
                        </Box>
                        <Text>
                            {event.location ? event.location : '不明'}
                        </Text>
                    </Flex>
                    <Spacer />
                    <Text>
                        参加人数：{event.participantsNum}人
                    </Text>
                </Flex>
            </Box>
            <Divider borderColor={'grey'} />
        </Box>
    );
}

function EventListSkeletonItem() {
    return (
        <Box>
            <SkeletonText my={4} noOfLines={3} spacing={2} skeletonHeight={3} />
            <Divider borderColor={'grey'} />
        </Box>
    );
}
