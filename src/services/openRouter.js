class OpenRouterService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1/chat/completions';
    this.siteURL = import.meta.env.VITE_SITE_URL;
    this.siteName = import.meta.env.VITE_SITE_NAME;
  }

  async sendMessage(messages, customDataset = null) {
    try {
      let systemMessage = "You are a helpful AI assistant.";
      
      if (customDataset) {
        systemMessage = `You are a helpful AI assistant. Use the following custom dataset to answer questions: ${customDataset}`;
      }

      const messagesWithSystem = [
        { role: 'system', content: systemMessage },
        ...messages
      ];

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': this.siteURL,
          'X-Title': this.siteName,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2:free',
          messages: messagesWithSystem,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error sending message to OpenRouter:', error);
      throw error;
    }
  }

  async streamMessage(messages, customDataset = null, onChunk) {
    try {
      let systemMessage = "You are a helpful AI assistant.";
      
      if (customDataset) {
        systemMessage = `You are a helpful AI assistant. Use the following custom dataset to answer questions: ${customDataset}`;
      }

      const messagesWithSystem = [
        { role: 'system', content: systemMessage },
        ...messages
      ];

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': this.siteURL,
          'X-Title': this.siteName,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2:free',
          messages: messagesWithSystem,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming message from OpenRouter:', error);
      throw error;
    }
  }
}

export const openRouterService = new OpenRouterService();
