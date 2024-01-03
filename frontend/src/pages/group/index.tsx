import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig'; // あなたのFirebase設定ファイルへのパス
import {
    Heading,
    Card,
    CardHeader,
    Flex
} from '@chakra-ui/react';
import NextLink from 'next/link';

interface Group {
    id: string;
    name: string;
}

function GroupList() {
    const [groups, setGroups] = useState<Group[]>([]);
    const fetchGroups = async () => {
        const groupsCollection = collection(db, 'groups');
        const groupsSnapshot = await getDocs(groupsCollection);
        const groupLists = groupsSnapshot.docs.map((doc) => {
            return { ...(doc.data() as Group) };
        });
        setGroups(groupLists);
    };
    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <Flex flexDir="column" m={4}>
            <Heading size="lg">所属グループ</Heading>
            {groups.map((group) => (
                <Card key={group.id} mt={4} _hover={{ bg: 'gray.100' }} as={NextLink} href='/group/1'>
                    <CardHeader>
                        <Heading size="md">{group.name}</Heading>
                    </CardHeader>
                </Card>
            ))}
        </Flex>
    );
}

export default GroupList;
