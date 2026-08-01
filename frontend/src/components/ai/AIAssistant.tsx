import { useEffect, useRef, useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { askAI } from "../../api/ai";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const suggestions = [
  "Show today's sales",
  "Low stock products",
  "Top customers",
  "Predict next month's revenue",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "👋 Hello! I am your VyaparAI Assistant. Ask me anything about your business.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await askAI(question);

      const answer =
        data?.response ||
        data?.message ||
        "Sorry, I could not generate a response.";

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI request failed:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          "Sorry, I couldn't connect to the AI service. Please make sure the VyaparAI backend is running.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <Sparkles size={24} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-text-primary">
              AI Business Assistant
            </h1>

            <p className="mt-1 text-text-secondary">
              Ask questions about inventory, billing, customers and reports.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
          <Bot className="text-primary" size={22} />
          Suggested Questions
        </h2>

        <div className="flex flex-wrap gap-3">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => useSuggestion(item)}
              className="rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="h-[500px] space-y-5 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-3xl gap-3 rounded-2xl p-4 ${
                  message.role === "assistant"
                    ? "bg-surface-2 text-text-primary"
                    : "bg-primary text-white"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot
                    size={20}
                    className="mt-1 shrink-0"
                  />
                ) : (
                  <User
                    size={20}
                    className="mt-1 shrink-0"
                  />
                )}

                <p className="whitespace-pre-wrap leading-7">
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-4 text-text-primary">
                <Bot size={20} />
                <p>🤖 AI is thinking...</p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3 border-t border-border bg-surface p-5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask VyaparAI anything..."
            disabled={loading}
            className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-3 text-text-primary outline-none placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
          />

          <button
            type="button"
            disabled={loading || !input.trim()}
            onClick={sendMessage}
            className="flex items-center justify-center rounded-xl bg-primary px-5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}