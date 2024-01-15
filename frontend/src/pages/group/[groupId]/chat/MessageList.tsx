import { Flex, Text, Button, Box } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useRef } from 'react';
import ChatService, { Message } from './ChatService';

type Props = {
    messages: Message[];
};

export function MessageList({messages}: Props): JSX.Element {
    const chatService = new ChatService();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    const deleteMessage = async (messageId: string) => {
        await chatService.deleteMessage(messageId);
    };
    return (
            <>
                {messages.map((msg, index) => (
                    <Flex
                        key={index}
                        bg="blue.100"
                        p={3}
                        borderRadius="md"
                        align="center"
                    >
                        <Text flex="1">{msg.text}</Text>
                        <Button size="sm" onClick={() => deleteMessage(msg.id)}>
                            <DeleteIcon />
                        </Button>
                    </Flex>
                ))}
                <Box ref={messagesEndRef} />
            </>
    );
}
