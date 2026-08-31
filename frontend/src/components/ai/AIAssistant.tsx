import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  X,
  Minimize2,
} from "lucide-react";
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

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    if ((part.startsWith("**") && part.endsWith("**")) ||
        (part.startsWith("__") && part.endsWith("__"))) {
      return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }

    if ((part.startsWith("*") && part.endsWith("*")) ||
        (part.startsWith("_") && part.endsWith("_"))) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return <span key={index}>{part}</span>;
  });
}

function renderMarkdown(text: string) {
  return text.replace(/\r\n/g, "\n").split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) return <div key={index} className="h-2" />;

    if (trimmed.startsWith("### ")) {
      return <h3 key={index} className="mb-1 mt-2 font-bold">{renderInlineMarkdown(trimmed.slice(4))}</h3>;
    }

    if (trimmed.startsWith("## ")) {
      return <h2 key={index} className="mb-1 mt-2 text-base font-bold">{renderInlineMarkdown(trimmed.slice(3))}</h2>;
    }

    if (trimmed.startsWith("# ")) {
      return <h1 key={index} className="mb-2 text-lg font-bold">{renderInlineMarkdown(trimmed.slice(2))}</h1>;
    }

    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      return <hr key={index} className="my-2 border-border" />;
    }

    const bullet = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      return (
        <div key={index} className="flex gap-2 leading-6">
          <span className="shrink-0">•</span>
          <span>{renderInlineMarkdown(bullet[1])}</span>
        </div>
      );
    }

    const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numbered) {
      return (
        <div key={index} className="flex gap-2 leading-6">
          <span className="shrink-0 font-medium">{numbered[1]}.</span>
          <span>{renderInlineMarkdown(numbered[2])}</span>
        </div>
      );
    }

    return <p key={index} className="mb-1 leading-6 last:mb-0">{renderInlineMarkdown(trimmed)}</p>;
  });
}

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
  const [isOpen, setIsOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
        text: "Sorry, I couldn't connect to the AI service. Please make sure the VyaparAI backend is running.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating AI Chat Panel */}
      {isOpen && (
        <div
          className="
            fixed
            bottom-24
            right-4
            z-50
            flex
            w-[calc(100vw-2rem)]
            max-w-[390px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-surface
            shadow-2xl
            sm:right-6
          "
          style={{
            height: "min(560px, calc(100vh - 120px))",
          }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Sparkles size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-text-primary">
                  VyaaparAI Assistant
                </h2>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-xs text-text-secondary">
                    Ask about your business
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize AI Assistant"
                title="Minimize"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
              >
                <Minimize2 size={17} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
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
                    className={`flex max-w-[88%] gap-2.5 rounded-2xl px-3.5 py-3 ${
                      message.role === "assistant"
                        ? "bg-surface-2 text-text-primary"
                        : "bg-primary text-white"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot
                        size={18}
                        className="mt-0.5 shrink-0"
                      />
                    ) : (
                      <User
                        size={18}
                        className="mt-0.5 shrink-0"
                      />
                    )}

                    <div className="text-sm leading-6">
                      {message.role === "assistant" ? (
                        renderMarkdown(message.text)
                      ) : (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2.5 rounded-2xl bg-surface-2 px-3.5 py-3 text-text-primary">
                    <Bot size={18} />
                    <p className="text-sm">🤖 AI is thinking...</p>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !input && (
            <div className="shrink-0 border-t border-border bg-surface px-4 py-3">
              <p className="mb-2 text-xs font-medium text-text-secondary">
                Try asking
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => useSuggestion(item)}
                    className="
                      shrink-0
                      rounded-full
                      border
                      border-border
                      bg-surface-2
                      px-3
                      py-1.5
                      text-xs
                      text-text-primary
                      transition
                      hover:border-primary
                      hover:bg-primary
                      hover:text-white
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex shrink-0 gap-2 border-t border-border bg-surface p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask VyaaparAI..."
              disabled={loading}
              className="
                min-w-0
                flex-1
                rounded-xl
                border
                border-border
                bg-surface-2
                px-3.5
                py-2.5
                text-sm
                text-text-primary
                outline-none
                placeholder:text-text-secondary
                focus:border-primary
                focus:ring-2
                focus:ring-primary/20
                disabled:opacity-60
              "
            />

            <button
              type="button"
              disabled={loading || !input.trim()}
              onClick={sendMessage}
              aria-label="Send message"
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={
          isOpen ? "Close VyaaparAI Assistant" : "Open VyaaparAI Assistant"
        }
        title="VyaaparAI Assistant"
        className="
          fixed
          bottom-6
          right-4
          z-50
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-primary
          text-white
          shadow-xl
          ring-4
          ring-primary/10
          transition
          duration-200
          hover:scale-105
          hover:shadow-2xl
          active:scale-95
          sm:right-6
        "
      >
        {isOpen ? <X size={24} /> : <Sparkles size={25} />}
      </button>
    </>
  );
}
