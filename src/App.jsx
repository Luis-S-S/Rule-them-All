import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { Context } from './store';
import { setUser } from './store/actions';

import { auth } from './config/firebase';
import { getDocById } from './services/firestore';
import { listeningRealTime } from './services/realTime';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Profile from './pages/Profile/Profile';
import Signup from './pages/Signup/Signup';
import SignupDetail from './pages/SignupDetail/SignupDetail';
import Login from './pages/Login/Login';
import Tournaments from './pages/Tournaments/Tournaments';
import NewTournament from './pages/NewTournament/NewTournament';
import Invitations from './pages/Invitations/Invitations';

import Header from './sections/Header/Header';
import Footer from './sections/Footer/Footer';

import Intercept from './components/Intercept/Intercept';

import './App.scss';

function App() {
  const { state, dispatch } = useContext(Context);
  const { user, intercept } = state;

  // console.log(state);

  useEffect(() => {
    onAuthStateChanged(auth, async (loginUser) => {
      if (loginUser) {
        const userDoc = await getDocById('users', loginUser.uid);
        dispatch(setUser(userDoc));
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      listeningRealTime(user?.username);
    }
  }, [user]);

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_detail" element={<SignupDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/create_tournament" element={<NewTournament />} />
        <Route path="/invitations" element={<Invitations />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
