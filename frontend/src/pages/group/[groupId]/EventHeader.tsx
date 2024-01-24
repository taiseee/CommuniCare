import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import {
    Box,
    Flex,
    Card,
    CardHeader,
    Heading,
    Button,
    Input,
    FormControl,
    FormErrorMessage,
} from "@chakra-ui/react";
import {
    EditIcon,
    CheckIcon,
} from "@chakra-ui/icons";
import {
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    collection,
    query,
    where,
    documentId,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useAuthContext } from "@/provider/AuthProvider";

type GroupNameFormInput = {
    groupName: string;
};

export default function EventHaeder() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId as string;
    const { user } = useAuthContext();
    const [groupName, setGroupName] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { handleSubmit, register, formState } = useForm<GroupNameFormInput>({
        defaultValues: async () => fetchGroupName()
    });
    const { errors, isSubmitting } = formState;

    async function fetchGroupName() {
        const groupRef = collection(db, 'groups');
        const groupQ = query(groupRef, where(documentId(), '==', groupId));
        const groupSnapshot = await getDocs(groupQ);
        const groupName = groupSnapshot.docs[0].data().name;
        setGroupName(groupName);
        return { groupName: groupName };
    }

    async function handleExitButtonClick() {
        try {
            const userGroupsRef = collection(db, 'userGroups');
            const userGroupQ = query(userGroupsRef, where('groupId', '==', groupId), where('userId', '==', user?.uid));
            const userGroupSnapshot = await getDocs(userGroupQ);
            const userGroupDoc = userGroupSnapshot.docs[0];
            await deleteDoc(doc(db, 'userGroups', userGroupDoc.id));
            router.push('/group');
        } catch (error) {
            console.error(error);
        }
    }

    async function changeGroupName(data: GroupNameFormInput) {
        try {
            const groupRef = collection(db, 'groups');
            const groupQ = query(groupRef, where(documentId(), '==', groupId));
            const groupSnapshot = await getDocs(groupQ);
            const groupDoc = groupSnapshot.docs[0];
            await setDoc(doc(db, 'groups', groupDoc.id), {
                name: data.groupName,
            });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchGroupName();
    }, [isEditing]);

    return (
        <Box mb="4">
            <Card>
                <CardHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            {
                                !isEditing ?
                                    <>
                                        <Heading size="md">{groupName}</Heading>
                                        <Button variant="ghost" ml="2"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <EditIcon />
                                        </Button>
                                    </>
                                    :
                                    <form
                                        onSubmit={handleSubmit(changeGroupName)}
                                    >
                                        <Flex>
                                            <FormControl
                                                isInvalid={errors.groupName ? true : false}
                                            >
                                                <Input
                                                    width={{ base: '150px', md: '500px' }}
                                                    type="text"
                                                    id="groupName"
                                                    {...register('groupName', {
                                                        required: 'グループ名を入力してください'
                                                    })}
                                                />
                                                {errors.groupName && (
                                                    <FormErrorMessage>
                                                        {errors.groupName.message}
                                                    </FormErrorMessage>
                                                )}
                                            </FormControl>
                                            <Button variant="ghost" type="submit" isLoading={isSubmitting}>
                                                <CheckIcon />
                                            </Button>
                                        </Flex>
                                    </form>
                            }
                            
                        </Flex>
                        <Flex alignItems="center">
                            <Button onClick={() => handleExitButtonClick()} ml="2">
                                退出する
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.285 12h-8.012m5.237 3.636L20 12l-3.49-3.636M13.455 7V4H4v16h9.455v-3" />
                                </svg>
                            </Button>
                        </Flex>
                    </Flex>
                </CardHeader>
            </Card>
        </Box>
    );
}