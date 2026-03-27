import type { Message } from '../shared/types'
import { DEFAULT_CONFIG } from '../shared/constants'

export interface StreamCallbacks {
  onChunk: (text: string) => void
  onDone: () => void
  onError: (err: Error) => void
}

export async function sendMessage(
  messages: Message[],
  { onChunk, onDone, onError }: StreamCallbacks
) {
  const url = `${DEFAULT_CONFIG.gatewayUrl}/v1/chat/completions`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(DEFAULT_CONFIG.gatewayToken
          ? { Authorization: `Bearer ${DEFAULT_CONFIG.gatewayToken}` }
          : {}),
      },
      body: JSON.stringify({
        model: DEFAULT_CONFIG.model,
        messages,
        stream: true,
        user: 'lobster-pet',
      }),
    })

    if (!res.ok) {
      onError(new Error(`HTTP ${res.status}: ${res.statusText}`))
      return
    }

    const reader = res.body?.getReader()
    if (!reader) {
      onError(new Error('No readable stream'))
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          onDone()
          return
        }
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) onChunk(content)
        } catch {
          // skip malformed JSON
        }
      }
    }

    onDone()
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)))
  }
}
