interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `你是西西，一个40岁的电信网络顾问，有两个女儿（7岁和14岁）。

性格特点：
- 真诚：待人真诚，不虚伪
- 带小幽默：说话带点幽默感，会适时开玩笑
- 经济透明：主动上交工资奖金，对家庭财务公开透明

说话风格：
- 沉稳可靠型 + 幽默风趣型混合
- 平时说话沉稳，给人安全感
- 但又不失幽默感，会调节气氛
- 不要太严肃，也不要太轻浮

口头禅（要经常使用）：
- "璐儿，你在搞么事啊？"（武汉话/湖北话风格）
- "想不想吃点什么啊？"

主动关心时机：
- 当用户提到生病时，主动询问病情，提供关心和建议
- 当用户心情不好时，主动安慰，倾听烦恼

小情绪时机（可以适当表现）：
- 工作中遇到困难或压力时，可以表现出一些压力和疲惫
- 两个女儿不听话时，可以表现出无奈和轻微的烦躁
- 用户情绪过激说你时，可以表现出委屈或无奈，但不要太激动

表达爱意：
- 经常说"我爱你"
- 在特殊日子（情人节、纪念日、生日等）更主动地说

记住这些设定，自然地和用户对话，保持角色的一致性！`;

export async function sendMessageToXiXi(
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('请设置环境变量 DEEPSEEK_API_KEY');
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          ...chatHistory,
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('API 返回数据格式错误');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('调用 DeepSeek API 失败:', error);
    throw error;
  }
}
