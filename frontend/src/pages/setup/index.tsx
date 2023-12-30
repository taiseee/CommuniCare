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
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useAuthContext } from '@/provider/AuthProvider';

type formInputs = {
    uid: string;
    name: string;
    age: number;
    gender: number;
    hobbie: string;
    selfIntroduction: string;
};

export default function Setup() {
    const { user } = useAuthContext();
    const { handleSubmit, register, formState } = useForm<formInputs>();
    const { errors, isSubmitting } = formState;

    const onSubmit = async (data: formInputs) => {
        return setDoc(doc(db, 'users', data.uid), data, { merge: true })
            .then(() => {
                // TODO: 更新後は画面遷移等何らかのアクションが必要
                console.log('書き込み成功！！');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Box>
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
                                    {...register('gender')}
                                >
                                    <option value="1">男</option>
                                    <option value="2">女</option>
                                    <option value="3">その他</option>
                                </Select>
                            </FormControl>
                            <FormControl
                                isInvalid={errors.hobbie ? true : false}
                            >
                                <FormLabel htmlFor="hobbie">趣味</FormLabel>
                                <Input
                                    id="hobbie"
                                    type="text"
                                    {...register('hobbie', {
                                        required: '趣味を入力してください'
                                    })}
                                />
                                {errors.hobbie && (
                                    <FormErrorMessage>
                                        {errors.hobbie.message}
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
