import { useState, useContext } from 'react';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import {
  getAllDocs, queryCollectionByUsername, createDoc, createAndSendTournamentInvitation,
} from '../../services/firestore';
import { availableTournaments } from '../../services/tournaments';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DataListSearch from '../../components/DataListSearch/DataListSearch';
import Checkbox from '../../components/Checkbox/Checkbox';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import RemoveableListItem from '../../components/RemoveableListItem/RemoveableListItem';

import './NewTournament.scss';

export default function NewTournament() {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const [form, setForm] = useState(null);
  const [pointSystem, setPointSystem] = useState(null);
  const [usernameList, setUsernameList] = useState([]);
  const [prospectivePlayers, setProspectivePlayers] = useState([]);

  const [titleError, setTitleError] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [scaleError, setScaleError] = useState(null);
  const [pointsError, setPointsError] = useState(null);
  const [prospectivePlayersError, setProspectivePlayersError] = useState(null);

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
    const response = await queryCollectionByUsername('users', e.target.value);
    const searchUsernames = response.map((item) => item.username);
    setUsernameList(searchUsernames);
  };

  const addPlayer = (e) => {
    e.preventDefault();
    const username = document.getElementById('prospectivePlayers').value;
    if (username === '') { return setProspectivePlayersError('Type a player to add him/her'); }
    if (!usernameList.includes(username)) { return setProspectivePlayersError('Player not found'); }
    if (!prospectivePlayers.includes(username) && username !== '') {
      setProspectivePlayersError(null);
      setProspectivePlayers([...prospectivePlayers, username]);
      document.getElementById('prospectivePlayers').value = '';
    } else {
      setProspectivePlayersError('Player already added');
    }
    return null;
  };

  const removePlayer = (element) => {
    const newArray = prospectivePlayers.filter((item) => item !== element);
    setProspectivePlayers(newArray);
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

  const handleOnSubmit = async () => {
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
    if (form?.isPublic || prospectivePlayers.length >= 2) { setProspectivePlayersError(null); } else { return setProspectivePlayersError('Add at least two players'); }

    const newTournament = {
      admin: user.username,
      ...form,
      players: [],
      pointSystem: { ...pointSystem },
      prospectivePlayers,
      status: 'Scheduled',
    };
    if (form?.isPublic) { newTournament.players = []; }
    if (form?.scaleSystem !== 'Score') { delete newTournament.pointSystem; }

    const res = await createDoc('tournaments', newTournament);
    prospectivePlayers.forEach((player) => {
      createAndSendTournamentInvitation(res.id, form.title, player);
    });
    dispatch(setIntercept({
      title: 'Tournament created successfully',
      message: 'You can now go back to the list of tournaments, all players have received an invite to join the tournament',
      navigation: '/profile',
      buttonMsg: 'Continue',
    }));
    return null;
  };

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
            name="prospectivePlayers"
            labelText="Players"
            onChange={searchOnChangeUsernames}
            options={usernameList}
            error={prospectivePlayersError}
          />
          <ButtonPrimary isSubmit onClick={addPlayer}>Add player</ButtonPrimary>
          {prospectivePlayers.length > 0
            ? (
              <div className="new-tournament__players">
                {prospectivePlayers.map((player) => (
                  <RemoveableListItem element={player} onRemove={removePlayer} />
                ))}
              </div>
            )
            : (
              <h4>No players added</h4>
            )}
        </>
        )}
        <ButtonPrimary isSubmit={false} onClick={handleOnSubmit}>Create Tournament</ButtonPrimary>
      </form>
    </div>
  );
}
