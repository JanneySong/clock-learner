import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: '首页', emoji: '🏠' },
  { path: '/learn', label: '学习', emoji: '📖' },
  { path: '/practice', label: '练习', emoji: '✏️' },
  { path: '/explore', label: '探索', emoji: '🔍' },
  { path: '/progress', label: '成就', emoji: '🏆' },
  { path: '/parent', label: '家长', emoji: '👨‍👩‍👧' },
] as const;

const BottomNav = memo(function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-around bg-white border-t-2 border-bg-card safe-area-container pb-[env(safe-area-inset-bottom,8px)]">
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`
              flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[56px]
              transition-colors duration-150 btn-press
              ${isActive ? 'text-accent' : 'text-text-secondary'}
            `}
          >
            <span className="text-2xl">{tab.emoji}</span>
            <span className={`text-xs mt-0.5 font-bold ${isActive ? 'text-accent' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
});

export default BottomNav;
