import axios from "axios";

interface BackendErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface BackendSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ChatResponse {
  reply: string;
  sessionId: string;
  message: string;
  warning?: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:3001",
  withCredentials: true,
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const validationMessages = error.response?.data?.errors
      ?.map((fieldError) => fieldError.message)
      .join(" ");

    if (validationMessages) {
      return validationMessages;
    }

    const backendMessage = error.response?.data?.message;

    if (backendMessage) {
      return backendMessage;
    }

    if (!error.response) {
      return "We could not send your message right now. Please try again in a moment.";
    }

    return "Something went wrong while sending your message. Please try again.";
  }

  if (error instanceof Error) {
    return "Something went wrong while sending your message. Please try again.";
  }

  return "Something went wrong while sending your message. Please try again.";
}

export async function sendMessage(
  message: string,
  sessionId?: string,
): Promise<ChatResponse> {
  const response = await api.post<BackendSuccessResponse<ChatResponse>>(
    "/chat/message",
    {
      message,
      sessionId,
    },
  );

  return response.data.data;
}

export async function fetchHistory(
  sessionId: string,
): Promise<Array<{ sender: "user" | "ai"; text: string }>> {
  const response = await api.get<
    BackendSuccessResponse<Array<{ sender: "user" | "ai"; text: string }>>
  >(`/chat/history/${sessionId}`);

  return response.data.data;
}
