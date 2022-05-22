import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { Context } from './store';
import { setLoadingFalse, setUser } from './store/actions';

import { auth } from './config/firebase';
import { getDocById } from './services/firestore';
import { listeningRealTime } from './services/realTime';

import Dashboard from './pages/Dashboard/Dashboard';
import JoinTournament from './pages/JoinTournament/JoinTournament';
import Home from './pages/Home/Home';
import Invitations from './pages/Invitations/Invitations';
import Login from './pages/Login/Login';
import NewTournament from './pages/NewTournament/NewTournament';
import Profile from './pages/Profile/Profile';
import Signup from './pages/Signup/Signup';
import SignupDetail from './pages/SignupDetail/SignupDetail';
import Standing from './pages/Standing/Standing';
import Tournaments from './pages/Tournaments/Tournaments';

import Header from './sections/Header/Header';
import Footer from './sections/Footer/Footer';

import Intercept from './components/Intercept/Intercept';
import Notification from './components/Notification/Notification';
import ValidationIntercept from './components/Intercept/ValidationIntercept';
import Loading from './components/Intercept/Loading';

import './App.scss';

function App() {
  const { state, dispatch } = useContext(Context);
  const {
    user, intercept, validationIntercept, isLoading,
  } = state;
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (loginUser) => {
      if (loginUser) {
        const userDoc = await getDocById('users', loginUser.uid);
        if (userDoc?.username) { dispatch(setUser(userDoc)); }
        dispatch(setLoadingFalse());
      } else {
        dispatch(setLoadingFalse());
      }
    });
  }, []);

  useEffect(() => {
    listeningRealTime(user?.id, setNotification, user?.lastInviteChecked);
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
      {validationIntercept && (
        <ValidationIntercept
          title={validationIntercept.title}
          message={validationIntercept.message}
          navigationOnCancel={validationIntercept.navigationOnCancel}
          executableFunction={validationIntercept.executableFunction}
          parameters={validationIntercept.parameters}
        />
      )}
      {isLoading && <Loading />}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_detail" element={<SignupDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/create_tournament" element={<NewTournament />} />
        <Route path="/invitations" element={<Invitations />} />
        <Route path="/standing/:id" element={<Standing />} />
        <Route path="/tournament/admin/:id" element={<Dashboard />} />
        <Route path="/tournament/join/:id" element={<JoinTournament />} />
      </Routes>
      <Footer />
      <Notification
        className={notification ? 'notification__container--active' : ''}
        notification={notification}
        setNotification={setNotification}
        userId={user?.id}
      />
    </BrowserRouter>
  );
}

export default App;
