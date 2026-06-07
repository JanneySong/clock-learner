import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { loadProgress } from './utils/storage';
import { initAudio } from './utils/soundGenerator';
import { lazy, Suspense } from 'react';

// 懒加载页面
const HomePage = lazy(() => import('./pages/HomePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const ParentPage = lazy(() => import('./pages/ParentPage'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <span className="text-4xl float-animate inline-block">⏰</span>
        <p className="text-lg text-text-secondary mt-4">加载中...</p>
      </div>
    </div>
  );
}

function App() {
  const progress = loadProgress();

  // 在首次交互时初始化音频
  const handleFirstInteraction = () => {
    initAudio();
  };

  return (
    <div onClick={handleFirstInteraction} onTouchStart={handleFirstInteraction}>
      <BrowserRouter>
        <AppShell stars={progress.totalStars}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/parent" element={<ParentPage />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </div>
  );
}

export default App;
