import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { ProgressPage } from './pages/ProgressPage';
import { seedDatabase } from './db/seed';

type Route = 'home' | 'quiz' | 'progress';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [initialized, setInitialized] = useState(false);
  const [navigationKey, setNavigationKey] = useState(0);

  useEffect(() => {
    initApp();
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  async function initApp() {
    try {
      await seedDatabase();
      setInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  function handleRouting() {
    const path = window.location.pathname;
    if (path === '/quiz') {
      setCurrentRoute('quiz');
    } else if (path === '/progress') {
      setCurrentRoute('progress');
    } else {
      setCurrentRoute('home');
      // Increment key to force HomePage to remount and reload stats
      setNavigationKey(prev => prev + 1);
    }
  }

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        e.preventDefault();
        const href = (target as HTMLAnchorElement).href || (target.closest('a') as HTMLAnchorElement)?.href;
        if (href) {
          const url = new URL(href);
          window.history.pushState({}, '', url.pathname);
          handleRouting();
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-2xl text-gray-600">Initializing...</div>
      </div>
    );
  }

  return (
    <>
      {currentRoute === 'home' && <HomePage key={navigationKey} />}
      {currentRoute === 'quiz' && <QuizPage />}
      {currentRoute === 'progress' && <ProgressPage />}
    </>
  );
}

export default App;
