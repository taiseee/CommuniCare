import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    documentId
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import {
    Box,
    GridItem,
    Heading,
    Text,
    SkeletonText,
    Skeleton,
    Flex,
    Divider,
    Tag,
    TagLabel,
    TagCloseButton
} from '@chakra-ui/react';
import ParticipationButton from './ParticipationButton';
import ParticipantList from './ParticipantList';
import { useParams } from 'next/navigation';

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

    async function fetchEvents() {
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

            // イベントがない場合はここで終了
            if (eventIds.length === 0) {
                return;
            }

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
    }

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
                                        <Tag>{event.category ? 'ボランティア': '地域活動'}</Tag>
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
                                    <ParticipantList eventId={event.id} />
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
