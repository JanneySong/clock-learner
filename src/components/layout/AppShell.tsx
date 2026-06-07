import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import StarRating from '../ui/StarRating';
import { loadSettings, saveSettings } from '../../utils/storage';
import { initAudio } from '../../utils/soundGenerator';

interface AppShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  stars?: number;
}

const AppShell = memo(function AppShell({
  children,
  showNav = true,
  stars = 0,
}: AppShellProps) {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const settings = loadSettings();

  const toggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    saveSettings(newSettings);
    if (newSettings.soundEnabled) initAudio();
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-bg-primary safe-area-container">
      {/* 顶部栏 */}
      <header className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-bg-card">
        <button
          onClick={() => navigate(-1)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <StarRating total={5} earned={Math.min(Math.floor(stars / 5), 5)} size="sm" />
          <span className="text-sm font-bold text-accent">{stars}⭐</span>
        </div>
        <button
          onClick={() => { setShowSettings(!showSettings); initAudio(); }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl"
        >
          ⚙️
        </button>
      </header>

      {/* 设置面板 */}
      {showSettings && (
        <div className="absolute top-14 right-2 z-40 bg-white rounded-2xl shadow-xl border border-bg-card p-4 min-w-[200px]">
          <h3 className="text-lg font-bold mb-3">设置</h3>
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 w-full py-2 text-lg"
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
            <span>{settings.soundEnabled ? '音效开启' : '音效关闭'}</span>
          </button>
          <button
            onClick={() => setShowSettings(false)}
            className="mt-2 text-accent font-bold"
          >
            关闭
          </button>
        </div>
      )}

      {/* 内容区 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* 底部导航 */}
      {showNav && <BottomNav />}
    </div>
  );
});

export default AppShell;
