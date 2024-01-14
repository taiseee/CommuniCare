import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import NextLink from 'next/link';
import {
    Box,
    Text,
    Heading,
    Grid,
    Flex,
    Avatar,
    Card,
    CardHeader,
    CardBody,
    Badge,
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
    const [isSmallerThan480] = useMediaQuery("(max-width: 480px)");
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
            <Grid templateColumns={isSmallerThan480 ? "1fr" : "3fr 1fr"} gap={6}>
                <Card>
                    <CardHeader>
                        <Box mb={2}>
                            {event?.category ?
                                <Badge variant='subtle' colorScheme='green'>ボランティア</Badge>
                                :
                                <Badge variant='subtle' colorScheme='blue'>地域活動</Badge>
                            }
                        </Box>
                        <Heading size='lg' mb={2}>{event?.title}</Heading>
                        <Text color='grey'>主催: {event?.host}</Text>
                    </CardHeader>
                    <CardBody>
                        <Table variant="simple">
                            <Tbody>
                                <Tr>
                                    <Td width={isSmallerThan480 ? '30%' : '20%'} px={0} fontWeight={'bold'}>開催場所</Td>
                                    <Td width={isSmallerThan480 ? '70%' : '80%'} px={0}>{event?.location}</Td>
                                </Tr>
                                <Tr>
                                    <Td width={isSmallerThan480 ? '30%' : '20%'} px={0} fontWeight={'bold'}>開催日時</Td>
                                    <Td width={isSmallerThan480 ? '70%' : '80%'} px={0}>{event?.dateTime}</Td>
                                </Tr>
                                <Tr>
                                    <Td width={isSmallerThan480 ? '30%' : '20%'} px={0} fontWeight={'bold'}>詳細</Td>
                                    <Td width={isSmallerThan480 ? '70%' : '80%'} px={0}>{event?.description}</Td>
                                </Tr>
                                <Tr>
                                    <Td width={isSmallerThan480 ? '30%' : '20%'} px={0} fontWeight={'bold'}>連絡先</Td>
                                    <Td width={isSmallerThan480 ? '70%' : '80%'} px={0}>{event?.contact}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </CardBody>
                </Card>
                <Box>
                    {/* 参加申し込み(個人)いるかな？ */}
                    <Card>
                        <CardHeader pb={0}>
                            <Heading size='md'>参加者({participants?.length} 人)</Heading>
                        </CardHeader>
                        <CardBody>
                            <Table variant="simple">
                                <Tbody>
                                    {participants?.map((participant) => {
                                        return (
                                            <Tr key={participant.userId}>
                                                <Td py={2} _hover={{ "& .underlineOnHover": { textDecoration: "underline" } }}>
                                                    <NextLink href={`/user/${participant.userId}`}>
                                                        <Flex alignItems='center'>
                                                            <Avatar
                                                                name={participant.name}
                                                                bg="gray.100"
                                                                color="black"
                                                                size="sm"
                                                                mr={2}
                                                            />
                                                            <Text className="underlineOnHover">{participant.name}</Text>
                                                        </Flex>
                                                    </NextLink>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Box>
            </Grid>
        </Box>
    );
}