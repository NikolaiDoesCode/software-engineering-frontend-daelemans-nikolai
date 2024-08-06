import { StatusMessage } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import userService from "@/service/userService";



interface Message {
    text: string;
    sender: "user" | "bot";
  }

const HelpBot: React.FC = () => {
const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function getChats(userMessage: string): Promise<void> {
    
    try {
    setMessages(messages => [...messages, {text: userMessage, sender: "user"}])
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      
  
      console.log(messages)
      const data = await response.json();
      setMessages(messages => [...messages, { text: data.message, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  function toggleCollapsed(): void {
    setCollapsed(!collapsed);
  }

  return (
    <div>
    <div style={{ display: "flex", backgroundColor: "#1F2937", borderRadius: "10px 0 0 0", gap: "2em", justifyContent: "center", boxShadow: "0 0 6px rgba(0,0,0,0.3)" }}>
      <h1 className="text-center text-2xl font-semibold mt-1 bg-grey" style={{ color: "#fff", padding: "10px", textAlign: "center", fontSize: "1.5em" }}>HelpBot</h1>
      <button onClick={toggleCollapsed} style={{ color: "#cfd6e0", fontSize: "14px", cursor: "pointer", marginTop: "5px", marginRight: "50px" }}>button</button>
    </div>
    {collapsed && (
      <div>
        <div style={{ display: "flex", flexDirection: "column", border: "1px solid #1F2937", maxHeight: "300px", overflowY: "scroll" }}>
          <div style={{ backgroundColor: "#e4eaee" }}>
            <div className="messages" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              {messages.map((msg, index) => (
                <p
                  key={index}
                  style={{ 
                    backgroundColor: msg.sender === "bot" ? "#bababa" : "#248bf5",
                    borderRadius: "15px",
                    color: "white",
                    padding: "10px",
                    alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end", 
                    width: "fit-content",
                    maxWidth:"200px",
                    margin: "20px"
                  }}
                >
                  {msg.text}
                </p>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <div className="input" style={{ backgroundColor: "#e4eaee", border: "1px solid #1F2937" }}>
          <input
            id="input"
            placeholder="Type a message..."
            style={{ outline: "unset", backgroundColor: "#e4eaee", borderBottom: "1px solid lightgrey", color: "#5D7185", margin: "20px 10px 20px 20px" }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={() => {
              getChats(inputValue);
              setInputValue("");
            }}
            style={{ backgroundColor: "#1F2937", padding: "5px", borderRadius: "10px", color: "white", marginRight: "20px" }}
          >
            Send
          </button>
        </div>
      </div>
    )}
  </div>
  
  );
}
export default HelpBot;
