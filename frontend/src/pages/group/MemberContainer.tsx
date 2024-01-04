import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    collection,
    getDocs,
    query,
    where,
    documentId
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig'; // あなたのFirebase設定ファイルへのパス
import {
    Grid,
    GridItem,
    Heading,
    Text,
    Card,
    CardHeader,
    CardBody,
    SkeletonText,
    Skeleton
} from '@chakra-ui/react';

// プロフィールの型定義
interface Profile {
    id: string;
    name: string;
    age: number;
    gender: number;
    interests: string;
    hobbies: string;
    selfIntroduction: string;
}

function MemberContainer() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const params = useParams();
    async function fetchProfiles() {
        try {
            // グループに所属するユーザーのidを取得
            const userGroupsRef = collection(db, 'userGroups');
            const userGroupsQ = query(
                userGroupsRef,
                where('groupId', '==', params.groupId)
            );
            const userGroupsSnapshot = await getDocs(userGroupsQ);
            const userIds = userGroupsSnapshot.docs.map(
                (doc) => doc.data().userId
            );

            // ユーザーのプロフィールを取得
            const usersRef = collection(db, 'users');
            const usersQ = query(usersRef, where(documentId(), 'in', userIds));
            const usersSnapshot = await getDocs(usersQ);
            const newProfiles: Profile[] = [];
            usersSnapshot.forEach((doc) => {
                newProfiles.push({
                    ...(doc.data() as Profile),
                    id: doc.id
                });
            });
            setProfiles(newProfiles);
        } catch (error) {
            console.error('Error fetching profiles: ', error);
        }
    };
    useEffect(() => {
        fetchProfiles();
    }, []);
    return (
        <GridItem rowSpan={1} colSpan={{ base: 1, md: 2 }}>
            <Heading size="md" p={4} bg="white" mb={4} borderRadius="md">
                メンバー
            </Heading>
            <Grid
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)'
                }}
                gap={4}
            >
                {profiles.length === 0 ? (
                    <>
                        {[...Array(4)].map((_, index) => (
                            <GridItem key={index} rowSpan={1} colSpan={1}>
                                <Card>
                                    <CardHeader>
                                        <Skeleton height="20px" />
                                    </CardHeader>
                                    <CardBody>
                                        <SkeletonText
                                            mt="4"
                                            noOfLines={4}
                                            spacing="4"
                                            skeletonHeight="2"
                                        />
                                    </CardBody>
                                </Card>
                            </GridItem>
                        ))}
                    </>
                ) : (
                    <>
                        {profiles.map((profile) => (
                            <GridItem key={profile.id} rowSpan={1} colSpan={1}>
                                <Card>
                                    <CardHeader>
                                        <Heading size="md">
                                            {profile.name}
                                        </Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Text fontSize="sm">
                                            年齢: {profile.age}歳
                                        </Text>
                                        <Text fontSize="sm">
                                            性別:{' '}
                                            {profile.gender === 1
                                                ? '男性'
                                                : profile.gender === 2
                                                  ? '女性'
                                                  : '登録なし'}
                                        </Text>
                                        <Text fontSize="sm">
                                            興味のあること: {profile.interests}
                                        </Text>
                                        <Text fontSize="sm">
                                            趣味: {profile.hobbies}
                                        </Text>
                                        <Text fontSize="sm" noOfLines={2}>
                                            自己紹介:
                                            {profile.selfIntroduction}
                                        </Text>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        ))}
                    </>
                )}
            </Grid>
        </GridItem>
    );
}

export default MemberContainer;
