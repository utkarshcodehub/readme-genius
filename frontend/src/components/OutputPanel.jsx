import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

const codeRenderer = ({ children, className, ...props }) => {
  const match = /language-(\w+)/.exec(className || "")
  return match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
      customStyle={{
        background: "#0d0d1a",
        border: "1px solid #1a1a2e",
        borderRadius: 8,
        fontSize: "0.8rem",
        margin: "0.75rem 0",
      }}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code
      className={className}
      style={{
        background: "#1a1a2e",
        color: "#00ff88",
        padding: "0.1rem 0.4rem",
        borderRadius: 3,
        fontSize: "0.8rem",
      }}
      {...props}
    >
      {children}
    </code>
  )
}

const Empty = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "1rem",
    }}
  >
    <pre style={{ color: "#1a1a2e", fontSize: "0.65rem", lineHeight: 1.3, textAlign: "center", userSelect: "none" }}>{
`██████╗ ███████╗ █████╗ ██████╗ ███╗   ███╗███████╗
██╔══██╗██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝
██████╔╝█████╗  ███████║██║  ██║██╔████╔██║█████╗  
██╔══██╗██╔══╝  ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝  
██║  ██║███████╗██║  ██║██████╔╝██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝`
    }</pre>
    <p style={{ color: "#2a2a4a", fontSize: "0.8rem" }}>fill in your project details → generate</p>
  </div>
)

export default function OutputPanel({ markdown, streaming, done, error }) {
  const [raw, setRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasContent = markdown || error

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Toolbar */}
      {hasContent && (
        <div
          style={{
            borderBottom: "1px solid #1a1a2e",
            padding: "0.5rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            background: "#080810",
          }}
        >
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {["preview", "raw"].map(tab => (
              <button
                key={tab}
                onClick={() => setRaw(tab === "raw")}
                style={{
                  padding: "0.2rem 0.75rem",
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.72rem",
                  background: (tab === "raw") === raw ? "#1a1a2e" : "transparent",
                  color: (tab === "raw") === raw ? "#00ff88" : "#404070",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {streaming && (
              <span style={{ color: "#ffb347", fontSize: "0.72rem" }}>
                ⟳ streaming
              </span>
            )}
            {done && (
              <button
                onClick={copy}
                style={{
                  padding: "0.25rem 0.9rem",
                  borderRadius: 4,
                  border: "1px solid #1a1a2e",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.72rem",
                  background: copied ? "rgba(0,255,136,0.1)" : "transparent",
                  color: copied ? "#00ff88" : "#404070",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ copied" : "copy markdown"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
        {!hasContent && <Empty />}

        {error && (
          <div
            style={{
              background: "rgba(255,50,80,0.08)",
              border: "1px solid rgba(255,50,80,0.2)",
              borderRadius: 8,
              padding: "1rem",
              color: "#ff5060",
              fontSize: "0.875rem",
            }}
          >
            ✗ {error}
          </div>
        )}

        {markdown && !raw && (
          <div className="md">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ code: codeRenderer }}
            >
              {markdown}
            </ReactMarkdown>
            {streaming && <span className="cursor" style={{ color: "#00ff88" }}>▋</span>}
          </div>
        )}

        {markdown && raw && (
          <pre
            style={{
              color: "#9090b8",
              fontSize: "0.8rem",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {markdown}
            {streaming && <span className="cursor" style={{ color: "#00ff88" }}>▋</span>}
          </pre>
        )}
      </div>
    </div>
  )
}
