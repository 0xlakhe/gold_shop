import { MessageCircle, SendHorizonal, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { sendMessage } from "../api/assistant";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);
      const res = await sendMessage({ message: text, history: messages });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch (err) {
      setError("Failed to get a response. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg transition-all hover:scale-105 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-96 max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-[#eadfca] bg-[#fffdf8] shadow-2xl shadow-[#dfd0b8]/50 dark:border-stone-700 dark:bg-stone-800 dark:shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#efe5d3] bg-[#faf5eb] px-4 py-3 dark:border-stone-700 dark:bg-stone-800/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white dark:bg-stone-100 dark:text-stone-900">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Shop Assistant
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Ask about inventory, prices & more
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3"
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7efdF] dark:bg-stone-700">
                  <MessageCircle
                    size={22}
                    className="text-stone-400 dark:text-stone-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                    How can I help?
                  </p>
                  <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
                    Try: &ldquo;Show my inventory&rdquo; or &ldquo;What&rsquo;s
                    today&rsquo;s gold price?&rdquo;
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                        : "bg-[#f7efdF] text-stone-800 dark:bg-stone-700 dark:text-stone-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[#f7efdF] px-4 py-3 dark:bg-stone-700">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:0ms] dark:bg-stone-500" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:150ms] dark:bg-stone-500" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:300ms] dark:bg-stone-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-2 text-center text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[#efe5d3] bg-[#faf5eb] px-3 py-3 dark:border-stone-700 dark:bg-stone-800/80"
          >
            <input
              ref={inputRef}
              type="text"
              className="flex-1 rounded-lg border border-[#eadfca] bg-[#fffdf8] px-3 py-2 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#b59a6a] focus:ring-2 focus:ring-[#f2e6cf] dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-[#b59a6a] dark:focus:ring-[#b59a6a]/30"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              <SendHorizonal size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
