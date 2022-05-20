import { useContext, useEffect, useState } from 'react';

import { Context } from '../../store';
import { setUser } from '../../store/actions';

import { editDocById, queryCollectionByUsername } from '../../services/firestore';

import Input from '../../components/Input/Input';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import CloudinaryWidget from '../../components/CloudinaryWidget/CloudinaryWidget';

import './ProfileInfo.scss';

export default function ProfileInfo() {
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [usernameErr, setUsernameErr] = useState(null);
  const { state, dispatch } = useContext(Context);

  const handleOnChangeUsername = async (e) => {
    const search = await queryCollectionByUsername('users', e.target.value);
    const searchUsernames = search.map((item) => item.username);
    if (searchUsernames?.includes(e.target.value)) {
      setUsernameErr('Username already exists');
    } else {
      setUsernameErr(null);
    }
    setUsername(e.target.value);
  };

  const handleOnSubmitUsername = async () => {
    if (!usernameErr && username) {
      await editDocById('users', state.user.id, { username });
      dispatch(setUser({ ...state.user, username }));
      document.getElementById('username').value = '';
    }
  };

  const handleAvatarChange = async () => {
    if (avatarUrl) {
      await editDocById('users', state.user.id, { avatar: avatarUrl });
      dispatch(setUser({ ...state.user, avatar: avatarUrl }));
    }
  };

  useEffect(() => {
    handleAvatarChange();
  }, [avatarUrl]);

  return (
    <div className="profile-page__info">
      <h1 className="profile-page__title title--generic">Profile</h1>
      <img className="profile-page__avatar" src={state.user?.avatar} alt="profile" />
      <CloudinaryWidget folderName="users-avatar" setNewUrl={setAvatarUrl}>Change avatar</CloudinaryWidget>
      <Input
        type="text"
        name="username"
        labelText="Change username"
        placeholder={state.user?.username}
        onChange={handleOnChangeUsername}
        error={usernameErr}
      />
      <ButtonPrimary onClick={handleOnSubmitUsername} isSubmit={false}>
        Update username
      </ButtonPrimary>
      <p>{`Email: ${state.user?.email}`}</p>
      <p>{`Account type: ${state.user?.type}`}</p>
    </div>
  );
}
