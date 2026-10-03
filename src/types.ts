export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl?: string;
}
export interface SendMessageResponse {
  idMessage: string;
}

export type StateInstance = "authorized" | "notAuthorized" | "blocked" | "sleepMode" | "starting";

export interface GetStateInstanceResponse {
  stateInstance: StateInstance;
}

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
}

export interface Notification {
  receiptId: number;
  body: NotificationBody;
}

export interface NotificationBody {
  typeWebhook: string;
  timestamp: number;
  idMessage?: string;
  senderData?: {
    chatId: string;
    sender: string;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
    extendedTextMessageData?: {
      text: string;
    };
  };
}

export interface DeleteNotificationResponse {
    result: boolean;
    reason: string;
}

export interface MessageModel {
  id: string;
  text: string;
  direction: "in" | "out";
  timestamp: number;
}

export interface ChatModel {
  phone: string;
  chatId: string;
  firstName?: string;
  lastName?: string;
}

export function getContactName(chat: ChatModel): string {
  return [chat.firstName, chat.lastName].filter(Boolean).join(" ");
}