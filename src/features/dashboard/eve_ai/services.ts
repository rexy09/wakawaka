import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { ChatbotService } from "./ai-convo";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserResponse } from "../../auth/types";
import Env from "../../../config/env";

export const useEveServices = () => {
  const chatbotService = new ChatbotService();
  const authHeader = useAuthHeader() || "";
  const authUser = useAuthUser<IUserResponse>();

  const sendMessage = async ({
    message,
    username,
    conversationId,
  }: {
    message: string;
    username?: string;
    conversationId: string;
  }) => {
    return chatbotService.sendMessage(
      message,
      authHeader,
      authUser?.user_type || "regular",
      username!,
      conversationId
    );
  };

  const sendChat = async ({
    message,
    username,
    conversationId,
    signal, // new parameter
    userLocation, // new parameter
  }: {
    message: string;
    username?: string;
    conversationId: string;
    signal?: AbortSignal;
    userLocation?: { latitude: number; longitude: number };
  }) => {
    const url = new URL(Env.CHATBOT_URL + "/action/chatbot");
    url.searchParams.append("engine", "engine_3");
    url.searchParams.append("verbose", "true");
    url.searchParams.append("conversation_id", conversationId);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        chatbot_id:
          authUser?.user_type == "owner"
            ? Env.CHATBOT_ID
            : Env.CHATBOT_ID_SENDER,
        chatbot_type: "customer_interaction",
        additional_data:
          `The user you are chatting to is called: ${username}` + userLocation
            ? `the current user location is longitude: ${userLocation?.longitude} and latitude: ${userLocation?.latitude}`
            : "the current user location was not provided",
        user_token: authHeader,
      }),
      signal, // pass the abort signal here
    });
    return response;
  };

  return {
    sendMessage,
    sendChat,
  };
};
