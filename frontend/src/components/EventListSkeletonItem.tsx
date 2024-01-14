import { Box, Divider, SkeletonText } from '@chakra-ui/react';

export default function EventListSkeletonItem() {
    return (
        <Box>
            <SkeletonText my={4} noOfLines={3} spacing={2} skeletonHeight={3} />
            <Divider borderColor={'grey'} />
        </Box>
    );
}