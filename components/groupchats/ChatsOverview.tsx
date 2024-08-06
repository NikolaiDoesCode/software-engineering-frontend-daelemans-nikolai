import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CarService from "@/service/carService";
import { Car, Groupchat, Message, Role, User } from "@/types";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import RedButton from "../buttons/RedButton";
import userService from "@/service/userService";
import { useTranslation } from "react-i18next";
import GroupchatService from "@/service/groupchatsService";
import MessageService from "@/service/messageService";

const ChatsOverview: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [user, setUser] = useState<User>(); 
  const [userEmail, setUserEmail] = useState("");  
  const [chosenChat, setChosenChat] = useState<Groupchat>();
  const [messageOfUserForThisChat, setMessageOfUser] = useState<Message[]>();  

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUser(userData)
        setUserEmail(userData.email); // Set user email
      }
    }
  }, []);

  const fetchChats = async () => {
    try {
      const response = await userService.getGroupchatsUser(userEmail);
      const chats = await response.json();
  
      const chatPromises = chats.map(async (chat: Groupchat) => {
        try {
          const users = await GroupchatService.getUsersOfGroupchat(chat.id as number);
          const userData = await users.json();
          chat.users = userData;
          return chat;
        } catch (error) {
          console.error("Error fetching users for chat:", error);
          return null;
        }
      });
  
      const chatsWithUsers = await Promise.all(chatPromises);
      
      return chatsWithUsers;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return null;
    }
  };

  const fetchMessagesUser = async () => {
    try {
      const response = await userService.getMessagesUser(userEmail);
      const messages = await response.json();
  
      return messages;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return null;
    }
  };

  const { data: chatsWithUsers, isLoading, error } = useSWR("chats", fetchChats);

  useInterval(() => {
    mutate("chats", fetchChats());
  }, 5000);

  const { data: messagesOfUser} = useSWR("messages", fetchMessagesUser);

  useInterval(() => {
    mutate("messages", fetchMessagesUser());
  }, 5000);

  const handleChat = async (chat : Groupchat) => {
    console.log(chosenChat)
    let messageOfUserForThisChatLocal : Message[] = [];
  
    if(user) {
      if(messagesOfUser) {
        messagesOfUser.forEach((userMessage : Message) => {
          if (chat.messages && chat.messages.find(chatMessage => chatMessage.id === userMessage.id)) {
            messageOfUserForThisChatLocal.push(userMessage);
          }
        });
      }
    }

    let messagesWithUser : Message[] = [] 
    let toSave = true

    if (chat.users && chat.messages) {
      const updatedMessages = chat.messages.map((chatMessage: Message) => {
        if(chat.users)
        chat.users.forEach((user: User) => {
            if (user.messages) {
              user.messages.forEach((userMessage: Message) => {
                if (chatMessage.id === userMessage.id) {
                  chatMessage.user = user;
                  messagesWithUser.push(chatMessage)
                }
              });
            }
        });
        return chatMessage;
      });
    
      chat.messages = messagesWithUser;
    }

    setMessageOfUser(messageOfUserForThisChatLocal)
    setChosenChat(chat);
  };
  
  useInterval(() => {
    if(chosenChat)
    mutate("chat", handleChat(chosenChat));
  }, 5000);

  const handleSendMessage = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message : Message = {
      text: newMessage
    }

    try {
      if(chosenChat && chosenChat.id) {
        const response = await MessageService.addMessage(message, userEmail, chosenChat?.id);
        const responseData = await response.json();
        console.log(responseData)
      }
    } catch (error) {
      console.error("Error fetching users for chat:", error);
      return null;
    }

    console.log(newMessage)
  
    setNewMessage("");
  };

  return (
    <div className="flex min-w-full min-h-full">
      <div className="overflow-y-auto w-3/12 border-4 max-h-[70vh] border-gray-800 py-4">
        {isLoading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-center mt-4">Error: {error}</p>}
        {chatsWithUsers && chatsWithUsers.length > 0 && (
          <div>
            <h1 className="flex text-4xl items-center justify-center mb-8">Your chats</h1>
            {chatsWithUsers.map((chat: Groupchat) => (
              <div
                key={chat.id}
                onClick={() => handleChat(chat)}
                className="flex justify-center items-center text-center h-32 rounded-2xl bg-gray-200 border-2 border-gray-800 hover:brightness-50 hover:cursor-pointer my-2 mx-4 text-wrap"
              >
                {chat.users && (
                  <p className="text-xl break-words">
                    {chat.users.map((user: User) => user.firstName).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
  
      <div className="w-9/12">
        <div className="flex-grow ml-3 overflow-y-auto max-h-[70vh] border-4 border-gray-800 py-4">
          {chosenChat && chosenChat.messages && (
            <div>
              {chosenChat.messages.map((message: Message) => {
                let isUserMessage;
                if (messageOfUserForThisChat) {
                  isUserMessage = messageOfUserForThisChat.some(
                    (userMessage) => userMessage.id === message.id
                  );
                }
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-center m-3 px-3">
                      <p className="text-black min-w-16">{message?.user?.firstName}</p>
                      <p className={`ml-2 max-w-2xl ${isUserMessage ? 'text-white' : 'text-white'} bg-[#007AFF] p-3 rounded-xl`}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ml-3">
          <form onSubmit={handleSendMessage} className="flex mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border-2 border-gray-300 rounded-l-lg p-2"
              placeholder="Type your message..."
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatsOverview;
