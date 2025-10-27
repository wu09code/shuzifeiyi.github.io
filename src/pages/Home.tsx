import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Download, Share2, Palette, Image as ImageIcon, 
  FileText, Book, Moon, Sun, ChevronRight, ArrowRight,
  Heart, MessageSquare, User, Star, Menu, X
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

// 定义非遗风格类型
type ArtStyle = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

// 示例作品类型
type Artwork = {
  id: string;
  title: string;
  artist: string;
  style: string;
  imageUrl: string;
  likes: number;
  comments: number;
  createdAt: string;
};

// 非遗知识类型
type HeritageKnowledge = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedArtwork, setGeneratedArtwork] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // 非遗风格数据
  const artStyles: ArtStyle[] = [
    {
      id: 'paper-cut',
      name: '剪纸艺术',
      description: '中国传统民间艺术，通过剪刀或刻刀在纸上剪刻花纹',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20paper%20cutting%20art%2C%20red%20paper%2C%20dragon%20pattern&sign=ebdc2610402acff08e012de38655bed4'
    },
    {
      id: 'suzhou-embroidery',
      name: '苏绣',
      description: '苏州地区传统刺绣工艺，以精细、雅洁著称',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Suzhou%20embroidery%20art%2C%20traditional%20Chinese%20craft%2C%20flower%20pattern&sign=f16be6350a2e5642be7e2f29cb8441c1'
    },
    {
      id: 'shadow-puppet',
      name: '皮影戏',
      description: '用兽皮或纸板做成的人物剪影以表演故事的民间戏剧',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20shadow%20puppet%2C%20leather%20craft%2C%20character%20figure&sign=2346b79bb33c92650241b3836fa0af59'
    },
    {
      id: 'ink-wash',
      name: '水墨画',
      description: '中国传统绘画形式，以水和墨的不同比例表现丰富的色调层次',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20ink%20wash%20painting%2C%20mountains%20and%20water&sign=7c225c81498a46f0997f4e3ac07db2e9'
    }
  ];

  // 示例作品数据
  const featuredArtworks: Artwork[] = [
    {
      id: '1',
      title: '数字剪纸·龙凤呈祥',
      artist: '张三',
      style: '剪纸艺术',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Digital%20paper%20cut%20art%2C%20dragon%20and%20phoenix%20pattern&sign=d09aa6677e3fb4075cc6d54168e76aa0',
      likes: 128,
      comments: 24,
      createdAt: '2025-10-20'
    },
    {
      id: '2',
      title: '现代苏绣·城市剪影',
      artist: '李四',
      style: '苏绣',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Modern%20Suzhou%20embroidery%2C%20city%20silhouette&sign=3a80513c537f8fbfd6b2adec2e7bc429',
      likes: 95,
      comments: 18,
      createdAt: '2025-10-18'
    },
    {
      id: '3',
      title: '皮影新韵·科技之光',
      artist: '王五',
      style: '皮影戏',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Modern%20shadow%20puppet%20art%2C%20technology%20theme&sign=d139909757fc0b0c613a78cd78063d2f',
      likes: 156,
      comments: 31,
      createdAt: '2025-10-15'
    }
  ];

  // 非遗知识数据
  const heritageKnowledge: HeritageKnowledge[] = [
    {
      id: '1',
      title: '剪纸的历史',
      description: '剪纸艺术在中国已有超过1500年的历史，最早可追溯到南北朝时期。',
      icon: 'scroll'
    },
    {
      id: '2',
      title: '苏绣的技法',
      description: '苏绣以"平、齐、细、密、匀、顺、和、光"八大技法著称于世。',
      icon: 'needle'
    },
    {
      id: '3',
      title: '皮影的材料',
      description: '传统皮影通常使用牛皮、羊皮或驴皮制作，经过复杂的处理工艺。',
      icon: 'leather'
    }
  ];

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setActiveStep(2);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // 模拟生成艺术作品
  const generateArtwork = () => {
    if (!selectedStyle) return;
    
    // 模拟AI处理延迟
    setTimeout(() => {
      const style = artStyles.find(s => s.id === selectedStyle);
      if (style) {
        setGeneratedArtwork(style.imageUrl);
        setActiveStep(3);
      }
    }, 1500);
  };

  // 处理文字描述生成
  const handleTextGenerate = () => {
    if (inputText.trim()) {
      setActiveStep(2);
      // 模拟AI处理延迟
      setTimeout(() => {
        setGeneratedArtwork('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Digital%20traditional%20Chinese%20art&sign=d4e6dba3a2f033988328a96293da4c60');
        setActiveStep(3);
      }, 1500);
    }
  };

  // 下载作品
  const downloadArtwork = () => {
    if (generatedArtwork) {
      const link = document.createElement('a');
      link.href = generatedArtwork;
      link.download = 'digital-heritage-artwork.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 分享作品
  const shareArtwork = () => {
    alert('分享功能即将上线！');
  };

  // 切换步骤
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  // 滚动到指定区域
  const scrollToSection = (index: number) => {
    if (sectionsRef.current[index]) {
      sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-gray-200 dark:border-gray-800" 
              style={{ background: theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut", repeat: 0 }}
              className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center"
            >
              <Palette className="text-white" size={20} />
            </motion.div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent gradient-primary">数字非遗</h1>
          </div>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection(0)} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">首页</button>
            <button onClick={() => scrollToSection(1)} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">开始创作</button>
            <button onClick={() => scrollToSection(2)} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">风格展示</button>
            <button onClick={() => scrollToSection(3)} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">作品欣赏</button>
            <button onClick={() => scrollToSection(4)} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">非遗知识</button>
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* 移动端导航菜单 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className={`px-4 py-4 flex flex-col space-y-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <button onClick={() => scrollToSection(0)} className="font-medium text-left py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">首页</button>
                <button onClick={() => scrollToSection(1)} className="font-medium text-left py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">开始创作</button>
                <button onClick={() => scrollToSection(2)} className="font-medium text-left py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">风格展示</button>
                <button onClick={() => scrollToSection(3)} className="font-medium text-left py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">作品欣赏</button>
                <button onClick={() => scrollToSection(4)} className="font-medium text-left py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">非遗知识</button>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span className="font-medium">深色模式</span>
                  <button 
                    onClick={toggleTheme} 
                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* 英雄区 */}
        <section 
          ref={el => sectionsRef.current[0] = el}
          className="relative py-20 overflow-hidden"
        >
          {/* 背景效果 */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="w-full md:w-1/2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="bg-clip-text text-transparent gradient-primary">数字科技</span> 遇见 
                    <span className="bg-clip-text text-transparent gradient-secondary">传统文化</span>
                  </h1>
                  <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                    通过AI技术，将您的图片或文字描述转化为精美的非遗艺术作品
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button 
                    onClick={() => scrollToSection(1)}
                    className="px-8 py-3 rounded-full gradient-primary text-white font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1"
                  >
                    开始创作
                  </button>
                  <button 
                    onClick={() => scrollToSection(3)}
                    className={`px-8 py-3 rounded-full font-medium transition-all transform hover:-translate-y-1 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-white hover:bg-gray-700' 
                        : 'bg-white text-gray-900 hover:bg-gray-100 shadow'
                    }`}
                  >
                    欣赏作品
                  </button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden"
                      >
                        <img 
                          src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20${i}`} 
                          alt={`User ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span>已有 10,000+ 创作者加入</span>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full md:w-1/2 relative"
              >
                <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Digital%20traditional%20Chinese%20art&sign=d4e6dba3a2f033988328a96293da4c60%20exhibition%20with%20paper%20cutting%2C%20embroidery%2C%20shadow%20puppet" 
                    alt="数字非遗展示" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold">传统艺术的数字新生</h3>
                      <p className="text-gray-200">融合AI技术与非遗文化，创造独特艺术体验</p>
                    </div>
                  </div>
                </div>
                
                {/* 装饰元素 */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full animate-float z-[-1]"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-pink-500 rounded-full animate-float animation-delay-2000 z-[-1]"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 创作流程区 */}
        <section 
          ref={el => sectionsRef.current[1] = el}
          className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">三步创作你的数字非遗作品</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  简单几步，将你的创意转化为精美的传统艺术作品
                </p>
              </motion.div>
            </div>
            
            {/* 步骤指示器 */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2 w-full max-w-2xl">
                {[0, 1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <button
                      onClick={() => handleStepChange(step)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        activeStep === step 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110' 
                          : theme === 'dark' 
                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {step + 1}
                    </button>
                    {step < 3 && (
                      <div className="flex-1 h-1">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            activeStep > step 
                              ? 'w-full bg-indigo-600' 
                              : theme === 'dark' 
                                ? 'w-full bg-gray-800' 
                                : 'w-full bg-gray-200'
                          }`}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* 创作流程内容 */}
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  {/* 步骤 1: 选择创作方式 */}
                  {activeStep === 0 && (
                    <div className="text-center py-10">
                      <h3 className="text-2xl font-bold mb-8">选择创作方式</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveStep(1)}
                          className={`p-6 rounded-xl cursor-pointer transition-all ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-white hover:bg-gray-50 shadow hover:shadow-md'
                          }`}
                        >
                          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                            <ImageIcon size={24} className="text-white" />
                          </div>
                          <h4 className="text-xl font-semibold mb-2">图片转化</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            上传一张图片，将其转化为非遗艺术风格
                          </p>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveStep(1);
                            setTimeout(() => setActiveStep(2), 300);
                          }}
                          className={`p-6 rounded-xl cursor-pointer transition-all ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-white hover:bg-gray-50 shadow hover:shadow-md'
                          }`}
                        >
                          <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-4">
                            <FileText size={24} className="text-white" />
                          </div>
                          <h4 className="text-xl font-semibold mb-2">文字描述</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            输入文字描述，生成相应的非遗艺术作品
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  )}
                  
                  {/* 步骤 2: 上传图片或输入文字 */}
                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">上传图片</h3>
                      <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                          theme === 'dark' 
                            ? 'border-gray-700 hover:border-indigo-500' 
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="max-w-md mx-auto">
                          <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <Upload size={24} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <h4 className="text-xl font-semibold mb-2">拖拽图片到此处或点击上传</h4>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            支持 JPG、PNG、WEBP 格式，最大 10MB
                          </p>
                          <button 
                            className={`px-6 py-2 rounded-lg ${
                              theme === 'dark' 
                                ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            选择图片
                          </button>
                        </div>
                      </div>
                      
                      {uploadedImage && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-2">已上传图片</h4>
                          <div className="relative rounded-xl overflow-hidden">
                            <img 
                              src={uploadedImage} 
                              alt="已上传图片" 
                              className="w-full h-auto max-h-96 object-contain"
                            />
                            <button 
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                              onClick={() => setUploadedImage(null)}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-8">
                        <button 
                          className={`px-6 py-2 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={() => setActiveStep(0)}
                        >
                          返回
                        </button>
                        <button 
                          className={`px-6 py-2 rounded-lg ${
                            uploadedImage 
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                              : theme === 'dark' 
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => setActiveStep(2)}
                          disabled={!uploadedImage}
                        >
                          下一步
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 步骤 3: 选择风格 */}
                  {activeStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">选择非遗艺术风格</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {artStyles.map((style) => (
                          <motion.div
                            key={style.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                              selectedStyle === style.id 
                                ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' 
                                : theme === 'dark' 
                                  ? 'border-gray-700 hover:border-gray-600' 
                                  : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedStyle(style.id)}
                          >
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={style.imageUrl} 
                                alt={style.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="text-xl font-semibold">{style.name}</h4>
                              <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {style.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-xl font-semibold mb-4">输入文字描述（可选）</h4>
                        <input
                          type="text"
                          placeholder="例如：北京的天坛，古老的龙凤图案..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-8">
                        <button 
                          className={`px-6 py-2 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={() => setActiveStep(1)}
                        >
                          返回
                        </button>
                        <button 
                          className={`px-6 py-2 rounded-lg ${
                            selectedStyle 
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                              : theme === 'dark' 
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={generateArtwork}
                          disabled={!selectedStyle}
                        >
                          生成作品
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 步骤 4: 预览和下载 */}
                  {activeStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">您的数字非遗作品已生成</h3>
                      
                      <div className="relative rounded-xl overflow-hidden shadow-xl">
                        {generatedArtwork ? (
                          <img 
                            src={generatedArtwork} 
                            alt="生成的非遗作品" 
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        ) : (
                          <div className="w-full h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse">
                            <div className="text-center">
                              <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="mt-4 text-gray-500 dark:text-gray-400">正在生成作品...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className={`p-4 rounded-lg text-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <h4 className="font-semibold mb-2">作品类型</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {selectedStyle ? artStyles.find(s => s.id === selectedStyle)?.name : '非遗艺术'}
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <h4 className="font-semibold mb-2">创作时间</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <h4 className="font-semibold mb-2">作品尺寸</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            1024 × 1024 px
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 justify-center mt-8">
                        <button 
                          className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                            theme === 'dark' 
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                          onClick={downloadArtwork}
                          disabled={!generatedArtwork}
                        >
                          <Download size={18} />
                          下载作品
                        </button>
                        <button 
                          className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={shareArtwork}
                          disabled={!generatedArtwork}
                        >
                          <Share2 size={18} />
                          分享作品
                        </button>
                        <button 
                          className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={() => {
                            setActiveStep(0);
                            setUploadedImage(null);
                            setGeneratedArtwork(null);
                            setSelectedStyle(null);
                          }}
                        >
                          创作新作品
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
        
        {/* 风格展示区 */}
        <section 
          ref={el => sectionsRef.current[2] = el}
          className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">探索非遗艺术风格</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  每一种风格都承载着千年的文化底蕴，等待您的创意激活
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {artStyles.map((style, index) => (
                <motion.div
                  key={style.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`rounded-xl overflow-hidden shadow-lg ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  }`}
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={style.imageUrl} 
                      alt={style.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{style.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {style.description}
                    </p>
                    <button 
                      className={`flex items-center gap-2 font-medium ${
                        theme === 'dark' 
                          ? 'text-indigo-400 hover:text-indigo-300' 
                          : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                      onClick={() => {
                        setSelectedStyle(style.id);
                        setActiveStep(3);
                        scrollToSection(1);
                      }}
                    >
                      立即体验 <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 作品欣赏区 */}
        <section 
          ref={el => sectionsRef.current[3] = el}
          className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">作品欣赏</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  浏览社区创作者的精彩作品，获取灵感
                </p>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-4 md:mt-0 px-6 py-2 rounded-full flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                查看全部作品 <ArrowRight size={16} />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-xl overflow-hidden shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="h-80 overflow-hidden">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{artwork.title}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {artwork.style}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20${artwork.id}`} 
                          alt={artwork.artist}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">
                        {artwork.artist}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                          <Heart size={16} />
                          <span>{artwork.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors">
                          <MessageSquare size={16} />
                          <span>{artwork.comments}</span>
                        </button>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {artwork.createdAt}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 非遗知识区 */}
        <section 
          ref={el => sectionsRef.current[4] = el}
          className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">非遗知识</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  了解传统非物质文化遗产的历史、技巧和文化背景
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {heritageKnowledge.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-white hover:bg-gray-50 shadow'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mb-6">
                    <Book size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {item.description}
                  </p>
                  <button 
                    className={`flex items-center gap-2 font-medium ${
                      theme === 'dark' 
                        ? 'text-indigo-400 hover:text-indigo-300' 
                        : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    了解更多 <ChevronRight size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                探索更多非遗知识
              </motion.button>
            </div>
          </div>
        </section>
        
        {/* 呼吁行动区 */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 gradient-primary opacity-10"></div>
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">开始你的数字非遗之旅</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                用现代科技传承传统文化，创造属于你自己的非遗艺术作品，让古老的技艺在数字时代焕发新生
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(1)}
                  className="px-8 py-4 rounded-full gradient-primary text-white font-medium text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  立即创作
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(3)}
                  className={`px-8 py-4 rounded-full font-medium text-lg transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-100 shadow'
                  }`}
                >
                  欣赏更多作品
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className={`py-12 ${theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Palette className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent gradient-primary">数字非遗</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                通过现代科技手段，将传统的非物质文化遗产进行数字化、传承和创新。
              </p>
              <div className="flex gap-4">
                {['twitter', 'facebook', 'instagram', 'youtube'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <i className={`fab fa-${social} text-gray-600 dark:text-gray-300`}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">功能</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">图片转化</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">文字描述生成</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">风格选择</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">作品下载</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">社区分享</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">资源</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">非遗知识</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">创作教程</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">常见问题</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">使用条款</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">隐私政策</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">联系我们</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <i className="fas fa-envelope"></i>
                  <span>contact@digitalheritage.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <i className="fas fa-phone"></i>
                  <span>+86 123 4567 8910</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>北京市海淀区科技园</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">订阅我们的新闻</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="您的邮箱地址" 
                    className={`flex-1 px-4 py-2 rounded-l-lg focus:outline-none ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    } border`}
                  />
                  <button 
                    className={`px-4 py-2 rounded-r-lg ${
                      theme === 'dark' 
                        ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    订阅
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 数字非遗. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}