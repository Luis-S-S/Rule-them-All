import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from './store';

import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import SignupDetail from './pages/SignupDetail';

import Header from './sections/Header';
import Footer from './sections/Footer';

import Intercept from './components/Intercept/Intercept';

import './App.scss';

function App() {
  const { state } = useContext(Context);
  const { intercept } = state;

  return (
    <BrowserRouter>
      {intercept && (
        <Intercept
          title={intercept.title}
          message={intercept.message}
          navigation={intercept.navigation}
        />
      )}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_detail" element={<SignupDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
