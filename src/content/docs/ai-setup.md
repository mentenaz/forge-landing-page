Forge Super has no AI service of its own, and it does not use Zed's. Nothing AI-related is switched on and nothing is sent anywhere until you connect a provider you choose, with your own account or key. This page shows how.

There are two separate things to set up, and you can use either, both, or neither:

- **The agent**: chat, the inline assistant, commit messages and thread summaries. These need a language model.
- **Edit predictions**: suggestions that appear as you type, accepted with `Tab`. These need an edit prediction provider.

Both are off at first. To remove AI from the interface completely, set `"disable_ai": true` in your settings.

## The agent

### 1. Open Agent Settings

Open the command palette and run **agent: open settings**, or open Settings and go to **AI** > **LLM Providers**.

### 2. Add a provider

Pick the provider you have an account with and enter your API key. Keys saved here are stored in your system keychain and are not written to `settings.json`.

Supported providers include Anthropic, OpenAI, Google AI, Mistral, DeepSeek, xAI, OpenRouter, OpenCode and Amazon Bedrock, plus local servers (see below) and any OpenAI-compatible endpoint.

If you prefer environment variables, these are read when Forge Super starts and take precedence over a saved key:

| Provider  | Environment variable                                  |
| --------- | ----------------------------------------------------- |
| Anthropic | `ANTHROPIC_API_KEY`                                   |
| OpenAI    | `OPENAI_API_KEY`                                      |
| Google AI | `GEMINI_API_KEY`, falling back to `GOOGLE_AI_API_KEY` |
| Mistral   | `MISTRAL_API_KEY`                                     |
| DeepSeek  | `DEEPSEEK_API_KEY`                                    |
| xAI       | `XAI_API_KEY`                                         |
| OpenRouter | `OPENROUTER_API_KEY`                                |

### 3. Choose a model

Open the Agent Panel and pick a model from its model dropdown. Models from every provider you have set up are listed.

To make one the default for new threads, add it to your settings:

```json
{
  "agent": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4"
    }
  }
}
```

The `provider` is the provider's id, for example `anthropic`, `openai`, `google` or `ollama`. If it is not set, the agent asks you to pick a model.

### A provider with its own URL (OpenAI-compatible)

For a gateway or any service that speaks the OpenAI API, use **Add Provider** in **LLM Providers**, or add it to your settings:

```json
{
  "language_models": {
    "openai_compatible": {
      "my-provider": {
        "api_url": "https://example.com/v1",
        "available_models": [
          {
            "name": "my-model",
            "display_name": "My Model",
            "max_tokens": 128000
          }
        ]
      }
    }
  }
}
```

The key for it is read from `MY_PROVIDER_API_KEY` (the provider name in upper case, with `-` as `_`), or can be entered in the provider's section in Agent Settings.

### Running a model on your own machine

Nothing leaves your computer with a local model. Forge Super finds the models a local server is serving:

| Server    | Default address            |
| --------- | -------------------------- |
| Ollama    | `http://localhost:11434`   |
| LM Studio | `http://localhost:1234/api/v0` |
| llama.cpp | `http://localhost:8080`    |

Start the server, then pick one of its models from the model dropdown. To use a different address, set `api_url` for that provider under `language_models` in your settings.

### Agents with their own account

Agents such as Claude, Codex, Copilot and Cursor can be added from the **External Agents** page of Agent Settings. They run in their own process and use their own login and billing, so they need no provider set up here.

## Edit predictions

Edit predictions are off by default (`"provider": "none"`). Choose a provider in **Settings**: search for **Edit Predictions** and open **Configure Providers**. The providers are:

| Provider | What you need |
| --- | --- |
| GitHub Copilot | A Copilot subscription. Sign in with the device code flow. |
| Codestral | A Codestral API key from Mistral. |
| Mercury Coder | An API key from Inception Labs. |
| Ollama | A local Ollama server and a code model. |
| OpenAI-compatible | Any server that implements `/v1/completions`. |

You can also set the provider in your settings file:

```json
{
  "edit_predictions": {
    "provider": "copilot"
  }
}
```

The value is one of `none`, `copilot`, `codestral`, `mercury`, `ollama` or `open_ai_compatible_api`.

A provider shows up in the edit prediction menu once it is ready to use: Copilot after you sign in, Codestral and Mercury after you add a key, and Ollama or an OpenAI-compatible server once it is configured. A suggestion is accepted with `Tab`.

### Local edit predictions

```json
{
  "edit_predictions": {
    "provider": "ollama",
    "ollama": {
      "api_url": "http://localhost:11434",
      "model": "qwen2.5-coder:7b-base",
      "prompt_format": "infer",
      "max_output_tokens": 512
    }
  }
}
```

For another server, set `"provider": "open_ai_compatible_api"` and give it an `api_url` that ends in `/v1/completions`, plus a `model`. `prompt_format` tells Forge Super how to lay out the code for that model; `infer` works it out from the model name.

## What is sent where

Only to the provider you set up, and only when you use the feature. Forge Super itself sends nothing to Mentenaz or to Zed for AI, and telemetry is off by default. A provider's own terms and data handling apply to what you send it.
