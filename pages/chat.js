import React, { useState, useRef, useEffect } from "react";

// Tailwind color mapping for user badges
const userColorMap = {
  primary: "bg-blue-600",
  success: "bg-green-500",
  warning: "bg-yellow-400 text-gray-900",
  info: "bg-cyan-500",
  secondary: "bg-gray-500",
};

const mockUsers = [
  { id: 1, name: "Alice", color: "primary" },
  { id: 2, name: "Bob", color: "success" },
  { id: 3, name: "Charlie", color: "warning" },
];

const mockCurrentUser = mockUsers[0];

const initialMessages = [
  { id: 1, user: mockUsers[1], text: "Hey there! 👋", time: "10:00" },
  { id: 2, user: mockUsers[0], text: "Hi Bob! How are you?", time: "10:01" },
  { id: 3, user: mockUsers[2], text: "Hello everyone!", time: "10:02" },
];

function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [users] = useState(mockUsers);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const now = new Date();
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        user: mockCurrentUser,
        text: input,
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  return (
    <div
      className="min-h-[90vh] bg-gradient-to-br from-slate-50 via-slate-50 to-blue-100 flex items-center justify-center py-8"
    >
      <div className="w-full max-w-6xl px-2 md:px-6">
        <div className="rounded-3xl shadow-2xl bg-white/90 min-h-[75vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white rounded-t-3xl py-6 px-6">
            <div className="flex items-center">
              <span className="font-bold text-2xl md:text-3xl mr-4">💬 Community Chat Room</span>
              <span className="bg-white text-blue-600 font-semibold text-base px-4 py-2 rounded-lg shadow ml-2">
                {users.length} Online
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`mr-2 px-4 py-2 text-base font-semibold rounded-lg ${userColorMap["secondary"]} text-white`}
              >
                {mockCurrentUser.name}
              </span>
              <span className="text-base">You</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col md:flex-row min-h-[60vh]">
            {/* Active Users Sidebar */}
            <div className="hidden md:block border-r bg-slate-50 rounded-bl-3xl min-w-[240px] max-w-[300px]">
              <div className="p-6">
                <h6 className="mb-4 text-gray-500 font-semibold text-lg">Active Users</h6>
                <ul>
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center py-2"
                    >
                      <span
                        className={`mr-3 flex items-center justify-center rounded-full text-white font-bold text-lg ${userColorMap[user.color]}`}
                        style={{ width: 36, height: 36 }}
                      >
                        {user.name.charAt(0)}
                      </span>
                      <span className="font-medium">{user.name}</span>
                      {user.id === mockCurrentUser.id && (
                        <span className="ml-auto bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          You
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <div
                className="flex-1 overflow-auto px-4 py-4"
                style={{
                  background: "linear-gradient(135deg, #f8fafc 60%, #e3f0ff 100%)",
                  borderRadius: "0 0 1.5rem 0",
                  minHeight: "32rem",
                  maxHeight: "65vh",
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${msg.user.id === mockCurrentUser.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl shadow ${msg.user.id === mockCurrentUser.id
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                        } max-w-[70%]`}
                    >
                      <div className="flex items-center mb-1">
                        <span
                          className={`mr-2 flex items-center justify-center rounded-full text-white font-bold text-base ${userColorMap[msg.user.color]}`}
                          style={{ width: 28, height: 28 }}
                        >
                          {msg.user.name.charAt(0)}
                        </span>
                        <span className="font-semibold text-xs">{msg.user.name}</span>
                        <span className="ml-2 text-gray-400 text-xs">{msg.time}</span>
                      </div>
                      <div className="text-base break-words">{msg.text}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {/* Input Form */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t bg-slate-50 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type your message…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={300}
                  autoFocus
                  aria-label="Type your message"
                  className="flex-1 rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`ml-2 px-6 py-2 rounded-xl font-semibold transition-colors ${
                    input.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
