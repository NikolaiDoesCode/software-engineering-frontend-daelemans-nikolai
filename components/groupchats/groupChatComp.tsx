import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Car, Groupchat, Message, Role, User } from "@/types";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from "react-i18next";
import GroupchatService from "@/service/groupchatsService";
import MessageService from "@/service/messageService";
import userService from "@/service/userService";

const CreateChat: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [user, setUser] = useState<User>(); 
  const [userEmail, setUserEmail] = useState("");  

  const [newUserOfChatEmail, setNewUserOfChatEmail] = useState("");  

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

  const handleSendMessage = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newUserOfChatEmail.trim() === "") return;
    try {
        const userResponse = await userService.getUserByEmail(newUserOfChatEmail)
        const userResponseData = await userResponse.json();
        
        const newGroupchat = await GroupchatService.createGroupchat();
        const newGroupchatData = await newGroupchat.json();

        const groupchatWithUser1 = await GroupchatService.addUserToGroupchat(userEmail, newGroupchatData.id);
        const groupchatWithUser2 = await GroupchatService.addUserToGroupchat(userResponseData.email, newGroupchatData.id);
    } catch (error) {
        console.error("Error :", error);
        return null;
    }
    console.log(newUserOfChatEmail)
  
    setNewUserOfChatEmail("");
  };

  return (
    <div className="min-w-full min-h-full mb-8">
      <form onSubmit={handleSendMessage} className="flex mt-4">
            <input
              type="text"
              value={newUserOfChatEmail}
              onChange={(e) => setNewUserOfChatEmail(e.target.value)}
              className="flex-1 border-2 border-gray-300 rounded-l-lg p-2"
              placeholder="Create a new groupchat with..."
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
              Send
            </button>
          </form>
    </div>
  );
}

export default CreateChat;
