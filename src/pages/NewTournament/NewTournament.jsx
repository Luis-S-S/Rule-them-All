import { useState, useContext } from 'react';

import { Context } from '../../store';

import { getAllDocs, queryUserByUsername } from '../../services/firestore';
import { availableTournaments } from '../../services/tournaments';
// import { availableTournaments, handleTournamentObject } from '../../services/tournaments';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DataListSearch from '../../components/DataListSearch/DataListSearch';
import Checkbox from '../../components/Checkbox/Checkbox';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import RemoveableListItem from '../../components/RemoveableListItem/RemoveableListItem';

import './NewTournament.scss';

export default function NewTournament() {
  const { user } = useContext(Context).state;
  const [form, setForm] = useState(null);
  const [pointSystem, setPointSystem] = useState(null);
  const [usernameList, setUsernameList] = useState([]);
  const [players, setPlayers] = useState([]);

  const [titleError, setTitleError] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [scaleError, setScaleError] = useState(null);
  const [pointsError, setPointsError] = useState(null);
  const [playersError, setPlayersError] = useState(null);

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

  const addPlayer = () => {
    const username = document.getElementById('players').value;
    if (username === '') { return setPlayersError('Type a player to add him/her'); }
    if (!usernameList.includes(username)) { return setPlayersError('Player not found'); }
    if (!players.includes(username) && username !== '') {
      setPlayersError(null);
      setPlayers([...players, username]);
      document.getElementById('players').value = '';
    } else {
      setPlayersError('Player already added');
    }
    return null;
  };

  const removePlayer = (element) => {
    const newArray = players.filter((item) => item !== element);
    setPlayers(newArray);
  };

  const handleOnChangePoints = (e) => {
    setPointSystem({ ...pointSystem, [e.target.name]: e.target.value });
  };

  const handleOnChange = (e) => {
    if (e.target.name === 'title') { searchOnChangeTitles(e.target.value.trim()); }
    if (e.target.name === 'isPublic') {
      setForm({ ...form, [e.target.name]: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value.trim() });
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    // validations
    if (form?.title) { setTitleError(null); } else { return setTitleError('Title is required'); }
    if (form?.type) { setTypeError(null); } else { return setTypeError('Type is required'); }
    if (form?.scaleSystem) { setScaleError(null); } else { return setScaleError('Select a point system'); }
    if (form?.scaleSystem === 'Score') {
      if (pointSystem?.win && pointSystem?.tie && pointSystem?.loss) {
        setPointsError(null);
      } else {
        return setPointsError('Points are required');
      }
    }
    if (form?.isPublic || players.length >= 2) { setPlayersError(null); } else { return setPlayersError('Add at least two players'); }

    // data handling

    // send to firestore
    console.log({
      ...form, pointSystem: { ...pointSystem }, admin: user.username, players,
    });
    return null;
  };
  // handleTournamentObject({...form, pointSystem:{...pointSystem},admin:user.username,players})

  return (
    <div className="new-tournament-page">
      <form className="new-tournament__container">
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
          options={availableTournaments}
          onChange={handleOnChange}
          error={typeError}
        />
        <Checkbox name="isPublic" labelText="Is an open tournament?" onChecked={handleOnChange} />
        <Select
          name="scaleSystem"
          labelText="How are you going to keep score?"
          options={['Win/Loss', 'Score']}
          onChange={handleOnChange}
          error={scaleError}
        />
        {form?.scaleSystem === 'Score' && (
        <div>
          <Input type="number" name="win" labelText="Winner Points" onChange={handleOnChangePoints} format="inline" error={pointsError} />
          <Input type="number" name="tie" labelText="Tie Game Points" onChange={handleOnChangePoints} format="inline" error={pointsError} />
          <Input type="number" name="loss" labelText="Loser Points" onChange={handleOnChangePoints} format="inline" error={pointsError} />
        </div>
        )}
        {!form?.isPublic && (
        <>
          <DataListSearch
            name="players"
            labelText="Players"
            onChange={searchOnChangeUsernames}
            options={usernameList}
            error={playersError}
          />
          <ButtonPrimary isSubmit={false} onClick={addPlayer}>Add player</ButtonPrimary>
          {players.length > 0
            ? (
              <div className="new-tournament__players">
                {players.map((player) => (
                  <RemoveableListItem element={player} onRemove={removePlayer} />
                ))}
              </div>
            )
            : (
              <h4>No players added</h4>
            )}
        </>
        )}
        <ButtonPrimary isSubmit onClick={handleOnSubmit}>Create Tournament</ButtonPrimary>
      </form>
    </div>
  );
}
