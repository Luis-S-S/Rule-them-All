import { useContext, useState } from 'react';

import { Context } from '../../store';
import { setUser } from '../../store/actions';

import { editDocById, queryUserByUsername } from '../../services/firestore';

import Input from '../../components/Input/Input';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import './Profile.scss';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [usernameErr, setUsernameErr] = useState(null);
  const { state, dispatch } = useContext(Context);

  const handleOnChangeUsername = async (e) => {
    const search = await queryUserByUsername(e.target.value);
    const searchUsernames = search.map((item) => item.username);
    if (searchUsernames.includes(e.target.value)) {
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

  const handleOnSubmitAvatar = async () => {
    console.log('nothing');
  };

  return (
    <div className="profile-page">
      <div className="profile-page__info">
        <img src={state.user?.avatar} alt="profile" />
        <input type="file" id="avatar" />
        <ButtonPrimary onClick={handleOnSubmitAvatar} isSubmit={false}>Change avatar</ButtonPrimary>
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
      <hr />
      <div className="profile-page__tournaments">
        <h1>Tournaments</h1>
        <div>Once I handle tournaments I&apos;ll paint them here, don&apos;t forget</div>
      </div>
    </div>
  );
}
