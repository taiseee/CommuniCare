import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    documentId
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig'; // あなたのFirebase設定ファイルへのパス
import { getAuth } from 'firebase/auth';
import { Heading, Card, CardHeader, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';

interface Group {
    id: string;
    name: string;
}

function GroupList() {
    const [groups, setGroups] = useState<Group[]>([]);
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    async function fetchGroups() {
        // ユーザーが所属するグループのidを取得
        const userGroupsRef = collection(db, 'userGroups');
        const userGroupsQ = query(userGroupsRef, where('userId', '==', uid));
        const userGroupsSnapshot = await getDocs(userGroupsQ);
        const groupIds = userGroupsSnapshot.docs.map(
            (doc) => doc.data().groupId
        );

        // 所属グループがない場合はここで終了
        if (groupIds.length === 0) {
            return;
        }

        // クエリのin句に渡せるようにidを30個ずつに分割
        const chunkSize: number = 30;
        const groupIdChunks: string[][] = [];
        for (let i = 0; i < groupIds.length; i += chunkSize) {
            groupIdChunks.push(groupIds.slice(i, i + chunkSize));
        };

        // グループのデータを取得
        const groupsRef = collection(db, 'groups');
        const groupsSnapshots = await Promise.all(
            groupIdChunks.map((groupIds) => {
                const groupsQ = query(groupsRef, where(documentId(), 'in', groupIds));
                return getDocs(groupsQ);
            })
        );
        const groupLists = groupsSnapshots.flatMap(snapshot => {
            return snapshot.docs.map((doc) => {
                return { ...(doc.data() as Group), id: doc.id };
            });
        });
        setGroups(groupLists);
    }
    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <Flex flexDir="column" m={4}>
            <Heading size="lg">所属グループ</Heading>
            {groups.map((group) => (
                <Card
                    key={group.id}
                    mt={4}
                    _hover={{ bg: 'gray.100' }}
                    as={NextLink}
                    href={`/group/${group.id}`}
                >
                    <CardHeader>
                        <Heading size="md">{group.name}</Heading>
                    </CardHeader>
                </Card>
            ))}
        </Flex>
    );
}

export default GroupList;
