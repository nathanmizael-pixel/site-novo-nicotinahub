import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Live } from '@/pages/Live';
import { Clips } from '@/pages/Clips';
import { Arcade } from '@/pages/Arcade';
import { Community } from '@/pages/Community';
import { Profile } from '@/pages/Profile';
import { Auth } from '@/pages/Auth';
import { Wishlist } from '@/pages/Wishlist';
import { Terms } from '@/pages/Terms';
import { Privacy } from '@/pages/Privacy';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live" element={<Live />} />
              <Route path="/clips" element={<Clips />} />
              <Route path="/arcade" element={<Arcade />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
