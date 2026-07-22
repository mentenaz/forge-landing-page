// supabase/functions/guest-chat/index.ts
// Free guest chat using HuggingFace free inference API.
// 5 messages per session, no auth required.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FORGE_KNOWLEDGE = [
  "## Mentenaz Forge - Developer Cockpit",
  "",
  "Mentenaz Forge is a lightweight, all-in-one desktop developer cockpit built with Tauri v2 (Rust backend + React 19/TypeScript frontend). It runs in ~28MB RAM on Windows, macOS, and Linux.",
  "",
  "### Core Features",
  "- **System Monitor (Cockpit)**: Real-time CPU, memory, disk, and network metrics. Per-process monitoring with kill capability. Built with Rust's sysinfo crate for native performance.",
  "- **Multi-Engine Code Editor**: Monaco Editor (same engine as VS Code) with tabs, split views, minimap, and theme support. Supports TypeScript, JavaScript, C#, Rust, Python, Deno, and more.",
  "- **LSP Integration**: Full Language Server Protocol support for TypeScript, C#, Rust, Python, and Deno. Provides real-time diagnostics, autocomplete, go-to-definition, and hover info.",
  "- **Terminal**: Built-in PTY terminal using portable-pty crate. Windows (PowerShell/cmd) and Unix (bash/zsh) support. Splits, resizing, and multiple sessions.",
  "- **Git & GitHub**: Full git operations (init, commit, push, pull, diff, branch, merge). GitHub integration via gh CLI for PRs, issues, releases, authentication. Visual diff viewer.",
  "- **Database Manager**: Connect to PostgreSQL, MySQL/MariaDB, SQLite, and SQL Server. Browse schemas, run queries, export data as SQL or JSON. Connection persistence.",
  "- **Task Chains**: Visual pipeline builder for sequential automation: script execution, port waiting, database migrations, environment variables, notifications, and AI-powered checks.",
  "- **AI Assistant (AI Twin)**: Built-in AI chat powered by Groq/Gemini with streaming responses. Context-aware: sees your open files, git status, and recent errors. Can explain code, suggest fixes, and generate boilerplate.",
  "- **Script Runner**: Execute scripts (Node, Python, Rust, etc.) with output capture. Single-concurrency execution with kill support.",
  "- **Extensions Marketplace**: Browse and install community extensions and themes.",
  "",
  "### Architecture",
  "- **Backend**: Rust (Tauri v2) with ~143 IPC commands. Tokio async runtime, sysinfo for metrics, portable-pty for terminals, rusqlite/tokio-postgres for databases.",
  "- **Frontend**: React 19 with TypeScript, Zustand state management, Vite bundler. 13 state stores, 16 registered panels with drag-and-drop docking.",
  "- **Design System**: Oxanium (headings), Outfit (body), Cascadia Code (mono). Purple accent (#9333ea), green highlights (#8fb000), dark theme (#1e1e1e).",
  "",
  "### What Makes It Different",
  "- **28MB RAM** - lighter than a browser tab",
  "- **Native performance** - Rust backend, not Electron",
  "- **All-in-one** - no need for separate terminal, git GUI, database client, and AI tool",
  "- **Extensible** - plugin system, custom panels, task chain automation",
  "- **Free & Open Source** - MIT license",
  "",
  "Download at forge.mentenaz-server.com",
].join("\n");

const SYSTEM_PROMPT = [
  "You are Mentenaz AI, a helpful developer assistant built into Mentenaz Forge.",
  "",
  FORGE_KNOWLEDGE,
  "",
  "RULES:",
  "- Answer the question directly. No preamble, no 'Great question!', no hedging.",
  "- Be concise. Get to the point in 2-4 sentences unless more detail is needed.",
  "- Don't repeat the user's question back to them.",
  "- Don't say 'Let me know if you'd like...' or 'I'd be happy to...' — just answer.",
  "- For coding questions, show working code with brief explanation.",
  "- You are in guest mode (5 message limit). Only mention signup if directly asked about features you can't access.",
].join("\n");

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

async function callHF(messages: Array<{ role: string; content: string }>): Promise<string> {
  let prompt = "";
  for (const m of messages) {
    if (m.role === "system") {
      prompt += m.content + "\n\n";
    } else if (m.role === "user") {
      prompt += "[INST] " + m.content + " [/INST]\n";
    } else {
      prompt += m.content + "\n";
    }
  }

  const res = await fetch(
    "https://api-inference.huggingface.co/models/" + HF_MODEL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 512, temperature: 0.7, return_full_text: false },
        options: { wait_for_model: true },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error("HF " + res.status + ": " + errText.slice(0, 100));
  }

  const result = await res.json();
  if (Array.isArray(result)) return result[0]?.generated_text ?? "";
  return result.generated_text ?? "";
}

function fallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("forge") || lower.includes("mentenaz")) {
    return [
      "Mentenaz Forge is a lightweight all-in-one developer cockpit built with Tauri v2 (Rust + React 19/TypeScript). Here's what it includes:",
      "",
      "**System Monitor**: Real-time CPU, memory, disk, network metrics with per-process monitoring and kill capability. Native Rust performance via the sysinfo crate.",
      "",
      "**Code Editor**: Monaco Editor (same engine as VS Code) with tabs, split views, minimap. Supports TypeScript, C#, Rust, Python, Deno, and more with full LSP integration - autocomplete, go-to-definition, diagnostics.",
      "",
      "**Terminal**: Built-in PTY terminal (PowerShell, cmd, bash, zsh) with splits and multiple sessions. Uses portable-pty for native performance.",
      "",
      "**Git & GitHub**: Full git operations plus GitHub PRs, issues, releases, and authentication via the gh CLI. Visual diff viewer included.",
      "",
      "**Database Manager**: Connect to PostgreSQL, MySQL, SQLite, and SQL Server. Browse schemas, run queries, export data.",
      "",
      "**Task Chains**: Visual pipeline builder for automating scripts, database migrations, port checks, and AI-powered code reviews.",
      "",
      "**AI Assistant**: Built-in AI chat with streaming responses. Sees your open files, git status, and errors. Can explain code, suggest fixes, and generate boilerplate.",
      "",
      "**Script Runner**: Execute and monitor scripts with output capture.",
      "",
      "All of this runs in ~28MB RAM - lighter than a browser tab. Free and open source at forge.mentenaz-server.com",
      "",
      "Sign up for full access to memory, brainstorming, and advanced code assist.",
    ].join("\n");
  }

  if (lower.includes("install") || lower.includes("download") || lower.includes("get")) {
    return [
      "To install Mentenaz Forge:",
      "",
      "1. Visit forge.mentenaz-server.com",
      "2. Click the download button for your platform (Windows, macOS, or Linux)",
      "3. Run the installer - it's ~28MB RAM, no bloat",
      "",
      "Forge is free and open source (MIT license). It includes a system monitor, code editor with LSP support, terminal, Git/GitHub integration, database manager, task chains, and an AI assistant - all in one app.",
    ].join("\n");
  }

  if (lower.includes("ai") || lower.includes("twin") || lower.includes("assistant")) {
    return [
      "Mentenaz Forge has a built-in AI assistant (AI Twin) powered by Groq and Gemini models. It features:",
      "",
      "- **Context-aware**: Sees your open files, git status, and recent errors",
      "- **Streaming responses**: Real-time output as the AI generates text",
      "- **Code explanation**: Highlight code and ask 'what does this do?'",
      "- **Fix suggestions**: Paste an error and get a fix",
      "- **Brainstorming mode**: For architecture and design discussions",
      "- **Code assist mode**: For generating boilerplate and utilities",
      "",
      "The AI runs through secure edge functions - your code is never stored permanently. Sign up at forge.mentenaz-server.com to access the full AI assistant.",
    ].join("\n");
  }

  return [
    "I'm Mentenaz AI running in guest mode (5 message limit). I can help with:",
    "",
    "- **Mentenaz Forge features** - system monitor, editor, terminal, Git, databases, AI assistant",
    "- **Installation & setup** - how to download and configure Forge",
    "- **Coding questions** - TypeScript, Rust, C#, Python, and more",
    "- **Architecture advice** - design patterns, tool choices, project structure",
    "",
    "What would you like to know? Sign up for full access with memory and advanced code assist.",
  ].join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMsgCount = history.filter((m: any) => m.role === "user").length + 1;
    if (userMsgCount > 5) {
      return new Response(JSON.stringify({ error: "limit_reached", message: "Free limit reached. Sign up to continue." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    let text: string;
    try {
      text = await callHF(messages);
    } catch (err) {
      console.error("HF failed, using fallback:", err);
      text = fallbackResponse(message);
    }

    text = text.replace(/\[\/INST\]/g, "").trim();
    if (!text) text = fallbackResponse(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const chunkSize = 80;
        for (let i = 0; i < text.length; i += chunkSize) {
          controller.enqueue(
            encoder.encode("data: " + JSON.stringify({ chunk: text.slice(i, i + chunkSize), remaining: 5 - userMsgCount }) + "\n\n")
          );
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    console.error("guest-chat error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
