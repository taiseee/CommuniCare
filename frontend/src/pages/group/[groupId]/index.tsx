import React from 'react';
import { Box, Grid } from '@chakra-ui/react';
import MemberContainer from './MemberContainer';
import EventContainer from './EventContainer';

function GroupDetail() {
    return (
        <>
            <Box p={4} bg="gray.200">
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
        </>
    );
}

export default GroupDetail;
