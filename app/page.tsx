import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* 全屏背景图片 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop" 
          alt="温暖背景" 
          className="w-full h-full object-cover"
        />
        {/* 深色叠加层，让文字更清晰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航 */}
        <nav className="pt-6 px-6 md:px-12">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💕</span>
              <span className="text-xl font-bold text-white drop-shadow-lg">哄哄模拟器</span>
            </Link>
            <div className="flex gap-4">
              <Link 
                href="/auth/login" 
                className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
              >
                登录
              </Link>
              <Link 
                href="/auth/login" 
                className="px-5 py-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg"
              >
                注册
              </Link>
            </div>
          </div>
        </nav>

        {/* 主要内容 - 居中 */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center max-w-4xl">
            {/* 小字标签 */}
            <p className="text-white/80 text-lg md:text-xl mb-4 font-medium tracking-wide">
              XIXI
            </p>
            
            {/* 大标题 */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              稳稳接得住你<br />
              的情绪
            </h1>
            
            {/* 温暖文案 */}
            <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              她不是催你变好的人，而是先接住你、听你说完，再陪你把事情慢慢理清的人。
            </p>
            
            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-white text-gray-800 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                开始认识西西
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white text-lg font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                已有账号登录
              </Link>
            </div>
          </div>
        </main>

        {/* 底部 - 可加一些小字或留空 */}
        <footer className="pb-8 px-6">
          <div className="text-center">
            <p className="text-white/50 text-sm">
              © 2024 哄哄模拟器 · 用心陪伴
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
