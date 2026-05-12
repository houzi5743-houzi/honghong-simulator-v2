import { generateXiXiImage } from '@/lib/image-api';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const imageUrl = await generateXiXiImage(prompt);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('生成图片失败:', error);
    return new Response(
      JSON.stringify({ error: '服务器错误，请稍后重试' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
