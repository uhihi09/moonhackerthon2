import { createBrowserRouter } from 'react-router';
import App from './App';
import LoginPage from './pages/Login';
import Layout from './components/Layout';
import HomePage from './pages/Home/home.jsx';
import EmerDetail from './pages/EmerDetail/emer-detail.jsx';
import RecentRoute from './pages/RecentRoute/recent-route.jsx';

/**
 * 라우터 설정
 *
 * App: 인증 관련 페이지 (BottomBar X)
 * Layout: 메인 페이지 (BottomBar O)
 */
const router = createBrowserRouter([
  // 인증 레이아웃 - BottomBar X
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'login', element: <LoginPage /> }, // /login
      { path: 'emer-detail/:id', element: <EmerDetail /> },
      { path: 'recent-route/:id', element: <RecentRoute /> },
    ],
  },

  // 메인 레이아웃 - BottomBar O
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> }, // / → 기본 페이지 (지도)
    ],
  },
]);

export default router;
