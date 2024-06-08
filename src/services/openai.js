import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const fixJson = async (brokenJson) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `Fix this JSON: ${brokenJson}. Only return the corrected JSON, with no additional text.` },
    ],
    max_tokens: 500,
  });

  return response.choices[0].message.content.trim();
};
