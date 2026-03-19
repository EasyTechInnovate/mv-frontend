import React, { useEffect, useRef, useState } from "react";

const CHAT_URL =
  "https://n8n.seyreon.com/webhook/f090ba98-678a-4a71-b119-26190f16ab6b/chat";

const SESSION_DURATION = 5 * 60 * 1000;
const WARNING_TIME = 4 * 60 * 1000;
const COOLDOWN_DURATION = 5 * 60 * 1000;

const INITIAL_MESSAGE = {
  role: "bot",
  content:
    "Hello 👋 I’m your Mahi AI assistant. I am here to help you with your music Journey.",
};

const WARNING_MESSAGE = {
  role: "bot",
  content: "Hey, the chat window will close in 1 minute.",
};

const CLOSE_MESSAGE = {
  role: "bot",
  content:
    "5 minutes are completed, so now you can chat here for further details:\nhttps://chatgpt.com/g/g-6967a747227c81918462a107fd3d9ab6-maheshwari-visuals",
};

export default function ChatSection() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatLocked, setChatLocked] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState(null);

  const messagesRef = useRef(null);
  const isUserAtBottomRef = useRef(true);

  const warningQueued = useRef(false);
  const closingQueued = useRef(false);

  const warningTimer = useRef(null);
  const closingTimer = useRef(null);

  const sessionStartRef = useRef(null);

  const sessionIdRef = useRef(
    localStorage.getItem("n8n-chat-session") || crypto.randomUUID(),
  );

  useEffect(() => {
    localStorage.setItem("n8n-chat-session", sessionIdRef.current);
  }, []);

  const handleScroll = () => {
    const el = messagesRef.current;
    if (!el) return;

    const threshold = 40;

    isUserAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  useEffect(() => {
    const el = messagesRef.current;
    if (!el || !isUserAtBottomRef.current) return;

    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const addBotMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const startSessionTimers = () => {
    sessionStartRef.current = Date.now();

    warningTimer.current = setTimeout(() => {
      if (loading) {
        warningQueued.current = true;
      } else {
        addBotMessage(WARNING_MESSAGE);
      }
    }, WARNING_TIME);

    closingTimer.current = setTimeout(() => {
      if (loading) {
        closingQueued.current = true;
      } else {
        addBotMessage(CLOSE_MESSAGE);
      }

      setChatLocked(true);
      setCooldownEnd(Date.now() + COOLDOWN_DURATION);
    }, SESSION_DURATION);
  };

  const processQueuedMessages = () => {
    if (warningQueued.current) {
      warningQueued.current = false;
      addBotMessage(WARNING_MESSAGE);
    }

    if (closingQueued.current) {
      closingQueued.current = false;
      addBotMessage(CLOSE_MESSAGE);
    }
  };

  const extractBotReply = (responseData) => {
    try {
      if (responseData?.data?.[0]?.output) return responseData.data[0].output;
      if (responseData?.output) return responseData.output;
      if (responseData?.message) return responseData.message;
      if (responseData?.text) return responseData.text;
      if (typeof responseData === "string") return responseData;

      return JSON.stringify(responseData);
    } catch {
      return "⚠️ Error reading response.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    if (chatLocked) {
      if (Date.now() >= cooldownEnd) {
        setChatLocked(false);
        startSessionTimers();
      } else {
        addBotMessage({
          role: "bot",
          content: "You need to wait for 5 minutes to be able to chat again here.",
        });
        return;
      }
    }

    if (!sessionStartRef.current) {
      startSessionTimers();
    }

    setLoading(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: sessionIdRef.current,
          chatInput: userText,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const botReply = extractBotReply(data);

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Chat error:", error);

      addBotMessage({
        role: "bot",
        content: "⚠️ Connection issue. Please try again.",
      });
    } finally {
      setLoading(false);

      processQueuedMessages();
    }
  };

  const resetChat = () => {
    const newSession = crypto.randomUUID();

    sessionIdRef.current = newSession;
    localStorage.setItem("n8n-chat-session", newSession);

    clearTimeout(warningTimer.current);
    clearTimeout(closingTimer.current);

    warningQueued.current = false;
    closingQueued.current = false;

    sessionStartRef.current = null;

    setChatLocked(false);
    setCooldownEnd(null);

    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setLoading(false);

    requestAnimationFrame(() => {
      if (messagesRef.current) messagesRef.current.scrollTop = 0;
    });
  };

  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600 break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mahi AI Assistant</h1>
          <p className="text-muted-foreground mt-1 ">
            When prospects reach out, speed determines whether the opportunity moves forward or disappears. 
            This AI assistant responds instantly, answers questions, and guides toward the next step.
          </p>
        </div>
      </div>

      {/* Main Chat Area matching Dashboard Cards */}
      <div className="flex flex-col relative w-full h-[70vh] min-h-[500px] border border-border bg-card text-card-foreground shadow-sm rounded-xl overflow-hidden">
        
        {/* Chat header (internal) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-sm">
              <img src="MahiAI.jpeg" alt="M" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-foreground">
                Mahi AI Assistant 
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                Online • Responds instantly
              </div>
            </div>
          </div>

          <button
            className="w-8 h-8 rounded-full bg-background border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground flex items-center justify-center hover:-rotate-180 duration-300"
            onClick={resetChat}
            title="Reset Chat"
          >
            ↻
          </button>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scroll"
          ref={messagesRef}
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col gap-1.5 w-full ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-end gap-2 max-w-[80%] md:max-w-[70%]">
                {msg.role === "bot" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0 mb-1">
                    <img src="MahiAI.jpeg" alt="M" className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className={`py-3 px-4 leading-[1.6] text-[0.95rem] ${
                    msg.role === "bot"
                      ? "bg-muted text-foreground rounded-2xl rounded-bl-sm border border-border/50"
                      : "bg-[#711CE9] text-white rounded-2xl rounded-br-sm shadow-sm"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start gap-1.5 w-full">
              <div className="flex items-end gap-2 max-w-[80%] md:max-w-[70%]">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0 mb-1">
                  <img src="MahiAI.jpeg" alt="M" className="w-full h-full object-cover" />
                </div>
                <div
                  className="py-3 px-4 leading-[1.6] text-[0.95rem] bg-muted text-muted-foreground italic rounded-2xl rounded-bl-sm border border-border/50 animate-pulse"
                >
                  Thinking…
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-border bg-card/80 flex gap-3 items-center">
          <input
            className="flex-1 px-4 py-3 rounded-md border border-input bg-background text-foreground outline-none focus:ring-1 focus:ring-[#711CE9] focus:border-[#711CE9] transition-all text-[0.95rem] placeholder:text-muted-foreground"
            placeholder="Ask ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            className="px-6 py-3 rounded-md border-none bg-[#711CE9] text-white font-medium hover:bg-[#5a16ba] transition-all shadow-sm active:scale-95 disabled:opacity-70"
            onClick={sendMessage}
            disabled={loading || chatLocked}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}