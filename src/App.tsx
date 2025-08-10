import { BrowserRouter as Router } from 'react-router-dom';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PostsManagerPage from '@/pages/PostsManagerPage';

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
