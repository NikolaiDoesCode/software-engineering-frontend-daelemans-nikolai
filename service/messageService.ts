import { Message } from "@/types";

const addMessage = (message : Message, userEmail: string, groupchatId: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/message/" + userEmail + "/" + groupchatId, {
    method: "POST",
    body: JSON.stringify(message),
    headers: {
      "Content-Type": "application/json",
    },
  });
};


const MessageService = {
    addMessage,
};

export default MessageService;
