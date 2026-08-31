import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  text: string;
}

export default function ChatMessage({
  role,
  text,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[88%] items-start gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Icon */}
        <div
          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-primary text-white"
              : "bg-surface text-text-primary"
          }`}
        >
          {isUser ? <User size={17} /> : <Bot size={17} />}
        </div>

        {/* Message */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
            isUser
              ? "rounded-tr-md bg-primary text-white"
              : "rounded-tl-md bg-muted text-text-primary"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {text}
            </div>
          ) : (
            <div className="break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-3 mt-1 text-lg font-bold">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-2 mt-4 text-base font-bold">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-3 text-sm font-bold">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0">
                      {children}
                    </p>
                  ),

                  strong: ({ children }) => (
                    <strong className="font-bold">
                      {children}
                    </strong>
                  ),

                  ul: ({ children }) => (
                    <ul className="mb-3 ml-5 list-disc space-y-1">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="mb-3 ml-5 list-decimal space-y-1">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li className="pl-1">
                      {children}
                    </li>
                  ),

                  blockquote: ({ children }) => (
                    <blockquote className="my-3 border-l-4 pl-3 italic">
                      {children}
                    </blockquote>
                  ),

                  code: ({
                    className,
                    children,
                    ...props
                  }) => {
                    const isBlock =
                      className?.includes("language-");

                    if (isBlock) {
                      return (
                        <pre className="my-3 overflow-x-auto rounded-lg bg-black/10 p-3 text-xs">
                          <code
                            className={className}
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      );
                    }

                    return (
                      <code
                        className="rounded bg-black/10 px-1.5 py-0.5 text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },

                  table: ({ children }) => (
                    <div className="my-3 w-full overflow-x-auto">
                      <table className="w-full border-collapse text-xs">
                        {children}
                      </table>
                    </div>
                  ),

                  thead: ({ children }) => (
                    <thead className="border-b border-current/20">
                      {children}
                    </thead>
                  ),

                  th: ({ children }) => (
                    <th className="px-3 py-2 text-left font-bold">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="border-t border-current/10 px-3 py-2">
                      {children}
                    </td>
                  ),

                  hr: () => (
                    <hr className="my-4 border-current/20" />
                  ),

                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}