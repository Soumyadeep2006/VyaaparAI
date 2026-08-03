import { useState } from "react";
import { Bot, Send } from "lucide-react";

import Card from "../common/Card";
import api from "../../api/axios";

interface AIResponse {
  response?: string;
  error?: string;
}

export default function AIInsight() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    const question = prompt.trim();

    if (!question || loading) {
      return;
    }

    try {
      setLoading(true);
      setResponse("");

      const res = await api.post<AIResponse>(
        "/api/ai/chat",
        {
          prompt: question,
        }
      );

      if (res.data.error) {
        setResponse(`Error: ${res.data.error}`);
        return;
      }

      setResponse(
        res.data.response || "No response received."
      );
    } catch (error: any) {
      console.error("AI request failed:", error);

      setResponse(
        error?.response?.data?.detail ||
          "Unable to connect to VyaparAI Assistant."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      askAI();
    }
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3">
          <Bot className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h2 className="font-bold text-text-primary">
            AI Business Insight
          </h2>

          <p className="text-sm text-text-secondary">
            Powered by VyaparAI
          </p>
        </div>
      </div>

      {/* AI Response */}
      <div className="mt-5 min-h-[120px] rounded-xl bg-primary/5 p-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            VyaparAI is thinking...
          </div>
        ) : response ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-text-primary">
            {response}
          </p>
        ) : (
          <div className="space-y-3 text-sm text-text-secondary">
            <p>
              Ask VyaparAI about your business.
            </p>

            <p>
              Examples:
            </p>

            <ul className="list-disc space-y-1 pl-5">
              <li>How can I increase my sales?</li>
              <li>What should I do about low stock?</li>
              <li>Give me some business growth ideas.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Ask AI */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(event) =>
            setPrompt(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask VyaparAI..."
          disabled={loading}
          className="min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={askAI}
          disabled={!prompt.trim() || loading}
          className="flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          title="Ask AI"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}