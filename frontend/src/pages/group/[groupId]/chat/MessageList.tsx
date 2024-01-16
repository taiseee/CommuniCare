import { Flex, Text, Box, Avatar } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import ChatService, { Message } from './ChatService';
import { auth } from '@/lib/firebaseConfig';

type Props = {
    messages: Message[];
};

type ItemProps = {
    message: Message;
};

export function MessageList({ messages }: Props): JSX.Element {
    const chatService = new ChatService();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    return (
        <>
            {messages.map((msg, index) => (
                <MessageItem key={index} message={msg} />
            ))}
            <Box ref={messagesEndRef} />
        </>
    );
}

function MessageItem({ message }: ItemProps): JSX.Element {
    if (message.profile?.id === auth.currentUser?.uid) {
        return (
                <Flex justify="flex-end">
                    <Flex w="40vw" flexDir="column" align="end">
                        <Text fontSize="xs" mr={2}>
                            {message.profile?.name}
                        </Text>
                        <Box bg="teal.100" p={3} borderRadius="md"><Text flex="1">{message.text}</Text></Box>
                    </Flex>
                    <Avatar size="sm" ml={2} />
                </Flex>
        );
    } else {
        return (
                <Flex justify="flex-start">
                    <Avatar size="sm" mr={2} />
                    <Flex w="40vw" flexDir="column" align="start">
                        <Text fontSize="xs" mr={2}>
                            {message.profile?.name}
                        </Text>
                        <Box bg="gray.100" p={3} borderRadius="md"><Text flex="1">{message.text}</Text></Box>
                    </Flex>
                </Flex>
        );
    }
}
