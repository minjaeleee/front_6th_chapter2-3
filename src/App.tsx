import { BrowserRouter as Router } from 'react-router-dom';

import PostsManagerPage from '@/pages/PostsManagerPage';
import Footer from '@/shared/ui/Layout/Footer';
import Header from '@/shared/ui/Layout/Header';

const App = () => {
  return (
    <Router>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='container mx-auto flex-grow px-4 py-8'>
          <PostsManagerPage />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
