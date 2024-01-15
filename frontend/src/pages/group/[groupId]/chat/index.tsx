import React, { useState, useEffect } from 'react';
import { Box, Flex, Input, Button, VStack } from '@chakra-ui/react';
import ChatService, { Message } from './ChatService';
import { DocumentData } from '@firebase/firestore-types';
import { MessageList } from './MessageList';

function ChatScreen(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    // const [observeFrom, setObserveFrom] = useState<DocumentData | null>(null);
    const chatService = new ChatService();

    // useEffect(() => {
    //     chatService.init(setObserveFrom);
    // }, []);

    useEffect(() => {
        // if (!observeFrom) return;
        const unsubscribe = chatService.createListener(setMessages);
        return () => unsubscribe();
    }, []);

    const handleAddMessage = async () => {
        await chatService.addMessage(message, null);
        setMessage('');
    };

    return (
        <Box p={5}>
            <Flex direction="column" h="500px">
                <VStack
                    flex="1"
                    overflowY="auto"
                    spacing={4}
                    align="stretch"
                    p={3}
                    bg="gray.100"
                    borderRadius="lg"
                >
                    <MessageList messages={messages} />
                </VStack>
                <Flex mt={4}>
                    <Input
                        placeholder="メッセージを入力..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
                    />
                    <Button colorScheme="blue" ml={2} onClick={handleAddMessage}>
                        送信
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}

export default ChatScreen;
