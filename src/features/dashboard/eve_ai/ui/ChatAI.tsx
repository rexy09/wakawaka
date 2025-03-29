import {
  ActionIcon,
  Box,
  Card,
  CopyButton,
  Group,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { Send, StopCircle, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { RiEditLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import eve from "../../../../assets/icons/eve.png";
import { db } from "../../../../config/firebase";
import { IUserResponse } from "../../../auth/types";
import ChatMap from "../components/ChatMap";
import ConversationDrawer from "../components/ConversationDrawer";
import { useEveServices } from "../services";
import {
  ConversationMessage,
  IConversation,
  IMessage,
  IRouteData,
} from "../types";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { FaCheck } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";

const MarkdownComponents: any = {
  // Style paragraphs

  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-2 text-sm last:mb-0">{children}</p>
  ),
  // Style code blocks

  code: ({
    node,
    inline,
    className,
    children,
    ...props
  }: {
    node: any;
    inline: boolean;
    className: string;
    children: React.ReactNode;
  }) => (
    <code
      className={`${className} ${inline
        ? "rounded bg-gray-200 px-1 py-0.5 text-sm"
        : "block overflow-x-auto rounded-lg bg-gray-800 p-3 text-sm dark:bg-gray-900"
        }`}
      {...props}
    >
      {children}
    </code>
  ),
  // Style lists

  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="mb-2 ml-4 list-disc">{children}</ul>
  ),

  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="mb-2 ml-4 list-decimal">{children}</ol>
  ),

  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  // Style headings

  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mb-2 text-xl font-bold">{children}</h1>
  ),

  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-lg font-bold">{children}</h2>
  ),

  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-2 text-base font-bold">{children}</h3>
  ),

  // Style links
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

