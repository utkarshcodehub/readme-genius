import { useState } from "react"
import InputPanel from "./components/InputPanel"
import OutputPanel from "./components/OutputPanel"

const API = "http://localhost:8000"

export default function App() {
  const [markdown, setMarkdown] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const generate = async (data) => {
    setMarkdown("")
    setError("")
    setDone(false)
    setStreaming(true)

    try {
      const res = await fetch(`${API}/generate-readme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)

      const reader = res.body.getReader()
      const dec = new TextDecoder()

      while (true) {
        const { done: d, value } = await reader.read()
        if (d) break
        setMarkdown(prev => prev + dec.decode(value, { stream: true }))
      }
      setDone(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div
      className="grid-bg flex flex-col"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #1a1a2e",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            className="glow"
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88" }}
          />
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
              color: "#ddddf0",
            }}
          >
            README<span style={{ color: "#00ff88" }}>.</span>GENIUS
          </span>
        </div>
        <span style={{ color: "#3a3a5c", fontSize: "0.72rem" }}>
          llama-3.3-70b · groq
        </span>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <InputPanel onGenerate={generate} streaming={streaming} />
        <OutputPanel
          markdown={markdown}
          streaming={streaming}
          done={done}
          error={error}
        />
      </div>
    </div>
  )
}
