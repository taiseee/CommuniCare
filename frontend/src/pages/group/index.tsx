import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig'; // あなたのFirebase設定ファイルへのパス
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Card,
    CardHeader,
    CardBody,
    SkeletonText,
    Skeleton,
    Flex,
    Divider,
    Button,
    ButtonGroup,
    Tag
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

function GroupDetail() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [gridRowHeight, setGridRowHeight] = useState<number>(3);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const newProfiles: Profile[] = [];
                querySnapshot.forEach((doc) => {
                    newProfiles.push({
                        ...(doc.data() as Profile)
                    });
                });
                setProfiles(newProfiles);
                setGridRowHeight(Math.max(newProfiles.length, 3));
            } catch (error) {
                console.error('Error fetching profiles: ', error);
            }
        };

        fetchProfiles();
    }, []);

    // プロフィールがロード中の場合の表示
    const loadingCards = () => (
        <Grid
            templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(6, 1fr)'
            }}
            templateRows={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)'
            }}
            gap={4}
        >
            <GridItem bg="white" rowSpan={3} colSpan={2}>
                <Flex flexDirection="column">
                    <Heading p={4} size="md">
                        おすすめの活動
                    </Heading>
                    <Divider />
                    {[...Array(3)].map((_, index) => (
                        <Box key={index}>
                            <Flex flexDirection="column" p={4}>
                                <Flex justify="space-between">
                                    <Skeleton>
                                        <Heading size="md">
                                            11月のゴミ拾い
                                        </Heading>
                                    </Skeleton>
                                    <Skeleton>
                                        <Tag>ボランティア</Tag>
                                    </Skeleton>
                                </Flex>
                                <SkeletonText
                                    mt="4"
                                    noOfLines={1}
                                    spacing="4"
                                    skeletonHeight="10px"
                                />
                                <SkeletonText
                                    mt="4"
                                    noOfLines={1}
                                    spacing="4"
                                    skeletonHeight="10px"
                                />
                                <SkeletonText
                                    mt="4"
                                    noOfLines={3}
                                    spacing="4"
                                    skeletonHeight="10px"
                                />
                                <SkeletonText
                                    mt="4"
                                    noOfLines={1}
                                    spacing="4"
                                    skeletonHeight="10px"
                                />
                                <ButtonGroup gap="1" pt={2}>
                                    <Skeleton>
                                        <Button size="sm" colorScheme="gray">
                                            参加しない
                                        </Button>
                                    </Skeleton>
                                    <Skeleton>
                                        <Button size="sm" colorScheme="teal">
                                            参加する
                                        </Button>
                                    </Skeleton>
                                </ButtonGroup>
                            </Flex>
                            <Divider />
                        </Box>
                    ))}
                </Flex>
            </GridItem>
            {[...Array(4)].map((_, index) => (
                <GridItem key={index} rowSpan={1} colSpan={2}>
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
        </Grid>
    );

    return (
        <>
            <Box p={4} bg="gray.200">
                {profiles.length === 0 ? (
                    loadingCards()
                ) : (
                    <Grid
                        templateColumns={{
                            base: 'repeat(1, 1fr)',
                            md: 'repeat(6, 1fr)'
                        }}
                        templateRows={{
                            base: 'repeat(1, 1fr)',
                            md: `repeat(${gridRowHeight}, 1fr)`
                        }}
                        gap={4}
                    >
                        <GridItem
                            bg="white"
                            borderRadius="lg"
                            borderWidth="1px"
                            rowSpan={gridRowHeight}
                            colSpan={2}
                        >
                            <Flex flexDirection="column">
                                <Heading p={4} size="md">
                                    おすすめの活動
                                </Heading>
                                <Divider />
                                {[...Array(3)].map((_, index) => (
                                    <Box key={index}>
                                        <Flex flexDirection="column" p={4}>
                                            <Flex justify="space-between">
                                                <Heading size="md">
                                                    11月のゴミ拾い
                                                </Heading>
                                                <Tag>ボランティア</Tag>
                                            </Flex>
                                            <Text fontSize="sm">
                                                日時: 11月1日 10:00~13:00
                                            </Text>
                                            <Text fontSize="sm">
                                                場所: 東京都渋谷区
                                            </Text>
                                            <Text fontSize="sm" noOfLines={4}>
                                                内容: <br />
                                                持ちもの：軍手
                                                <br />
                                                集合は〇〇公園ビーチの〇〇駅側から入った所です。
                                                <br />
                                                人数が揃っていなくても10時から始めます。遅れる場合ははやめのご連絡をお願いします。
                                                <br />
                                                人数とごみの量により終わりの時間が変わることがありますが、一時間半を目安にしています。
                                            </Text>
                                            <Text fontSize="sm">
                                                連絡先: 090-1234-5678
                                            </Text>
                                            <ButtonGroup gap="1" pt={2}>
                                                <Button
                                                    size="sm"
                                                    colorScheme="gray"
                                                >
                                                    参加しない
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    colorScheme="teal"
                                                >
                                                    参加する
                                                </Button>
                                            </ButtonGroup>
                                        </Flex>
                                        <Divider />
                                    </Box>
                                ))}
                            </Flex>
                        </GridItem>
                        {profiles.map((profile) => (
                            <GridItem key={profile.id} rowSpan={1} colSpan={2}>
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
                    </Grid>
                )}
            </Box>
        </>
    );
}

export default GroupDetail;
