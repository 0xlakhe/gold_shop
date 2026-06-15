import { ArrowBigRight, MessageCircle, SendHorizonal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { sendMessage } from "../api/assistant";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const refreshMessage = () => {
      setLoading(false);
    };
    refreshMessage();
  }, [refresh]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      setRefresh((p) => p + 1);
      const res = await sendMessage({ message: input, history: messages });
      console.log(res);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
      setInput("");
    } catch (err) {
      console.log(err);
    } finally {
      setRefresh((p) => p + 1);
    }
  };

  return (
    <div>
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full hover:cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={50} />
      </button>
      {isOpen && (
        <div>
          <div className="fixed bottom-24 right-6 w-80 h-96 border rounded-lg bg-stone-800 shadow-xl flex flex-col">
            <div className="m-2">Chat with Assistant</div>
            <hr />
            {messages.length === 0 && (
              <div className="flex-1 overflow-y-auto p-3">Messages</div>
            )}
            {messages.length > 0 && !loading && (
              <div>
                {messages.map((msg) => {
                  return <div>{msg.content}</div>;
                })}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={handleSubmit} disabled={loading}>
                <SendHorizonal />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
