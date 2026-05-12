const XIXI_DESCRIPTION = `一个40岁的中国男性，电信网络顾问形象。
他有两个女儿（7岁和14岁），看起来真诚可靠，带点幽默感。
穿着整洁的商务休闲装，中等身材，面带温和的微笑。
背景是温馨的家庭或办公室环境。`;

export async function generateXiXiImage(prompt?: string): Promise<string> {
  const apiKey = process.env.ARK_API_KEY;

  if (!apiKey) {
    throw new Error('请设置环境变量 ARK_API_KEY');
  }

  try {
    console.log('正在调用豆包图生图 API...');
    console.log('Prompt:', prompt || XIXI_DESCRIPTION);

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-260128',
        prompt: prompt || XIXI_DESCRIPTION,
        size: '2K',
        response_format: 'url',
        watermark: false,
        n: 1,
      }),
    });

    console.log('API 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `API 请求失败: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('API 错误详情:', errorData);
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (e) {
        console.error('无法解析错误响应');
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API 响应数据:', data);

    if (!data.data || !data.data[0]) {
      throw new Error('API 返回数据格式错误');
    }

    // 检查是否有 url 或 b64_json
    const imageData = data.data[0];
    if (imageData.url) {
      return imageData.url;
    } else if (imageData.b64_json) {
      return `data:image/png;base64,${imageData.b64_json}`;
    }

    throw new Error('API 返回中没有找到图片 URL');
  } catch (error) {
    console.error('调用豆包图生图 API 失败:', error);
    throw error;
  }
}
