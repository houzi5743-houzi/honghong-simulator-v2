'use client';

import { useState } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  imageUrl?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '你好！', isUser: true },
    { id: 2, text: '璐儿，你在搞么事啊？你好啊！想不想吃点什么啊？❤️', isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // 将消息转换为 API 需要的格式
  const convertToChatHistory = (messageList: Message[]): ChatMessage[] => {
    return messageList.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text,
    }));
  };

  const handleSend = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessageText = inputText.trim();
      
      // 添加用户消息
      const userMessage: Message = {
        id: messages.length + 1,
        text: userMessageText,
        isUser: true,
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputText('');
      setIsLoading(true);

      try {
        // 调用 API，发送完整历史
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userMessageText,
            chatHistory: convertToChatHistory(messages),
          }),
        });

        if (!response.ok) {
          throw new Error('请求失败');
        }

        const data = await response.json();

        // 添加西西的回复
        const aiMessage: Message = {
          id: newMessages.length + 1,
          text: data.reply,
          isUser: false,
        };
        
        setMessages([...newMessages, aiMessage]);
      } catch (error) {
        console.error('发送消息失败:', error);
        // 添加错误提示消息
        const errorMessage: Message = {
          id: newMessages.length + 1,
          text: '抱歉，我现在有点忙，稍后再聊吧...😔',
          isUser: false,
        };
        setMessages([...newMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理显示图片
  const handleShowImage = async () => {
    if (isGeneratingImage) return;
    
    // 如果有上传的图片，直接使用
    if (uploadedImage) {
      const imageMessage: Message = {
        id: messages.length + 1,
        text: '这是我的照片！📷',
        isUser: false,
        imageUrl: uploadedImage,
      };
      setMessages([...messages, imageMessage]);
      return;
    }
    
    // 否则使用AI生成
    setIsGeneratingImage(true);

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();

      // 添加图片消息
      const imageMessage: Message = {
        id: messages.length + 1,
        text: '这是我生成的西西的照片！📷',
        isUser: false,
        imageUrl: data.imageUrl,
      };
      
      setMessages([...messages, imageMessage]);
    } catch (error) {
      console.error('生成图片失败:', error);
      // 添加错误提示消息
      const errorMessage: Message = {
        id: messages.length + 1,
        text: '抱歉，图片生成失败了...😔',
        isUser: false,
      };
      setMessages([...messages, errorMessage]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 清除上传的图片
  const handleClearImage = () => {
    setUploadedImage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 顶部标题栏 */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">哄哄模拟器 - 西西</h1>
              <p className="text-sm text-gray-500 mt-1">40岁电信网络顾问，真诚可靠</p>
            </div>
          </div>

          {/* 图片上传区域 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 上传图片按钮 */}
            <label className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer">
              📁 上传西西照片
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* 显示上传的图片预览 */}
            {uploadedImage && (
              <div className="flex items-center gap-2">
                <img
                  src={uploadedImage}
                  alt="预览"
                  className="w-12 h-12 object-cover rounded-full border-2 border-green-400"
                />
                <button
                  onClick={handleClearImage}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors"
                >
                  清除
                </button>
              </div>
            )}

            {/* 显示/生成图片按钮 */}
            <button
              onClick={handleShowImage}
              disabled={isGeneratingImage || isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGeneratingImage ? '生成中...' : (uploadedImage ? '发送照片 📷' : 'AI生成照片 🤖')}
            </button>
          </div>

          {/* 提示文字 */}
          <p className="text-xs text-gray-400 mt-2">
            💡 提示：上传西西本人照片后，点击"发送照片"即可显示上传的图片！
          </p>
        </div>
      </header>

      {/* 聊天消息区域 */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                }`}
              >
                <p className="text-base leading-relaxed">{message.text}</p>
                {message.imageUrl && (
                  <div className="mt-3">
                    <img 
                      src={message.imageUrl} 
                      alt="西西" 
                      className="rounded-lg max-w-full h-auto shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Loading 状态 */}
          {(isLoading || isGeneratingImage) && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 底部输入区域 */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            disabled={isLoading || isGeneratingImage}
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || isGeneratingImage || !inputText.trim()}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
      </footer>
    </div>
  );
}
