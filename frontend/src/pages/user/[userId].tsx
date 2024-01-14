import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Text,
    Heading,
    Flex,
    Card,
    CardHeader,
    CardBody,
    Avatar,
    Table,
    Tbody,
    Tr,
    Td,
    useMediaQuery
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
import EventListItem from '@/components/EventListItem';
import EventListSkeletonItem from '@/components/EventListSkeletonItem';

interface UserDetail {
    userId: string;
    name: string;
    age: number;
    gender: number;
    interests: string;
    hobbies: string;
    selfIntroduction: string;
};

interface ParticipateEvent {
    eventId: string;
    title: string;
    host: string;
    category: boolean;
    location: string;
    updatedAt: Timestamp;
    participantsNum: number;
};

interface EventListItem {
    eventId: string;
    title: string;
    host: string;
    category: boolean;
    location: string;
    updatedAt: Timestamp;
    participantsNum: number;
}

export default function UserDetail() {
    const router = useRouter();
    const { userId } = router.query;
    const [user, setUser] = useState<UserDetail>();
    const [participateEvents, setParticipateEvents] = useState<ParticipateEvent[]>([]);
    const [isSmallerThan480] = useMediaQuery("(max-width: 480px)");

    async function getUserDetail(userId: string): Promise<UserDetail> {
        const userRef = collection(db, 'users');
        const userQ = query(userRef, where(documentId(), '==', userId));
        const userSnapshot = await getDocs(userQ);
        const user = userSnapshot.docs[0].data() as UserDetail;
        return user;
    };

    async function getPaticipateEvents(userId: string): Promise<ParticipateEvent[]> {
        const userEventsRef = collection(db, 'userEvents');
        const userEventsQ = query(userEventsRef, where('userId', '==', userId), where('participationStatus', '==', 1));
        const userEventsSnapshot = await getDocs(userEventsQ);
        const participantEvents = await Promise.all(
            userEventsSnapshot.docs.map(async (doc) => {
                const eventId = doc.data().eventId;
                const eventRef = collection(db, 'events');
                const eventQ = query(eventRef, where(documentId(), '==', eventId));
                const eventSnapshot = await getDocs(eventQ);
                const event = eventSnapshot.docs[0].data();
                const participantsNum = await getPaticipantsNum(eventId);
                return { eventId, ...event, participantsNum } as ParticipateEvent;
            })
        );
        return participantEvents;
    }

    async function getPaticipantsNum(eventId: string): Promise<number> {
        const userEventsRef = collection(db, 'userEvents');
        const userEventsQ = query(userEventsRef, where('eventId', '==', eventId), where('participationStatus', '==', 1));
        const userEventsSnapshot = await getDocs(userEventsQ);
        const participantsNum = userEventsSnapshot.size;
        return participantsNum;
    }

    useEffect(() => {
        getUserDetail(userId as string)
            .then((user) => {
                setUser(user);
            })
            .catch((error) => {
                console.error(error);
            });
        
        getPaticipateEvents(userId as string)
            .then((participateEvents) => {
                setParticipateEvents(participateEvents);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [userId]);

    return (
        <Box mt={4} mx={5} px={isSmallerThan480? 0 : 5}>
            <Card mb={3}>
                <CardHeader>
                    <Flex alignItems="center">
                        <Avatar
                            name={user?.name}
                            bg="gray.100"
                            color="black"
                            size="lg"
                            mr={3}
                        />
                        <Heading size="lg">{user?.name}</Heading>
                        <Text ml={3} fontSize="sm" color="gray.500">{user?.age}歳</Text>
                        <Text ml={3} fontSize="sm" color="gray.500">{user?.gender === 1 ? '男性' : user?.gender === 2 ? '女性' : 'その他'}</Text>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Table variant="simple">
                        <Tbody>
                            <Tr>
                                <Td width={isSmallerThan480 ? '30%' : '20%'} px={0} fontWeight={'bold'}>興味</Td>
                                <Td width={isSmallerThan480 ? '70%' : '80%'} px={0}>{user?.interests}</Td>
                            </Tr>
                            <Tr>
                                <Td width={isSmallerThan480 ? '30%' : '20%'} px={0} fontWeight={'bold'}>趣味</Td>
                                <Td width={isSmallerThan480 ? '70%' : '80%'} px={0}>{user?.hobbies}</Td>
                            </Tr>
                            <Tr>
                                <Td width={isSmallerThan480 ? '30%' : '20%'} px={0} fontWeight={'bold'}>自己紹介</Td>
                                <Td width={isSmallerThan480 ? '70%' : '80%'} px={0}>{user?.selfIntroduction}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Heading size="md">参加イベント({participateEvents.length} 件)</Heading>
                    <Box pt={2} px={2}>
                        {
                            participateEvents.length !== 0 ? (
                                participateEvents.map((participateEvent: EventListItem) => {
                                    return (
                                        <EventListItem key={participateEvent.eventId} event={participateEvent} />
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
                </CardBody>
            </Card>
        </Box>
    );
};