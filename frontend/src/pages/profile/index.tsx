'use client';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Flex,
    VStack,
    FormErrorMessage,
    Textarea
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    documentId,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebaseConfig';
import { getEmbedding } from '@/lib/getEmbedding';
import { useAuthContext } from '@/provider/AuthProvider';

type formInputs = {
    uid: string;
    name: string;
    age: number;
    gender: number;
    area: string;
    interests: string;
    hobbies: string;
    selfIntroduction: string;
};

export default function Profile() {
    const router = useRouter();
    const { user } = useAuthContext();
    const createGroup = httpsCallable(functions, 'create_group');
    const { handleSubmit, register, formState } = useForm<formInputs>({
        defaultValues: async () => await getUserProfile(user?.uid as string)
    });
    const { errors, isSubmitting } = formState;

    const getUserProfile = async (userId: string): Promise<formInputs> => {
        const userRef = collection(db, 'users');
        const userQ = query(userRef, where(documentId(), '==', userId));
        const userSnapshot = await getDocs(userQ);
        const user = userSnapshot.docs[0].data() as formInputs;
        return user;
    }

    const onSubmit = async (data: formInputs) => {
        const hobVec = await getEmbedding(data.hobbies);
        const interVec = await getEmbedding(data.interests);
        const userVec = hobVec.map((num, idx) => {
            return (num + interVec[idx]) / 2;
        });

        const age = Number(data.age);
        const gender = Number(data.gender);

        const userDoc = { ...data, userVec, age, gender };

        return setDoc(doc(db, 'users', data.uid), userDoc, { merge: true })
            .then(() => {
                return createGroup({ userId: data.uid });
            })
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Box mt={4}>
            <Flex
                flexDirection="column"
                width="100%"
                justifyContent="center"
                alignItems="center"
            >
                <VStack spacing="5">
                    <Heading>ユーザ情報登録</Heading>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ width: '100%' }}
                    >
                        <VStack spacing="4" alignItems="left">
                            <Input
                                type="hidden"
                                {...register('uid')}
                                value={user?.uid}
                            ></Input>
                            <FormControl isInvalid={errors.name ? true : false}>
                                <FormLabel htmlFor="name" textAlign="start">
                                    名前
                                </FormLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    {...register('name', {
                                        required: '名前を入力してください'
                                    })}
                                />
                                {errors.name && (
                                    <FormErrorMessage>
                                        {errors.name.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isInvalid={errors.age ? true : false}>
                                <FormLabel htmlFor="age">年齢</FormLabel>
                                <Input
                                    id="age"
                                    type="number"
                                    {...register('age', {
                                        required: '年齢を入力してください'
                                    })}
                                />
                                {errors.age && (
                                    <FormErrorMessage>
                                        {errors.age.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                isInvalid={errors.gender ? true : false}
                            >
                                <FormLabel htmlFor="gender">性別</FormLabel>
                                <Select
                                    id="gender"
                                    placeholder="--"
                                    {...register('gender', {
                                        required: '性別を選択してください',
                                    })}
                                >
                                    <option value="1">男</option>
                                    <option value="2">女</option>
                                    <option value="3">その他</option>
                                </Select>
                                {errors.gender && (
                                    <FormErrorMessage>
                                        {errors.gender.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                isInvalid={errors.area ? true : false}
                            >
                                <FormLabel htmlFor="area">居住区</FormLabel>
                                <Select
                                    id="area"
                                    placeholder="--"
                                    {...register('area', {
                                        required: '居住区を選択してください'
                                    })}
                                >
                                    <option value="東区">東区</option>
                                    <option value="博多区">博多区</option>
                                    <option value="中央区">中央区</option>
                                    <option value="南区">南区</option>
                                    <option value="西区">西区</option>
                                    <option value="城南区">城南区</option>
                                    <option value="早良区">早良区</option>
                                    <option value="西区">西区</option>
                                </Select>
                                {errors.area && (
                                    <FormErrorMessage>
                                        {errors.area.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                isInvalid={errors.interests ? true : false}
                            >
                                <FormLabel htmlFor="interests">
                                    興味のあるもの
                                </FormLabel>
                                <Input
                                    id="interests"
                                    type="text"
                                    {...register('interests', {
                                        required:
                                            '興味のあるものを入力してください'
                                    })}
                                />
                                {errors.interests && (
                                    <FormErrorMessage>
                                        {errors.interests.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                isInvalid={errors.hobbies ? true : false}
                            >
                                <FormLabel htmlFor="hobbies">趣味</FormLabel>
                                <Input
                                    id="hobbies"
                                    type="text"
                                    {...register('hobbies', {
                                        required: '趣味を入力してください'
                                    })}
                                />
                                {errors.hobbies && (
                                    <FormErrorMessage>
                                        {errors.hobbies.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                isInvalid={
                                    errors.selfIntroduction ? true : false
                                }
                            >
                                <FormLabel htmlFor="selfIntroduction">
                                    自己紹介
                                </FormLabel>
                                <Textarea
                                    id="selfIntroduction"
                                    {...register('selfIntroduction')}
                                />
                            </FormControl>
                            <Button
                                marginTop="4"
                                color="white"
                                bg="teal.400"
                                type="submit"
                                paddingX="auto"
                                isLoading={isSubmitting}
                                loadingText="送信中"
                            >
                                入力完了
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Flex>
        </Box>
    );
}
