type ClaudeMessage = {
  role: string;
  content: string;
};

type ClaudeResponse = {
  content: { text: string }[];
  error?: string;
};

export const postClaudeMessages = async (
  messages: ClaudeMessage[],
  maxTokens = 4000,
): Promise<string> => {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, max_tokens: maxTokens }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed (${response.status}): ${text}`);
  }

  const data: ClaudeResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.content?.[0]?.text) {
    throw new Error("Invalid response from API");
  }

  return data.content[0].text;
};
