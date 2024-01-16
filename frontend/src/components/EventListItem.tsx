import NextLink from "next/link";
import { Box, Badge, Flex, Spacer, Text, Divider, useMediaQuery } from "@chakra-ui/react";
import { EventListItem } from "@/types";

export default function EventListItem({ event }: { event: EventListItem }) {
    const [isSmallerThan480] = useMediaQuery("(max-width: 480px)");
    return (
        <Box as={NextLink} href={`/${event.eventId}`} _hover={{ "& .underlineOnHover": { textDecoration: "underline" } }}>
            <Box pb={2}>
                <Flex py={1}>
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
                <Text fontSize='lg' fontWeight={'bold'} py={1} className="underlineOnHover">
                    {event.title}
                </Text>
                <Flex py={1} direction={isSmallerThan480 ? "column" : "row"}>
                    <Flex>
                        <Box pt={1} pe={1}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 12q.825 0 1.413-.587T14 10q0-.825-.587-1.412T12 8q-.825 0-1.412.588T10 10q0 .825.588 1.413T12 12m0 10q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2q3.175 0 5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22" />
                            </svg>
                        </Box>
                        <Text>
                            {event.location ? event.location : '不明'}
                        </Text>
                    </Flex>
                    <Spacer />
                    <Text>
                        参加人数：{event.participantsNum}人
                    </Text>
                </Flex>
            </Box>
            <Divider borderColor={'grey'} />
        </Box>
    );
}