import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter
} from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig'; // あなたのFirebase設定ファイルへのパス

function GroupDetail() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Firestoreの特定のコレクションからデータを取得します。
                const querySnapshot = await getDocs(collection(db, 'users'));
                const profiles = [];
                querySnapshot.forEach((doc) => {
                    profiles.push({ id: doc.id, ...doc.data() });
                });
                // 複数のプロフィールのうち、最初のものをセットします。
                setProfile(profiles[0]);
            } catch (error) {
                console.error('Error fetching profile: ', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <Text>Loading...</Text>; // データがまだない場合はローディングを表示
    }

    return (
        <>
            <Box p={4} bg="gray.200">
                <Heading pb={4} size="md">
                    山田太郎,山田太郎,山田太郎,山田太郎
                </Heading>
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)'
                    }}
                    gap={4}
                >
                    <Card>
                        <CardHeader>
                            <Heading size="md">{profile.name}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text fontSize="sm">年齢: {profile.age}歳</Text>
                            <Text fontSize="sm">性別: {profile.gender}</Text>
                            <Text fontSize="sm">
                                興味のあること: {profile.interests}
                            </Text>
                            <Text fontSize="sm">趣味: {profile.hobbies}</Text>
                            <Text fontSize="sm">
                                自己紹介:
                                {profile.selfIntroduction}
                            </Text>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Heading size="md">山田太郎</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text fontSize="sm">年齢: 25歳</Text>
                            <Text fontSize="sm">性別: 男性</Text>
                            <Text fontSize="sm">
                                興味のあること: プログラミング、旅行
                            </Text>
                            <Text fontSize="sm">趣味: ギター、読書</Text>
                            <Text fontSize="sm">
                                自己紹介:
                                ソフトウェア開発者で、新しい技術を学ぶのが好きです。休みの日は読書や音楽を楽しんでいます。
                            </Text>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Heading size="md">山田太郎</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text fontSize="sm">年齢: 25歳</Text>
                            <Text fontSize="sm">性別: 男性</Text>
                            <Text fontSize="sm">
                                興味のあること: プログラミング、旅行
                            </Text>
                            <Text fontSize="sm">趣味: ギター、読書</Text>
                            <Text fontSize="sm">
                                自己紹介:
                                ソフトウェア開発者で、新しい技術を学ぶのが好きです。休みの日は読書や音楽を楽しんでいます。
                            </Text>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Heading size="md">山田太郎</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text fontSize="sm">年齢: 25歳</Text>
                            <Text fontSize="sm">性別: 男性</Text>
                            <Text fontSize="sm">
                                興味のあること: プログラミング、旅行
                            </Text>
                            <Text fontSize="sm">趣味: ギター、読書</Text>
                            <Text fontSize="sm">
                                自己紹介:
                                ソフトウェア開発者で、新しい技術を学ぶのが好きです。休みの日は読書や音楽を楽しんでいます。
                            </Text>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Heading size="md">山田太郎</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text fontSize="sm">年齢: 25歳</Text>
                            <Text fontSize="sm">性別: 男性</Text>
                            <Text fontSize="sm">
                                興味のあること: プログラミング、旅行
                            </Text>
                            <Text fontSize="sm">趣味: ギター、読書</Text>
                            <Text fontSize="sm">
                                自己紹介:
                                ソフトウェア開発者で、新しい技術を学ぶのが好きです。休みの日は読書や音楽を楽しんでいます。
                            </Text>
                        </CardBody>
                    </Card>
                </Grid>
            </Box>
        </>
    );
}

export default GroupDetail;
