import { useState, useContext, useEffect } from 'react';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import {
  getAllDocs,
  queryCollectionByUsername,
  createDoc,
  createAndSendTournamentInvitation,
  getAllDocsByField,
} from '../../services/firestore';
import { availableTournaments } from '../../services/tournaments';

import ButtonPrimary from '../../components/Buttons/ButtonPrimary';
import Checkbox from '../../components/Checkbox/Checkbox';
import DataListSearch from '../../components/DataListSearch/DataListSearch';
import Input from '../../components/Input/Input';
import InputSmall from '../../components/Input/InputSmall';
import RemoveableListItem from '../../components/RemoveableListItem/RemoveableListItem';
import Select from '../../components/Select/Select';

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
  const [maxPlayersError, setMaxPlayersError] = useState(null);

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
    if (prospectivePlayers.includes(username)) { return setProspectivePlayersError('Player already added'); }
    setProspectivePlayersError(null);
    setProspectivePlayers([...prospectivePlayers, username]);
    document.getElementById('prospectivePlayers').value = '';
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
      return setForm({ ...form, [e.target.name]: e.target.checked });
    }
    if (e.target.name === 'maxPlayers') {
      return setForm({ ...form, [e.target.name]: e.target.value });
    }
    return setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const handleOnSubmit = async () => {
    if (titleError) { return setTitleError('Title already exists'); }
    if (form?.title) { setTitleError(null); } else { return setTitleError('Title is required'); }
    if (form?.type) { setTypeError(null); } else { return setTypeError('Type is required'); }
    if (form?.scaleSystem) { setScaleError(null); } else { return setScaleError('Select a point system'); }
    if (form?.scaleSystem === 'Points') {
      if (pointSystem?.win && pointSystem?.tie && pointSystem?.loss) {
        setPointsError(null);
      } else {
        return setPointsError('Points are required');
      }
    }
    if (form?.isPublic) {
      if (form?.maxPlayers) {
        setMaxPlayersError(null);
      } else {
        return setMaxPlayersError('Max players is required');
      }
      if (form?.maxPlayers >= 2) {
        setMaxPlayersError(null);
      } else {
        return setMaxPlayersError('Minimum of 2 players to create a tournament');
      }
    }
    if (!form?.isPublic) {
      if (prospectivePlayers.length >= 2) {
        setProspectivePlayersError(null);
      } else {
        return setProspectivePlayersError('Add at least two players');
      }
    }

    const promises = prospectivePlayers.map((item) => getAllDocsByField(item, 'users'));
    const promisesResult = await Promise.all(promises);
    const newProstectivePlayers = promisesResult.map((item) => item[0].id);

    const newTournament = {
      admin: user.id,
      ...form,
      players: [],
      pointSystem: { ...pointSystem },
      prospectivePlayers: newProstectivePlayers,
      status: 'Scheduled',
    };
    if (!form?.isPublic) { newTournament.isPublic = false; delete newTournament.maxPlayers; }
    if (form?.isPublic) { delete newTournament.prospectivePlayers; }
    if (form?.scaleSystem !== 'Points') { delete newTournament.pointSystem; }

    await createDoc('tournaments', newTournament);
    if (!form?.isPublic) {
      newProstectivePlayers.forEach((player) => {
        createAndSendTournamentInvitation(form.title, player);
      });
    }
    dispatch(setIntercept({
      title: 'Tournament created successfully',
      message: 'You can now go back to the list of tournaments, all players have received an invite to join the tournament',
      navigation: '/profile',
      buttonMsg: 'Continue',
    }));
    return null;
  };

  useEffect(() => {
    const [$prospectivePlayersDiv] = document.getElementsByClassName('new-tournament__players');
    $prospectivePlayersDiv?.scrollTo(0, $prospectivePlayersDiv.scrollHeight);
  }, [prospectivePlayers]);

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
          dataCy="new-tournament-title"
          className="label-white--generic"
        />
        <Input
          type="text"
          name="game"
          labelText="Game Title"
          onChange={handleOnChange}
          placeholder="Game Title"
          dataCy="new-tournament-game"
          className="label-white--generic"
        />
        <Select
          name="type"
          labelText="Tournament Type"
          options={availableTournaments}
          onChange={handleOnChange}
          error={typeError}
          dataCy="new-tournament-type"
          className="label-white--generic"
        />
        <Checkbox
          name="isPublic"
          labelText="Is an open tournament?"
          onChecked={handleOnChange}
          dataCy="new-tournament-public"
          className="label-white--generic"
        />
        <Select
          name="scaleSystem"
          labelText="How are you going to keep score?"
          options={['Win/Loss', 'Points']}
          onChange={handleOnChange}
          error={scaleError}
          dataCy="new-tournament-scale"
          className="label-white--generic"
        />
        {form?.scaleSystem === 'Points' && (
        <div>
          <InputSmall
            type="number"
            name="win"
            labelText="Winner Points"
            onChange={handleOnChangePoints}
            format="inline"
            error={pointsError}
            className="label-white--generic"
          />
          <InputSmall
            type="number"
            name="tie"
            labelText="Tie Game Points"
            onChange={handleOnChangePoints}
            format="inline"
            error={pointsError}
            className="label-white--generic"
          />
          <InputSmall
            type="number"
            name="loss"
            labelText="Loser Points"
            onChange={handleOnChangePoints}
            format="inline"
            error={pointsError}
            className="label-white--generic"
          />
        </div>
        )}
        {form?.isPublic ? (
          <InputSmall
            type="number"
            name="maxPlayers"
            labelText="Max Players"
            onChange={handleOnChange}
            error={maxPlayersError}
            dataCy="new-tournament-max"
            className="label-white--generic"
          />
        ) : (
          <>
            <DataListSearch
              name="prospectivePlayers"
              labelText="Players"
              onChange={searchOnChangeUsernames}
              options={usernameList}
              error={prospectivePlayersError}
              dataCy="new-tournament-players"
              className="label-white--generic"
            />
            <ButtonPrimary isSubmit onClick={addPlayer} dataCy="new-tournament-add-player">Add player</ButtonPrimary>
            {prospectivePlayers.length > 0
              ? (
                <div className="new-tournament__players">
                  {prospectivePlayers.map((player) => (
                    <RemoveableListItem key={player} element={player} onRemove={removePlayer} />
                  ))}
                </div>
              )
              : (
                <h4 className="new-tournament-title">No players added</h4>
              )}
          </>
        )}
        <ButtonPrimary isSubmit={false} onClick={handleOnSubmit} dataCy="new-tournament-create">Create Tournament</ButtonPrimary>
      </form>
    </div>
  );
}
