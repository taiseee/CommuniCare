import React, { useState, useEffect } from 'react';
import { Box, Flex, Input, Button, VStack } from '@chakra-ui/react';
import ChatService, { Message, Profile } from './ChatService';
import MessageList from './MessageList';

function ChatScreen(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [members, setMembers] = useState<Profile[]>([]);
    const chatService = new ChatService();

    useEffect(() => {
        const fetchMembers = async () => {
            await chatService.fetchMembers(setMembers);
            console.log(chatService.members);
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        if (members.length === 0) return;
        console.log(chatService.members);
        const unsubscribe = chatService.createListener(setMessages, members);
        return () => unsubscribe();
    }, [members]);

    const handleAddMessage = async () => {
        await chatService.addMessage(message, null);
        setMessage('');
    };

    return (
        <Box p={5}>
            <Flex direction="column" h="80vh">
                <VStack
                    flex="1"
                    overflowY="auto"
                    spacing={4}
                    align="stretch"
                    p={3}
                    borderRadius="lg"
                >
                    <MessageList messages={messages} />
                </VStack>
                <Flex mt={4}>
                    <Input
                        placeholder="メッセージを入力..."
                        focusBorderColor="teal.500"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === 'Enter' && handleAddMessage()
                        }
                    />
                    <Button
                        colorScheme="teal"
                        ml={2}
                        onClick={handleAddMessage}
                    >
                        送信
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}

export default ChatScreen;
