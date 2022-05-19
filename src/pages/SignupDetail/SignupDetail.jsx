import { useState, useContext } from 'react';

import { Context } from '../../store';
import { setUser, setIntercept } from '../../store/actions';

import { editDocById, getDocById, queryCollectionByUsername } from '../../services/firestore';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DataListSearch from '../../components/DataListSearch/DataListSearch';
import RemoveableListItem from '../../components/RemoveableListItem/RemoveableListItem';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import './SignupDetail.scss';

export default function SignupDetail() {
  const [form, setForm] = useState(null);
  const [usernameList, setUsernameList] = useState([]);
  const [teammates, setTeammates] = useState([]);

  const [usernameErr, setUsernameErr] = useState(null);
  const [typeErr, setTypeErr] = useState(null);
  const [teammateErr, setTeammateErr] = useState(null);

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const searchOnChangeUsernames = async (e) => {
    const search = await queryCollectionByUsername('users', e.target.value);
    const searchUsernames = search.map((item) => item.username);
    if (searchUsernames.includes(e.target.value)) {
      setUsernameErr('Username already exists');
    } else {
      setUsernameErr(null);
    }
  };

  const searchOnChangeTeammates = async (e) => {
    const search = await queryCollectionByUsername('users', e.target.value);
    const searchUsernames = search.map((item) => item.username);
    setUsernameList(searchUsernames);
  };

  const handlerAddTeammates = () => {
    const $teammatesInput = document.getElementById('stagging');
    const isValidInput = usernameList.includes($teammatesInput.value);
    const isDuplicate = teammates.includes($teammatesInput.value);
    if (!isValidInput) { setTeammateErr('Unable to add user'); }
    if (isDuplicate) { setTeammateErr('User already added'); }
    if (isValidInput && !isDuplicate) {
      setTeammates([...teammates, $teammatesInput.value]);
      setTeammateErr(null);
    }
  };

  const handlerRemoveTeammates = (teammate) => {
    setTeammates(teammates.filter((item) => item !== teammate));
  };

  const handlerOnChange = async (e) => {
    if (e.target.name === 'username') { await searchOnChangeUsernames(e); }
    if (e.target.name === 'type' && !e.target.value) { setTypeErr('Must select user type'); } else { setTypeErr(null); }
    const value = e.target.name === 'username' ? e.target.value.trim() : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handlerOnSubmit = async (e) => {
    e.preventDefault();
    const updateUser = teammates.length > 0 && form.type === 'team' ? { ...form, players: teammates } : form;
    try {
      if (!form?.username || !form?.type) {
        throw new Error('Username and/or user type are required');
      }
      await editDocById('users', user.id, { ...updateUser, lastInviteChecked: Date.now() });
      const userDoc = await getDocById('users', user.id);
      dispatch(setUser(userDoc));
      dispatch(setIntercept({
        title: 'Success',
        message: 'Signed up successfully',
        navigation: '/',
        buttonMsg: 'Continue',
      }));
    } catch (error) {
      dispatch(setIntercept({
        title: 'Error',
        message: error?.message ? error.message : 'An error ocurred, please try again later',
        navigation: '/signup_detail',
        buttonMsg: 'Try again',
      }));
    }
  };

  return (
    <div className="signupdetail__page">
      <div className="signupdetail__container">
        <form className="signupdetail__form" onSubmit={handlerOnSubmit}>
          <h1 className="form__title">Complete Signup</h1>
          <Input type="text" name="username" labelText="Username" onChange={handlerOnChange} error={usernameErr} />
          <Select name="type" labelText="Type of account" onChange={handlerOnChange} options={['gamer', 'team']} error={typeErr} />
          {form?.type === 'team' && (
            <div className="signupdetail__teammates">
              <DataListSearch
                name="stagging"
                labelText="Add your teammates (optional)"
                onChange={searchOnChangeTeammates}
                options={usernameList}
                error={teammateErr}
              />
              <ButtonPrimary isSubmit={false} onClick={handlerAddTeammates}>
                Add teammate
              </ButtonPrimary>
              <h3>Teammates</h3>
              {teammates.length > 0 ? (
                <div className="teammates__list">
                  {teammates.map((teammate) => (
                    <RemoveableListItem element={teammate} onRemove={handlerRemoveTeammates} />
                  ))}
                </div>
              ) : (
                <h4>No teammates added</h4>
              )}
            </div>
          )}
          <ButtonPrimary isSubmit>Finish sign up</ButtonPrimary>
        </form>
      </div>
    </div>
  );
}
