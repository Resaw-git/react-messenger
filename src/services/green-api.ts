import type {
  CheckAccountResponse,
  Credentials,
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  Notification,
  SendMessageResponse,
} from "../types";

const API_DOMAIN = "green-api.com";
const ID_INSTANCE_RE = /^\d{12}$/;
const HOST_ALLOWLIST_RE = new RegExp(`^https://\\d{4}\\.api\\.${API_DOMAIN.replace(/\./g, "\\.")}$`);

const MIN_RECEIVE_TIMEOUT = 5;
const MAX_RECEIVE_TIMEOUT = 60;

type ApiMethod = "sendMessage" | "checkAccount" | "receiveNotification" | "deleteNotification" | "getStateInstance";

const resolveApiUrl = ({ idInstance, apiUrl }: Credentials): string => {
  if (apiUrl) {
    const normalized = apiUrl.trim().replace(/\/+$/, "");
    if (!HOST_ALLOWLIST_RE.test(normalized)) {
      throw new Error("Недопустимый apiUrl");
    }
    return normalized;
  }

  if (!ID_INSTANCE_RE.test(idInstance)) {
    throw new Error("Некорректный idInstance");
  }
  return `https://${idInstance.slice(0, 4)}.api.${API_DOMAIN}`;
};

const buildUrl = (credentials: Credentials, method: ApiMethod): string => {
  const { idInstance, apiTokenInstance } = credentials;

  if (!apiTokenInstance.trim()) {
    throw new Error("Не указан apiTokenInstance");
  }

  return `${resolveApiUrl(credentials)}/waInstance${encodeURIComponent(idInstance)}/${method}/${encodeURIComponent(apiTokenInstance)}`;
};

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...init, headers });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Green API ${response.status}: ${text || response.statusText}`);
  }

  if (!text) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Green API: ответ не является корректным JSON");
  }
};

export const getStateInstance = async (credentials: Credentials): Promise<GetStateInstanceResponse> =>
  request<GetStateInstanceResponse>(buildUrl(credentials, "getStateInstance"));

export const sendMessage = async (
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> =>
  request<SendMessageResponse>(buildUrl(credentials, "sendMessage"), {
    method: "POST",
    body: JSON.stringify({ chatId, message }),
  });

export const checkAccount = async (credentials: Credentials, phoneNumber: string): Promise<CheckAccountResponse> => {
  const digits = phoneNumber.replace(/\D/g, "");
  if (!digits) {
    throw new Error("Некорректный номер телефона");
  }

  return request<CheckAccountResponse>(buildUrl(credentials, "checkAccount"), {
    method: "POST",
    body: JSON.stringify({ phoneNumber: Number(digits) }),
  });
};

export const receiveNotification = async (
  credentials: Credentials,
  receiveTimeout = MIN_RECEIVE_TIMEOUT,
  signal?: AbortSignal,
): Promise<Notification | null> => {
  const timeout = Math.min(Math.max(Math.trunc(receiveTimeout), MIN_RECEIVE_TIMEOUT), MAX_RECEIVE_TIMEOUT);
  const url = `${buildUrl(credentials, "receiveNotification")}?receiveTimeout=${timeout}`;
  return request<Notification | null>(url, { signal });
};

export const deleteNotification = async (
  credentials: Credentials,
  receiptId: number,
): Promise<DeleteNotificationResponse> => {
  if (!Number.isInteger(receiptId)) {
    throw new Error("Некорректный receiptId");
  }

  return request<DeleteNotificationResponse>(`${buildUrl(credentials, "deleteNotification")}/${receiptId}`, {
    method: "DELETE",
  });
};
