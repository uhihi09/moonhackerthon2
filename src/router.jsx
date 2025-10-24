import { createBrowserRouter } from 'react-router';
import App from './App';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup'; // ✅ 추가
import Layout from './components/Layout';
import HomePage from './pages/Home/home.jsx';
import EmerDetail from './pages/EmerDetail/emer-detail.jsx';
import RecentRoute from './pages/RecentRoute/recent-route.jsx';

const router = createBrowserRouter([
  // 인증 레이아웃 - BottomBar X
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> }, // ✅ 추가
      { path: 'emer-detail/:id', element: <EmerDetail /> },
      { path: 'recent-route/:id', element: <RecentRoute /> },
    ],
  },

  // 메인 레이아웃 - BottomBar O
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
]);

export default router;