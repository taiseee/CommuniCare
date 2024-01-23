import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    documentId,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import {
    Box,
    GridItem,
    Heading,
    SkeletonText,
    Skeleton,
    Flex,
    Divider,
    Tag,
    TagLabel,
    TagCloseButton,
    Badge,
    Spacer,
    Text
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { ParticipationContainer } from './ParticipationContainer';

export interface Event {
    id: string;
    title: string;
    category: string;
    dateTime: string;
    location: string;
    description: string;
    contact: string;
    host: string;
    updatedAt: Timestamp;
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

            // クエリのin句に渡せるようにidを30個ずつに分割
            const chunkSize: number = 30;
            const eventIdChunks: string[][] = [];
            for (let i = 0; i < eventIds.length; i += chunkSize) {
                eventIdChunks.push(eventIds.slice(i, i + chunkSize));
            };

            // イベントのデータを取得
            const eventsRef = collection(db, 'events');
            const eventsSnapshots = await Promise.all(
                eventIdChunks.map((eventIds) => {
                    const eventsQ = query(eventsRef, where(documentId(), 'in', eventIds));
                    return getDocs(eventsQ);
                })
            );

            const eventLists = eventsSnapshots.flatMap(snapshot => {
                return snapshot.docs.map((doc) => {
                    return { ...(doc.data() as Event), id: doc.id };
                });
            });

            setEvents(eventLists);
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
                                    <Flex py={1} as={NextLink} href={`/${event.id}`}>
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
                                    <Heading size="sm" as={NextLink} href={`/${event.id}`}>
                                        {event.title}
                                    </Heading>
                                    <ParticipationContainer event={event} />
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
