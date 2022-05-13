import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { Context } from './store';
import { setUser } from './store/actions';

import { auth } from './config/firebase';
import { getDocById } from './services/firestore';

import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import SignupDetail from './pages/SignupDetail';
import Login from './pages/Login';

import Header from './sections/Header';
import Footer from './sections/Footer';

import Intercept from './components/Intercept/Intercept';

import './App.scss';

function App() {
  const { state, dispatch } = useContext(Context);
  const { intercept } = state;

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDocById('users', user.uid);
        dispatch(setUser(userDoc));
      }
    });
  }, []);

  return (
    <BrowserRouter>
      {intercept && (
        <Intercept
          title={intercept.title}
          message={intercept.message}
          navigation={intercept.navigation}
          buttonMsg={intercept.buttonMsg}
        />
      )}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_detail" element={<SignupDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
