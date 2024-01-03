import React from 'react';
import {
    Box,
    GridItem,
    Heading,
    Text,
    SkeletonText,
    Skeleton,
    Flex,
    Divider,
    Button,
    ButtonGroup,
    Tag,
    TagLabel,
    TagCloseButton,
    Avatar,
    AvatarGroup
} from '@chakra-ui/react';

type ParticipationButtonProps = {
    status: number;
};

{/* <GridItem bg="white" rowSpan={3} colSpan={2}>
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
                            <Heading size="md">11月のゴミ拾い</Heading>
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
</GridItem>; */}

function ParticipationButton({ status }: ParticipationButtonProps) {
    return (
        <>
            {status === 0 ? (
                <Box mt={2}>
                    <Tag borderRadius="full" colorScheme="red">
                        <TagLabel>不参加</TagLabel>
                        <TagCloseButton />
                    </Tag>
                </Box>
            ) : status === 1 ? (
                <Box mt={2}>
                    <Tag borderRadius="full" colorScheme="teal">
                        <TagLabel>参加</TagLabel>
                        <TagCloseButton />
                    </Tag>
                </Box>
            ) : (
                <Flex flexDirection="column">
                    <Box mt={2}>
                        <Tag borderRadius="full">
                            <TagLabel>未定</TagLabel>
                            <TagCloseButton />
                        </Tag>
                    </Box>
                    <ButtonGroup gap="1" mt={2}>
                        <Button size="sm" colorScheme="gray">
                            参加しない
                        </Button>
                        <Button size="sm" colorScheme="teal">
                            参加する
                        </Button>
                    </ButtonGroup>
                </Flex>
            )}
        </>
    );
}

function ParticipantList() {
    return (
        <>
            <AvatarGroup size="sm" max={4} mt={2}>
                <Avatar
                    name="Ryan Florence"
                    src="https://bit.ly/ryan-florence"
                    bg="gray.100"
                    color="black"
                />
                <Avatar
                    name="Segun Adebayo"
                    src="https://bit.ly/sage-adebayo"
                />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar
                    name="Prosper Otemuyiwa"
                    src="https://bit.ly/prosper-baba"
                />
                <Avatar
                    name="Christian Nwamba"
                    src="https://bit.ly/code-beast"
                />
            </AvatarGroup>
        </>
    );
}

function EventContainer() {
    return (
        <GridItem
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            rowSpan={1}
            colSpan={1}
        >
            <Flex flexDirection="column">
                <Heading p={4} size="md">
                    おすすめの活動
                </Heading>
                <Divider />
                <Box>
                    <Flex flexDirection="column" p={4}>
                        <Flex justify="space-between">
                            <Heading size="md">10月のゴミ拾い</Heading>
                            <Tag>ボランティア</Tag>
                        </Flex>
                        <Text fontSize="sm">日時: 11月1日 10:00~13:00</Text>
                        <Text fontSize="sm">場所: 東京都渋谷区</Text>
                        <Text fontSize="sm">
                            詳細:
                            <br />
                            持ちもの：軍手
                            <br />
                            集合は〇〇公園ビーチの〇〇駅側から入った所です。
                            <br />
                            人数が揃っていなくても10時から始めます。遅れる場合ははやめのご連絡をお願いします。
                            <br />
                            人数とごみの量により終わりの時間が変わることがありますが、一時間半を目安にしています。
                        </Text>
                        <Text fontSize="sm">連絡先: 090-1234-5678</Text>
                        <ParticipantList />
                        <ParticipationButton status={1} />
                    </Flex>
                    <Divider />
                </Box>
                {[...Array(2)].map((_, index) => (
                    <Box key={index}>
                        <Flex flexDirection="column" p={4}>
                            <Flex justify="space-between">
                                <Heading size="md">11月のゴミ拾い</Heading>
                                <Tag>ボランティア</Tag>
                            </Flex>
                            <Text fontSize="sm">日時: 11月1日 10:00~13:00</Text>
                            <Text fontSize="sm">場所: 東京都渋谷区</Text>
                            <Text fontSize="sm">
                                詳細: <br />
                                持ちもの：軍手
                                <br />
                                集合は〇〇公園ビーチの〇〇駅側から入った所です。
                                <br />
                                人数が揃っていなくても10時から始めます。遅れる場合ははやめのご連絡をお願いします。
                                <br />
                                人数とごみの量により終わりの時間が変わることがありますが、一時間半を目安にしています。
                            </Text>
                            <Text fontSize="sm">連絡先: 090-1234-5678</Text>
                            <ParticipantList />
                            <ParticipationButton status={0} />
                        </Flex>
                        <Divider />
                    </Box>
                ))}
            </Flex>
        </GridItem>
    );
}

export default EventContainer;