import { useRouter } from 'next/router';
import {
    Box,
    Text,
} from '@chakra-ui/react';

export default function UserDetail() {
    const router = useRouter();
    const { userId } = router.query;

    return (
        <Box>
            <Text>ユーザー詳細ページ</Text>
            <Text>ユーザーID: {userId}</Text>
        </Box>
    );
};