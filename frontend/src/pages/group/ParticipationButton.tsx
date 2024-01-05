import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { getAuth } from 'firebase/auth';
import {
    Box,
    Flex,
    Button,
    ButtonGroup,
    Tag,
    TagLabel,
    TagCloseButton
} from '@chakra-ui/react';

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

    async function handleParticipationButtonClick(participationStatus: number) {
        try {
            const userEventsRef = collection(db, 'userEvents');
            await addDoc(userEventsRef, {
                userId: uid,
                eventId: eventId,
                participationStatus: participationStatus
            });
            setStatuses(participationStatus);
        } catch (error) {
            console.error('Error saving participation status: ', error);
        }
    }

    async function handleCancelButtonClick() {
        // データベースからuserEventを削除
        try {
            const userEventsRef = collection(db, 'userEvents');
            const userEventsQ = query(
                userEventsRef,
                where('userId', '==', uid),
                where('eventId', '==', eventId)
            );
            const userEventsSnapshot = await getDocs(userEventsQ);
            userEventsSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            setStatuses(2);
        } catch (error) {
            console.error('Error deleting user event: ', error);
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
                        <TagCloseButton
                            onClick={() => handleCancelButtonClick()}
                        />
                    </Tag>
                </Box>
            ) : status === 1 ? (
                <Box mt={2}>
                    <Tag borderRadius="full" colorScheme="teal">
                        <TagLabel>参加</TagLabel>
                        <TagCloseButton
                            onClick={() => handleCancelButtonClick()}
                        />
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
                        <Button
                            size="sm"
                            colorScheme="gray"
                            onClick={() => handleParticipationButtonClick(0)}
                        >
                            参加しない
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="teal"
                            onClick={() => handleParticipationButtonClick(1)}
                        >
                            参加する
                        </Button>
                    </ButtonGroup>
                </Flex>
            )}
        </>
    );
}

export default ParticipationButton;