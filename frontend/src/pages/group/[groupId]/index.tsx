import React from 'react';
import { Box, Grid, IconButton} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import EventHaeder from './EventHeader';
import MemberContainer from './MemberContainer';
import EventContainer from './EventContainer';

function GroupDetail() {
   const params = useParams();
   const chatPath = `/group/${params.groupId}/chat`;
    return (
        <>
            <Box p={4} bg="gray.200">
                <EventHaeder />
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(3, 1fr)'
                    }}
                    templateRows={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(1, 1fr)'
                    }}
                    gap={4}
                >
                    <EventContainer />
                    <MemberContainer />
                </Grid>
            </Box>
            <NextLink href={chatPath} >
                <IconButton
                    icon={<ChatIcon />}
                    aria-label="チャット"
                    isRound
                    position="fixed"
                    bottom={4}
                    right={4}
                    px='6'
                    h='16'
                    boxShadow="lg"
                />
            </NextLink>
        </>
    );
}

export default GroupDetail;
