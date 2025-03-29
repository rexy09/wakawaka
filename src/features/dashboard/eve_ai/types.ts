

export interface IMessage {
  id: number;
  text: string;
  errorMessage?: string;
  sender: string;
  timestamp: string;
  status?: string | "loading" | "chat_model_stream" | "tool_call"|"error";
  generating_response?: IStreamResponse[];
  routeData?: IRouteData;
}

export interface  IStreamResponse {
  response: string;
  type: string;    
  status: string;  
}

export interface ILocation {
  latitude: string;
  longitude: string;
}

export interface IRouteData {
  starting_location: ILocation;
  ending_location: ILocation;
  route_status: string| "success";
}


export interface IConversation {
  id: string;
  aiMessageCount: number;
  conversation_id: string;
  dateAdded: any;
  dateUpdated: any;
  title: string;
  userId?: string;
  userMessageCount: number;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  command: string | null;
  dateAdded: any;
  isStreaming: boolean;
  isUser: boolean;
  text: string;
  timestamp: string;
  routeData?: IRouteData;
}