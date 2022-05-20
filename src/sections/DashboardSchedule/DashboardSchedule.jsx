/* eslint-disable react/no-array-index-key */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { resultsHandler } from '../../services/tournaments';

import ButtonPrimary from '../../components/Buttons/ButtonPrimary';
import Select from '../../components/Select/Select';
import './DashboardSchedule.scss';

export default function DashboardSchedule({ tournament, playerAndIdObj, onResultsChange }) {
  const { schedule, type, scaleSystem } = tournament;
  const [currentRound, setCurrentRound] = useState(0);
  const [resultsOptions, setResultsOptions] = useState([]);
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const $roundSelector = document.getElementById('goToRound');

  const retrieveUsername = (id) => {
    if (playerAndIdObj.length > 0) {
      const player = playerAndIdObj.find((p) => p.id === id);
      return player.username;
    } return null;
  };

  const handleOnChange = (e) => {
    if (e.target.value === '') {
      setResult('');
      setIsVisible(false);
    } else {
      setResult(e.target.value);
      setIsVisible(true);
    }
  };

  const handleOnChangeResults = (index) => {
    const $resultSelector = document.getElementById(`resultP1-${currentRound}`);
    $resultSelector.options[0].selected = true;
    setIsVisible(false);
    onResultsChange(index, result);
    setResult('');
  };

  const nextRound = () => {
    if (currentRound < schedule.length - 1) {
      const $resultSelector = document.getElementById(`resultP1-${currentRound}`);
      $resultSelector.options[0].selected = true;
      setResult('');
      setIsVisible(false);
      setErrorMsg('');
      setCurrentRound(currentRound + 1);
    } else {
      setErrorMsg('This is the final round');
    }
  };
  const previousRound = () => {
    if (currentRound > 0) {
      const $resultSelector = document.getElementById(`resultP1-${currentRound}`);
      $resultSelector.options[0].selected = true;
      setCurrentRound(currentRound - 1);
      setResult('');
      setIsVisible(false);
      setErrorMsg('');
    } else {
      setErrorMsg('This is the first round');
    }
  };
  const goToRound = () => {
    const round = $roundSelector.value;
    if (round > 0 && round <= schedule.length) {
      const $resultSelector = document.getElementById(`resultP1-${currentRound}`);
      $resultSelector.options[0].selected = true;
      const numRound = parseInt(round, 10);
      setCurrentRound(numRound - 1);
      setResult('');
      setIsVisible(false);
      $roundSelector.value = '';
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid round');
    }
  };

  useEffect(() => {
    if (tournament) {
      let incompleteRound = schedule.findIndex((round) => round.resultP1 === 'TBD');
      if (incompleteRound === -1) {
        setIsFinished(true);
        incompleteRound = schedule.length - 1;
      } else {
        setIsFinished(false);
      }
      setCurrentRound(incompleteRound);

      const results = resultsHandler(type, scaleSystem);
      setResultsOptions(results);
    }
  }, [tournament]);

  return (
    <div className="dashboard__schedule">
      <h2 className="dashboard__schedule__title">Round control</h2>
      {schedule.map((round, index) => (
        <div key={index} className={`schedule__round ${currentRound === index ? 'schedule__round--active' : ''}`}>
          <h3>{`Game ${index + 1}`}</h3>
          <p>{`${retrieveUsername(round.player1)} vs ${retrieveUsername(round.player2)}`}</p>
          <p>{`Result for ${retrieveUsername(round.player1)}: ${round.resultP1}`}</p>
          <Select
            name={`resultP1-${index}`}
            labelText={round.resultP1 === 'TBD' ? 'Set result' : 'Update result'}
            options={resultsOptions}
            onChange={handleOnChange}
          />
          {isVisible && (
            <ButtonPrimary isSubmit={false} onClick={() => handleOnChangeResults(index)}>
              Confirm result
            </ButtonPrimary>
          )}
        </div>
      ))}
      <p>{`Rounds: ${currentRound + 1}/${schedule.length}`}</p>
      <div className="schedule__controls">
        <ButtonPrimary isSubmit={false} onClick={previousRound}>{'<'}</ButtonPrimary>
        <input type="number" id="goToRound" className="form__input--small" />
        <ButtonPrimary isSubmit={false} onClick={goToRound}>Go</ButtonPrimary>
        <ButtonPrimary isSubmit={false} onClick={nextRound}>{'>'}</ButtonPrimary>
      </div>
      {errorMsg && <p className="form__error--generic">{errorMsg}</p>}
      {isFinished && <p className="form__success--generic title--generic schedule__finish">All games completed</p>}
    </div>
  );
}

const round = PropTypes.shape({
  player1: PropTypes.string.isRequired,
  player2: PropTypes.string.isRequired,
  resultP1: PropTypes.string.isRequired,
});

const nameAndId = PropTypes.shape({
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

DashboardSchedule.propTypes = {
  tournament: PropTypes.shape({
    schedule: PropTypes.arrayOf(round),
    type: PropTypes.string.isRequired,
    scaleSystem: PropTypes.string.isRequired,
  }).isRequired,
  playerAndIdObj: PropTypes.arrayOf(nameAndId).isRequired,
  onResultsChange: PropTypes.func.isRequired,
};
