import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    documentId
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    Box,
    GridItem,
    Heading,
    Text,
    SkeletonText,
    Skeleton,
    Flex,
    Divider,
    Button,
    ButtonGroup,
    Tag,
    TagLabel,
    TagCloseButton,
    Avatar,
    AvatarGroup
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
interface ParticipationButtonProps {
    eventId: string;
}
function ParticipationButton({ eventId }: ParticipationButtonProps) {
    const [status, setStatuses] = useState<number>(2);
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    async function fetchStatus() {
        try {
            // ユーザーのイベント参加状況を取得
            const userEventsRef = collection(db, 'userEvents');
            const userEventsQ = query(
                userEventsRef,
                where('userId', '==', uid),
                where('eventId', '==', eventId)
            );
            const userEventsSnapshot = await getDocs(userEventsQ);
            userEventsSnapshot.forEach((doc) => {
                setStatuses(doc.data().participationStatus);
            });
        } catch (error) {
            console.error('Error fetching profiles: ', error);
        }
    }
    useEffect(() => {
        fetchStatus();
    }, []);
    return (
        <>
            {status === 0 ? (
                <Box mt={2}>
                    <Tag borderRadius="full" colorScheme="red">
                        <TagLabel>不参加</TagLabel>
                        <TagCloseButton />
                    </Tag>
                </Box>
            ) : status === 1 ? (
                <Box mt={2}>
                    <Tag borderRadius="full" colorScheme="teal">
                        <TagLabel>参加</TagLabel>
                        <TagCloseButton />
                    </Tag>
                </Box>
            ) : (
                <Flex flexDirection="column">
                    <Box mt={2}>
                        <Tag borderRadius="full">
                            <TagLabel>未定</TagLabel>
                        </Tag>
                    </Box>
                    <ButtonGroup gap="1" mt={2}>
                        <Button size="sm" colorScheme="gray">
                            参加しない
                        </Button>
                        <Button size="sm" colorScheme="teal">
                            参加する
                        </Button>
                    </ButtonGroup>
                </Flex>
            )}
        </>
    );
}

function ParticipantList() {
    return (
        <>
            <AvatarGroup size="sm" max={4} mt={2}>
                <Avatar
                    name="Ryan Florence"
                    src="https://bit.ly/ryan-florence"
                    bg="gray.100"
                    color="black"
                />
                <Avatar
                    name="Segun Adebayo"
                    src="https://bit.ly/sage-adebayo"
                />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar
                    name="Prosper Otemuyiwa"
                    src="https://bit.ly/prosper-baba"
                />
                <Avatar
                    name="Christian Nwamba"
                    src="https://bit.ly/code-beast"
                />
            </AvatarGroup>
        </>
    );
}

interface Event {
    id: string;
    title: string;
    category: string;
    dateTime: string;
    location: string;
    description: string;
    contact: string;
}

function EventContainer() {
    const [events, setEvents] = useState<Event[]>([]);
    const params = useParams();

    const fetchEvents = async () => {
        try {
            // グループに推薦されたイベントのidを取得
            const groupEventsRef = collection(db, 'groupEvents');
            const groupEventsQ = query(
                groupEventsRef,
                where('groupId', '==', params.groupId)
            );
            const groupEventsSnapshot = await getDocs(groupEventsQ);
            const eventIds = groupEventsSnapshot.docs.map(
                (doc) => doc.data().eventId
            );

            // イベントのデータを取得
            const eventsRef = collection(db, 'events');
            const eventsQ = query(
                eventsRef,
                where(documentId(), 'in', eventIds)
            );
            const eventsSnapshot = await getDocs(eventsQ);
            const newEvents: Event[] = [];
            eventsSnapshot.forEach((doc) => {
                newEvents.push({
                    ...(doc.data() as Event),
                    id: doc.id
                });
            });
            setEvents(newEvents);
        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // 4. 取得したデータを表示する
    return (
        <GridItem
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            rowSpan={1}
            colSpan={1}
        >
            <Flex flexDirection="column">
                <Heading p={4} size="md">
                    おすすめの活動
                </Heading>
                <Divider />
                {events.length === 0 ? (
                    <>
                        {[...Array(3)].map((_, index) => (
                            <Box key={index}>
                                <Flex flexDirection="column" p={4}>
                                    <Flex justify="space-between">
                                        <Skeleton>
                                            <Heading size="md">
                                                11月のゴミ拾い
                                            </Heading>
                                        </Skeleton>
                                        <Skeleton>
                                            <Tag>ボランティア</Tag>
                                        </Skeleton>
                                    </Flex>
                                    <SkeletonText
                                        mt="4"
                                        noOfLines={1}
                                        spacing="4"
                                        skeletonHeight="10px"
                                    />
                                    <SkeletonText
                                        mt="4"
                                        noOfLines={1}
                                        spacing="4"
                                        skeletonHeight="10px"
                                    />
                                    <SkeletonText
                                        mt="4"
                                        noOfLines={3}
                                        spacing="4"
                                        skeletonHeight="10px"
                                    />
                                    <SkeletonText
                                        mt="4"
                                        noOfLines={1}
                                        spacing="4"
                                        skeletonHeight="10px"
                                    />
                                    <Skeleton>
                                        <Tag
                                            borderRadius="full"
                                            colorScheme="teal"
                                        >
                                            <TagLabel>参加</TagLabel>
                                            <TagCloseButton />
                                        </Tag>
                                    </Skeleton>
                                </Flex>
                                <Divider />
                            </Box>
                        ))}
                    </>
                ) : (
                    <>
                        {events.map((event) => (
                            <Box key={event.id}>
                                <Flex flexDirection="column" p={4}>
                                    <Flex justify="space-between">
                                        <Heading size="md">
                                            {event.title}
                                        </Heading>
                                        <Tag>{event.category}</Tag>
                                    </Flex>
                                    <Text fontSize="sm">
                                        日時: {event.dateTime}
                                    </Text>
                                    <Text fontSize="sm">
                                        場所: {event.location}
                                    </Text>
                                    <Text fontSize="sm">
                                        詳細: <br />
                                        {event.description}
                                    </Text>
                                    <Text fontSize="sm">
                                        連絡先: {event.contact}
                                    </Text>
                                    <ParticipantList />
                                    <ParticipationButton eventId={event.id} />
                                </Flex>
                                <Divider />
                            </Box>
                        ))}
                    </>
                )}
            </Flex>
        </GridItem>
    );
}

export default EventContainer;