export default function ChatAI() {
  const authUser = useAuthUser<IUserResponse>();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<IConversation>();
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [firebaseConversationId, setFirebaseConversationId] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageId, setMessageId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { sendChat } = useEveServices();
  // const variable array to save the users location
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>();

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      status: "complete",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const fetchChats = async () => {
    setLoadingConversation(true);
    const userId = authUser?.owner
      ? authUser.owner?.user.id
      : authUser?.user?.id;
    const q = query(
      collection(db, "sana_eve_chat_history"),
      where("userId", "==", userId),
      orderBy("dateAdded", "desc")
    );
    const querySnapshot = await getDocs(q);
    const docsPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const messagesCollectionRef = collection(doc.ref, "messages");
      const messagesQuery = query(
        messagesCollectionRef,
        orderBy("dateAdded", "asc")
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      const snapShotmessages = messagesSnapshot.docs.map(
        (msgDoc) =>
        ({
          id: msgDoc.id,
          ...msgDoc.data(),
          timestamp: msgDoc.data().dateAdded.toDate().toISOString(),
        } as ConversationMessage)
      );

      if (
        doc.id === firebaseConversationId ||
        searchParams.get("id") == doc.id
      ) {
        setActiveConversation({
          id: doc.id,
          ...data,
          messages: snapShotmessages,
        } as IConversation);
        if (messages.length == 1) {
          const message = snapShotmessages.map(
            (item, index) =>
            ({
              id: index,
              text: item.text,
              sender: item.isUser ? "user" : "bot",
              timestamp: moment(item.timestamp).format("h:mm A"),
              status: "history",
              routeData: item.routeData,
            } as IMessage)
          );
          setMessages(message);
          setConversationId(data.conversation_id);
          setFirebaseConversationId(doc.id);
        }
      }

      return {
        id: doc.id,
        ...data,
        messages: snapShotmessages,
      } as IConversation;
    });

    const messageList = await Promise.all(docsPromises);
    setConversations(messageList);
    setLoadingConversation(false);
  };

  const createConversation = async (initialMessageText: string) => {
    try {
      const userId = authUser?.owner
        ? authUser.owner?.user.id
        : authUser?.user?.id;
      const conversationData = {
        userId: userId,
        dateAdded: Timestamp.fromDate(new Date()),
        title: initialMessageText,
        conversation_id: conversationId,
      };

      const conversationRef = await addDoc(
        collection(db, "sana_eve_chat_history"),
        conversationData
      );
      console.log("New conversation created with ID:", conversationRef.id);

      // Step 2: Add an initial message to the messages subcollection
      const initialMessage = {
        command: null,
        dateAdded: Timestamp.fromDate(new Date()),
        isStreaming: true,
        isUser: true,
        text: initialMessageText,
      };

      const messageRef = await addDoc(
        collection(conversationRef, "messages"),
        initialMessage
      );
      console.log("Initial message added to conversation:", conversationRef.id);
      // setFirebaseConversationId(conversationRef.id)
      // fetchChats();
      // Directly update the active conversation state
      const newConversation = {
        id: conversationRef.id,
        ...conversationData,
        aiMessageCount: 0,
        dateUpdated: "",
        userMessageCount: 1,
        messages: [
          {
            id: messageRef.id, // or generate an id if necessary
            command: null,
            dateAdded: Timestamp.fromDate(new Date()),
            isStreaming: true,
            isUser: true,
            text: initialMessageText,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setActiveConversation(newConversation);
      setFirebaseConversationId(conversationRef.id);
      searchParams.set("id", conversationRef.id);
      setSearchParams(searchParams);

      // Optionally update your overall conversations list as well
      setConversations((prev) => [newConversation, ...prev]);

      return conversationRef.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  };

  const addMessageToConversation = async (
    conversationId: string,
    messageText: string,
    isUser: boolean,
    routeData?: IRouteData
  ) => {
    try {
      console.log("addMessageToConversation Conversation ID:", conversationId);
      console.log("messageText :", messageText);

      // Step 1: Reference the conversation document
      const conversationRef = doc(db, "sana_eve_chat_history", conversationId);

      // Step 2: Add a new message to the messages subcollection
      const newMessage = {
        command: null,
        dateAdded: Timestamp.fromDate(new Date()),
        isStreaming: false,
        isUser: isUser,
        text: messageText,
        routeData: routeData ? routeData : null,
      };

      await addDoc(collection(conversationRef, "messages"), newMessage);
      fetchChats();
      console.log("Message added to conversation:", conversationId);
    } catch (error) {
      console.error("Error adding message to conversation:", error);
      throw error;
    }
  };

  useEffect(() => {
    getUserLocation();
    fetchChats();

    const uuid = uuidv4();
    setConversationId(uuid);
  }, []);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const controller = new AbortController();
      setAbortController(controller);

      const userMessage = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Append the new user message
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      let conversationRef: string;
      let routeData: IRouteData | undefined;
      if (!firebaseConversationId) {
        // No conversation exists, so create one
        conversationRef = await createConversation(input);
      } else {
        // A conversation already exists, add the message to it
        addMessageToConversation(firebaseConversationId, input, true, routeData);
      }
      // Reserve an id for the bot message that won't conflict with the user message
      const botMessageId = messages.length + 2;
      setMessageId(botMessageId);
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            id: botMessageId,
            text: "",
            sender: "bot",
            status: "loading",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });

      try {
        const response = await sendChat({
          message: input,
          conversationId: conversationId,
          username: authUser?.owner
            ? authUser.owner?.user.full_name
            : authUser?.user?.full_name,
          signal: controller.signal,
          userLocation: userLocation,
        });

        if (!response.body) {
          console.error("ReadableStream not supported in this browser.");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Process all complete lines except the last (which might be incomplete)
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line) {
              try {
                const json = JSON.parse(line);
                if (json.type === "tool_call") {
                  if (
                    json.response == "open map" &&
                    json.status == "complete"
                  ) {
                    routeData = json.data;
                    setMessages((prevMessages) => {
                      const index = prevMessages.findIndex(
                        (msg) => msg.id === botMessageId
                      );

                      if (index !== -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[index] = {
                          ...updatedMessages[index],
                          routeData: json.data,
                          status: "tool_call",
                        };
                        return updatedMessages;
                      } else {
                        return [...prevMessages];
                      }
                    });
                  } else {
                    setMessages((prevMessages) => {
                      const index = prevMessages.findIndex(
                        (msg) => msg.id === botMessageId
                      );

                      if (index !== -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[index] = {
                          ...updatedMessages[index],
                          generating_response: [
                            json,
                            ...(updatedMessages[index].generating_response ||
                              []),
                          ],
                          status: "tool_call",
                        };
                        return updatedMessages;
                      } else {
                        return [...prevMessages];
                      }
                    });
                  }
                }
                if (json.type === "chat_model_stream") {
                  setMessages((prevMessages) => {
                    // Check if the bot message already exists using the reserved id
                    const index = prevMessages.findIndex(
                      (msg) => msg.id === botMessageId
                    );

                    if (index !== -1) {
                      // Update the existing bot message by appending the new response
                      const updatedMessages = [...prevMessages];
                      updatedMessages[index] = {
                        ...updatedMessages[index],
                        text: updatedMessages[index].text + json.response,
                        status: "chat_model_stream",
                      };
                      return updatedMessages;
                    } else {
                      // If it doesn't exist yet, add a new bot message with the reserved id
                      return [...prevMessages];
                    }
                  });
                }
                if (json.type === "complete") {
                  setIsLoading(false);
                  setMessages((prevMessages) => {
                    // Check if the bot message already exists using the reserved id
                    const index = prevMessages.findIndex(
                      (msg) => msg.id === botMessageId
                    );

                    if (index !== -1) {
                      // Update the existing bot message by appending the new response
                      const updatedMessages = [...prevMessages];
                      updatedMessages[index] = {
                        ...updatedMessages[index],
                        status: "complete",
                      };
                      addMessageToConversation(
                        conversationRef
                          ? conversationRef
                          : firebaseConversationId,
                        updatedMessages[index].text,
                        false,
                        routeData
                      );
                      return updatedMessages;
                    } else {
                      // If it doesn't exist yet, add a new bot message with the reserved id
                      return [...prevMessages];
                    }
                  });
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          }
          // Keep the last incomplete line in the buffer
          buffer = lines[lines.length - 1];
        }
      } catch (error: any) {
        setIsLoading(false);
        if (error.name === "AbortError") {
          console.log("Request aborted by the user.");
        } else {
          setMessages((prevMessages) => {
            // Check if the bot message already exists using the reserved id
            const index = prevMessages.findIndex(
              (msg) => msg.id === botMessageId
            );

            if (index !== -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[index] = {
                ...updatedMessages[index],
                errorMessage: "Something went wrong!",
                status: "error",
              };
              return updatedMessages;
            } else {
              return [...prevMessages];
            }
          });
        }
        // notifications.show({
        //   color: "red",
        //   title: "Error",
        //   message: "Something went wrong!",
        // });
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
        setAbortController(null);
      }
    }
  };

  const handleKeyPress = (e: {
    key: string;
    shiftKey: any;
    preventDefault: () => void;
  }) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setMessages((prevMessages) => {
        const index = prevMessages.findIndex((msg) => msg.id === messageId);
        if (index !== -1) {
          const updatedMessages = [...prevMessages];
          updatedMessages[index] = {
            ...updatedMessages[index],
            text:
              updatedMessages[index].text.length > 0
                ? updatedMessages[index].text
                : "Stopped",
            status: "aborted",
          };
          return updatedMessages;
        }
        return prevMessages;
      });
      console.log("Streaming stopped.");
    }
  };
  const newChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! How can I help you today?",
        sender: "bot",
        status: "complete",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    const uuid = uuidv4();
    setConversationId(uuid);
    setActiveConversation(undefined);
    setFirebaseConversationId("");
    searchParams.delete("id");
    setSearchParams(searchParams);
  };
  return (
    <div>
      <Card className="flex h-[80vh] flex-col" radius={"md"}>
        <Group justify="space-between">
          <Box w={300}>
            <Text size="sm" lineClamp={1} fw={500}>
              {activeConversation ? activeConversation.title : "New Chat"}
            </Text>
          </Box>
          <Group>
            <ConversationDrawer
              loadingConversation={loadingConversation}
              conversations={conversations}
              fetchChats={fetchChats}
              setActiveConversation={setActiveConversation}
              setMessages={setMessages}
              setConversationId={setConversationId}
              firebaseConversationId={firebaseConversationId}
              setFirebaseConversationId={setFirebaseConversationId}
              newChat={newChat}
            />

            <ActionIcon
              variant="default"
              size={"lg"}
              radius={"md"}
              disabled={isLoading}
              onClick={() => {
                newChat();
              }}
            >
              <RiEditLine />
            </ActionIcon>
          </Group>
        </Group>
        <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-500">
          <div style={{ maxWidth: "800px" }} className="mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                {message.sender != "user" && (
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${message.sender === "user"
                      ? "bg-blue-500"
                      : "bg-transparent"
                      }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <>
                        {message.status === "loading" ||
                          message.status === "chat_model_stream" ||
                          message.status === "tool_call" ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full">
                            <img
                              src={eve}
                              alt="Rotating Icon"
                              className="h-8 w-8 animate-spin"
                              style={{
                                animationDuration: "3s",
                                animationTimingFunction: "linear",
                                animationIterationCount: "infinite",
                              }}
                            />
                          </div>
                        ) : (
                          <img src={eve} alt="Eve Icon" className="h-8 w-8 " />
                        )}
                      </>
                    )}
                  </div>
                )}
                <div className="flex max-w-[70%] flex-col gap-1">
                  {message.generating_response &&
                    message.generating_response.length > 0 && (
                      <div className="text-sm text-gray-500 font-semibold px-3">
                        {message.generating_response[0].response}
                      </div>
                    )}
                  {message.status === "loading" ? (
                    <div className="rounded-lg bg-gray-100 p-3 text-gray-700 ms-3">
                      <div className="flex space-x-2">
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                          style={{ animationDelay: "200ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                          style={{ animationDelay: "400ms" }}
                        ></div>
                      </div>
                    </div>
                  ) : null}
                  <div
                    className={`rounded-lg  ${message.sender === "user"
                      ? "px-3 py-2 ml-auto bg-blue-500 text-white"
                      : "bg-white text-gray-700 px-3"
                      }`}
                  >
                    <ReactMarkdown
                      components={MarkdownComponents}
                      className={`markdown ${message.sender === "user"
                        ? "text-white"
                        : "text-gray-700"
                        }`}
                    >
                      {message.text}
                    </ReactMarkdown>
                    {message.routeData && (
                      <div className="my-2">
                        <ChatMap
                          routeData={message.routeData}
                          key={`map${message.id}`}
                        />
                      </div>
                    )}
                  </div>
                  {message.errorMessage && (
                    <div
                      className={`text-sm text-red-500 dark:text-red-400 ${message.sender != "user" ? "ps-3" : ""
                        }`}
                    >
                      {message.errorMessage}
                    </div>
                  )}
                  <Group gap={"5"}>
                    <div
                      className={`text-xs text-gray-500 dark:text-gray-400 ${message.sender != "user" ? "ps-3" : "ml-auto"
                        }`}
                    >
                      {message.timestamp}
                    </div>
                    {message.sender == "user" && <CopyButton value={message.text} timeout={2000}>
                      {({ copied, copy }) => (
                        <Tooltip
                          label={<Text fz={"8px"} fw={400}>
                            {copied ? "Copied" : "Copy"}
                          </Text>}
                          withArrow
                          position="right"
                        >
                          <ActionIcon
                            color={copied ? "teal" : "gray"}
                            variant="subtle"
                            onClick={copy}
                            size={"sm"}
                          >
                            {copied ? <FaCheck /> : <IoCopyOutline />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>}
                  </Group>
                </div>
              </div>
            ))}

            {/* Dummy element for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-0 p-4 dark:border-gray-700">
          <div style={{ maxWidth: "800px" }} className="mx-auto">
            <div className="flex items-center gap-2">
              <Textarea
                radius={"md"}
                w={"100%"}
                size="md"
                placeholder="Type your message..."
                autosize
                minRows={1}
                maxRows={4}
                onKeyPress={isLoading ? undefined : handleKeyPress}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {!isLoading ? (
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="rounded-full bg-blue-500 p-2 text-white 
                hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50
                dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="rounded-full bg-gray-400 p-2 text-white hover:bg-gray-500"
                >
                  <StopCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
