import { useState } from 'react';

import { getAllDocs, queryUserByUsername } from '../../services/firestore';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DataListSearch from '../../components/DataListSearch/DataListSearch';
import Checkbox from '../../components/Checkbox/Checkbox';

import './NewTournament.scss';

export default function NewTournament() {
  const [form, setForm] = useState(null);
  const [usernameList, setUsernameList] = useState([]);
  const [titleError, setTitleError] = useState(null);

  const searchOnChangeTitles = async (incomingTitle) => {
    const response = await getAllDocs('tournaments');
    const existingTitles = response.map((item) => item.title);
    if (existingTitles.includes(incomingTitle)) {
      setTitleError('Title already exists');
    } else {
      setTitleError(null);
    }
  };

  const searchOnChangeUsernames = async (e) => {
    const response = await queryUserByUsername(e.target.value);
    const searchUsernames = response.map((item) => item.username);
    setUsernameList(searchUsernames);
  };

  const handleOnChange = (e) => {
    if (e.target.name === 'title') { searchOnChangeTitles(e.target.value); }
    if (e.target.name === 'isPublic') {
      setForm({ ...form, [e.target.name]: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="new-tournament-page">
      <div className="new-tournament__container">
        <Input
          type="text"
          name="title"
          labelText="Tournament Title"
          onChange={handleOnChange}
          placeholder="Tournament title"
          error={titleError}
        />
        <Select
          name="type"
          labelText="Tournament Type"
          options={['Free For All', 'Single Elimination TBD', 'Double Elimination TBD']}
          onChange={handleOnChange}
        />
        <Checkbox name="isPublic" labelText="Is an open tournament?" onChecked={handleOnChange} />
        <Select
          name="scaleSystem"
          labelText="How are you going to keep score?"
          options={['Win/Loss', 'Score']}
          onChange={handleOnChange}
        />
        {form?.scaleSystem === 'Score' && (
        <>
          <Input type="number" name="pointSystem.win" labelText="Winner Points" onChange={handleOnChange} />
          <Input type="number" name="pointSystem.tie" labelText="Tie Game Points" onChange={handleOnChange} />
          <Input type="number" name="pointSystem.loss" labelText="Loser Points" onChange={handleOnChange} />
        </>
        )}
        <DataListSearch name="players" labelText="Players" onChange={searchOnChangeUsernames} options={usernameList} />
      </div>
    </div>
  );
}
