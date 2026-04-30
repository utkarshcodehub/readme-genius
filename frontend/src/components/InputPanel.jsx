import { useState } from "react"

const inp = {
  width: "100%",
  background: "#080810",
  border: "1px solid #1a1a2e",
  borderRadius: 6,
  padding: "0.6rem 0.8rem",
  color: "#ddddf0",
  fontSize: "0.85rem",
  fontFamily: "'JetBrains Mono', monospace",
  outline: "none",
  resize: "vertical",
  transition: "border-color 0.2s",
}

const label = {
  display: "block",
  color: "#404070",
  fontSize: "0.68rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: "0.4rem",
}

export default function InputPanel({ onGenerate, streaming }) {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [techInput, setTechInput] = useState("")
  const [stack, setStack] = useState([])
  const [features, setFeatures] = useState("")
  const [code, setCode] = useState("")
  const [showCode, setShowCode] = useState(false)

  const addTech = (e) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault()
      const val = techInput.trim()
      if (!stack.includes(val)) setStack(prev => [...prev, val])
      setTechInput("")
    }
  }

  const submit = () => {
    if (!name.trim() || !desc.trim()) return
    onGenerate({
      project_name: name.trim(),
      description: desc.trim(),
      tech_stack: stack,
      features: features.trim(),
      code_snippets: code.trim(),
    })
  }

  const canSubmit = name.trim() && desc.trim() && !streaming

  return (
    <div
      style={{
        width: "38%",
        minWidth: 300,
        background: "#0d0d1a",
        borderRight: "1px solid #1a1a2e",
        overflowY: "auto",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        flexShrink: 0,
      }}
    >
      {/* Project Name */}
      <div>
        <label style={label}>
          project name <span style={{ color: "#00ff88" }}>*</span>
        </label>
        <input
          style={inp}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="my-awesome-project"
        />
      </div>

      {/* Description */}
      <div>
        <label style={label}>
          description <span style={{ color: "#00ff88" }}>*</span>
        </label>
        <textarea
          style={{ ...inp, minHeight: 90 }}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="What does it do? Who is it for? What problem does it solve?"
        />
      </div>

      {/* Tech Stack */}
      <div>
        <label style={label}>tech stack</label>
        {stack.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
            {stack.map(t => (
              <span
                key={t}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "rgba(0,255,136,0.08)",
                  border: "1px solid rgba(0,255,136,0.2)",
                  color: "#00ff88",
                  padding: "0.15rem 0.55rem",
                  borderRadius: 4,
                  fontSize: "0.75rem",
                }}
              >
                {t}
                <button
                  onClick={() => setStack(prev => prev.filter(x => x !== t))}
                  style={{ background: "none", border: "none", color: "#404070", cursor: "pointer", padding: 0, fontSize: "0.9rem", lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          style={inp}
          value={techInput}
          onChange={e => setTechInput(e.target.value)}
          onKeyDown={addTech}
          placeholder="Type a tech and press Enter (React, FastAPI...)"
        />
      </div>

      {/* Features */}
      <div>
        <label style={label}>
          key features{" "}
          <span style={{ color: "#2a2a4a", textTransform: "none", letterSpacing: 0 }}>optional</span>
        </label>
        <textarea
          style={{ ...inp, minHeight: 70 }}
          value={features}
          onChange={e => setFeatures(e.target.value)}
          placeholder="One feature per line"
        />
      </div>

      {/* Code Snippet toggle */}
      <div>
        <button
          onClick={() => setShowCode(!showCode)}
          style={{
            background: "none",
            border: "none",
            color: "#404070",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontFamily: "'JetBrains Mono', monospace",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <span style={{ color: showCode ? "#00ff88" : "#404070" }}>{showCode ? "▼" : "▶"}</span>
          code snippet{" "}
          <span style={{ color: "#2a2a4a" }}>optional — improves accuracy</span>
        </button>
        {showCode && (
          <textarea
            style={{ ...inp, minHeight: 100, marginTop: "0.5rem", fontSize: "0.78rem" }}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Paste any relevant code (main entry point, key function...)"
          />
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!canSubmit}
        style={{
          padding: "0.75rem",
          borderRadius: 6,
          border: "none",
          cursor: canSubmit ? "pointer" : "not-allowed",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
          fontSize: "0.875rem",
          background: canSubmit ? "#00ff88" : "#1a1a2e",
          color: canSubmit ? "#080810" : "#3a3a5c",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
        }}
      >
        {streaming ? "⟳  generating..." : "⚡  generate readme"}
      </button>
    </div>
  )
}
