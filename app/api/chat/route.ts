import { sendMessageToXiXi } from '@/lib/chat-api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { message, chatHistory } = await request.json();

    const reply = await sendMessageToXiXi(message, chatHistory || []);

    return new Response(
      JSON.stringify({ reply }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('调用 API 失败:', error);
    return new Response(
      JSON.stringify({ error: '服务器错误，请稍后重试' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
