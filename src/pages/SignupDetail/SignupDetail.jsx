import { useState, useContext } from 'react';

import { Context } from '../../store';
import { setUser, setIntercept } from '../../store/actions';

import { editDocById, getDocById, queryUserByUsername } from '../../services/firestore';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DataListSearch from '../../components/DataListSearch/DataListSearch';
import TeammateListItem from '../../components/TeammateListItem/TeammateListItem';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import './SignupDetail.scss';

export default function SignupDetail() {
  const [form, setForm] = useState(null);
  const [usernameList, setUsernameList] = useState([]);
  const [teammates, setTeammates] = useState([]);
  // const [usernameErr, setUsernameErr] = useState(null);
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const handlerOnChange = (e) => {
    const value = e.target.name === 'username' ? e.target.value.trim() : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const searchOnChange = async (e) => {
    const search = await queryUserByUsername(e.target.value);
    const searchUsernames = search.map((item) => item.username);
    setUsernameList(searchUsernames);
  };

  const handlerAddTeammates = () => {
    const $teammatesInput = document.getElementById('stagging');
    const isValidInput = usernameList.includes($teammatesInput.value);
    const isDuplicate = teammates.includes($teammatesInput.value);
    if (isValidInput && !isDuplicate) {
      setTeammates([...teammates, $teammatesInput.value]);
    }
  };

  const handlerRemoveTeammates = (teammate) => {
    setTeammates(teammates.filter((item) => item !== teammate));
  };

  const handlerOnSubmit = async (e) => {
    e.preventDefault();
    const updateUser = teammates.length > 0 && form.type === 'team' ? { ...form, players: teammates } : form;
    try {
      await editDocById('users', user.id, updateUser);
      const userDoc = await getDocById('users', user.id);
      dispatch(setUser(userDoc));
      dispatch(setIntercept({
        title: 'Success',
        message: 'Your profile has been updated',
        navigation: '/',
        buttonMsg: 'Continue',
      }));
    } catch (error) {
      dispatch(setIntercept({
        title: 'Error',
        message: 'There was an error, please try again later',
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
          <Input type="text" name="username" labelText="Username" onChange={handlerOnChange} error={null} />
          {/* Verificar que el username sea unico */}
          <Select name="type" labelText="Type of account" onChange={handlerOnChange} options={['gamer', 'team']} />
          {form?.type === 'team' && (
            <div className="signupdetail__teammates">
              <DataListSearch
                name="stagging"
                labelText="Add your teammates"
                onChange={searchOnChange}
                options={usernameList}
                error={null}
              />
              <ButtonPrimary isSubmit={false} onClick={handlerAddTeammates}>
                Add teammate
              </ButtonPrimary>
              <h3>Teammates</h3>
              {teammates.length > 0 ? (
                <div className="teammates__list">
                  {teammates.map((teammate) => (
                    <TeammateListItem teammate={teammate} onRemove={handlerRemoveTeammates} />
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
