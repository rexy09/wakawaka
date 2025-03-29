import { ActionIcon, Drawer, Group, HoverCard, Loader, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import moment from "moment";
import { useState } from "react";
import { MdDeleteOutline, MdHistory } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { Color } from "../../../../common/theme";
import { db } from "../../../../config/firebase";
import { IConversation, IMessage } from "../types";

interface Props {
    loadingConversation: boolean;
    conversations: IConversation[];
    fetchChats: () => void;
    newChat: () => void;
    setActiveConversation: (conversation: IConversation) => void;
    setMessages: (messages: IMessage[]) => void;
    setConversationId: (id: string) => void;
    firebaseConversationId: string;
    setFirebaseConversationId: (id: string) => void;
}

export default function ConversationDrawer({ loadingConversation, conversations, firebaseConversationId, setActiveConversation, setMessages, setConversationId, fetchChats, setFirebaseConversationId, newChat }: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

    const deleteConversation = async (conversationId: string) => {
        setDeletingConversationId(conversationId);
        try {
            const conversationRef = doc(db, "sana_eve_chat_history", conversationId);
            const messagesCollectionRef = collection(conversationRef, "messages");
            const messagesQuery = query(messagesCollectionRef);
            const messagesSnapshot = await getDocs(messagesQuery);

            const deleteMessagesPromises = messagesSnapshot.docs.map((msgDoc) =>
                deleteDoc(doc(messagesCollectionRef, msgDoc.id))
            );
            await Promise.all(deleteMessagesPromises);

            await deleteDoc(conversationRef);
            if (firebaseConversationId == conversationId){
                newChat();
            }
            await fetchChats();
        } catch (error) {
            console.log(error instanceof Error ? error.message : "An error occurred");

        } finally {
            setDeletingConversationId(null);
        }
    };

    return (
        <>
            <Drawer
                opened={opened}
                onClose={close}
                title={
                    <Group>

                    <Text size="18px" fw={500}>
                        Conversations
                    </Text>
                    {loadingConversation &&
    
                        <Loader color="blue" size={"sm"} type="dots" />
                    }
                    </Group>
                }
                position="right"
            >
                {conversations.map((item, index) => (
                    <div key={index}>
                        <HoverCard width={280} shadow="md">
                            <HoverCard.Target>
                                <Group
                                    justify="space-between"
                                    wrap="nowrap"
                                    className={firebaseConversationId == item.id ? "bg-gray-400 rounded-[10px] text-white" : "" + `hover:bg-gray-400 hover:text-white rounded-[10px]`}
                                    p={"xs"}
                                    mb={"xs"}
                                >
                                    <UnstyledButton
                                        key={index}
                                        component="div"
                                        onClick={() => {
                                            setActiveConversation(item);
                                            const messages = item.messages.map((item, index) => ({
                                                id: index,
                                                text: item.text,
                                                sender: item.isUser ? "user" : "bot",
                                                timestamp: moment(item.timestamp).format("h:mm A"),
                                                status: "history",
                                                routeData: item.routeData,
                                            } as IMessage));
                                            setMessages(messages);
                                            setConversationId(item.conversation_id);
                                            setFirebaseConversationId(item.id);
                                            searchParams.set("id", item.id);
                                            setSearchParams(searchParams);
                                            close();
                                        }}
                                    >
                                        <Text lineClamp={1}>{item.title}</Text>
                                    </UnstyledButton>
                                    <ActionIcon variant="default" loading={deletingConversationId === item.id} onClick={() => {
                                        deleteConversation(item.id)
                                    }} radius="md" disabled={deletingConversationId === item.id}>
                                        <MdDeleteOutline color={Color.Danger} />
                                    </ActionIcon>
                                    {/* <PiDotsThreeOutlineThin /> */}
                                </Group>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">{item.title}</Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>
                ))}
            </Drawer>

            <ActionIcon
                variant="default"
                size={"lg"}
                radius={"md"}
                onClick={open}
                // disabled={loadingConversation}
            >
                {/* {loadingConversation ?
                    <Loader color="blue" size="xs" type="dots" /> :
                } */}
                <MdHistory />
            </ActionIcon>
        </>
    );
}