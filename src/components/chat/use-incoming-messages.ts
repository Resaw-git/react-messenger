import { useEffect, useRef } from "react";
import type { Credentials, MessageModel, Notification } from "../../types";
import { deleteNotification, receiveNotification } from "../../services/green-api";

interface UseIncomingMessagesParams {
  credentials: Credentials;
  chatId: string;
  enabled: boolean;
  onMessage: (message: MessageModel) => void;
}
const extractText = (notification: Notification): string | null => {
  const { messageData } = notification.body;
  if (!messageData) return null;

  if (messageData.textMessageData) {
    return messageData.textMessageData.textMessage;
  }

  if (messageData.extendedTextMessageData) {
    return messageData.extendedTextMessageData.text;
  }

  return null;
};

const WEBHOOK_DIRECTIONS: Record<string, MessageModel["direction"]> = {
  incomingMessageReceived: "in",
  outgoingMessageReceived: "out",
};

const POLL_DELAY = 500;
const MAX_ERROR_DELAY = 10_000;

export const useIncomingMessages = ({ credentials, chatId, enabled, onMessage }: UseIncomingMessagesParams) => {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!enabled || !chatId) return;

    const controller = new AbortController();
    let timer: number | undefined;
    let errorDelay = POLL_DELAY;

    const poll = async () => {
      let nextDelay = POLL_DELAY;

      try {
        const notification = await receiveNotification(credentials, undefined, controller.signal);

        if (controller.signal.aborted) return;

        if (notification) {
          const { body } = notification;
          const direction = WEBHOOK_DIRECTIONS[body.typeWebhook];

          if (direction && String(body.senderData?.chatId) === String(chatId)) {
            const text = extractText(notification);
            if (text !== null && !controller.signal.aborted) {
              onMessageRef.current({
                id: body.idMessage ?? String(body.timestamp),
                text,
                direction,
                timestamp: body.timestamp * 1000,
              });
            }
          }

          if (!controller.signal.aborted) {
            await deleteNotification(credentials, notification.receiptId);
          }
        }
        errorDelay = POLL_DELAY;
      } catch (e) {
        if (controller.signal.aborted) return;
        console.error("Polling error:", e);
        errorDelay = Math.min(errorDelay * 2, MAX_ERROR_DELAY);
        nextDelay = errorDelay;
      }

      if (!controller.signal.aborted) {
        timer = window.setTimeout(poll, nextDelay);
      }
    };

    poll();

    return () => {
      controller.abort();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [credentials, chatId, enabled]);
};
