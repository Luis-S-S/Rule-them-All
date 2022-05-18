const availableTournaments = [
  'Free For All',
  'Single Elimination',
  'Double Elimination',
  'Round Robin',
  'Knockout',
];

function ffaScheduleGenerator(participants) {
  const totalParticipants = participants.length;
  const isOdd = totalParticipants % 2 === 1;
  let rounds;
  let gamesPerRound;
  const schedule = [];

  if (isOdd) {
    rounds = totalParticipants;
    gamesPerRound = (totalParticipants + 1) / 2;
    for (let i = 0; i < rounds * gamesPerRound; i += 1) {
      const offset = i % gamesPerRound !== 0;
      const data = i % totalParticipants;
      if (offset) {
        schedule.push({ player1: participants[data] });
      }
    }

    let index = totalParticipants - 1;
    for (let i = 0; i < schedule.length; i += 1) {
      schedule[i].player2 = participants[index];
      schedule[i].resultP1 = 'TBD';
      if (index !== 0) { index -= 1; } else { index = totalParticipants - 1; }
    }
  } else {
    rounds = totalParticipants - 1;
    gamesPerRound = totalParticipants / 2;
    for (let i = 0; i < rounds * gamesPerRound; i += 1) {
      const correction = totalParticipants - 1;
      const offset = Math.floor(i / correction);
      const data = i - (offset * correction);
      schedule.push({ player1: participants[data] });
    }

    for (let i = 0; i < rounds; i += 1) {
      schedule[i * gamesPerRound].player2 = participants[totalParticipants - 1];
      schedule[i * gamesPerRound].resultP1 = 'TBD';
    }

    let index = totalParticipants - 2;
    for (let i = 0; i < rounds * gamesPerRound; i += 1) {
      if (i % gamesPerRound !== 0) {
        schedule[i].player2 = participants[index];
        schedule[i].resultP1 = 'TBD';
        if (index !== 0) { index -= 1; } else { index = totalParticipants - 2; }
      }
    }
  }

  return schedule;
}

export function scheduleHandler(tournamentType, participants) {
  let schedule;
  switch (tournamentType) {
    case 'Free For All':
      schedule = ffaScheduleGenerator(participants);
      break;
    case 'Single Elimination':
      break;
    case 'Double Elimination':
      break;
    case 'Round Robin':
      break;
    case 'Knockout':
      break;
    default:
      break;
  }
  return schedule;
}

export { availableTournaments };
