import PropTypes from 'prop-types';

import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import './TournamentInvites.scss';

export default function TournamentInvites({ tournamentInvites }) {
  const handleAcceptInvite = () => {};
  const handleRejectInvite = () => {};
  return (
    <section className="tournament-invites__container">
      <h1>Tournament Invitations</h1>
      {tournamentInvites
        ? (
          tournamentInvites.map((tournamentInvite) => (
            <div key={tournamentInvite?.id} className="tournament-invites__invite">
              <p>{`Torneo: ${tournamentInvite?.tournament}`}</p>
              {tournamentInvite?.acceptedInvite
                ? (
                  <ButtonPrimary>Go to tournament</ButtonPrimary>
                )
                : (
                  <>
                    <ButtonPrimary onClick={handleAcceptInvite}>Aceptar</ButtonPrimary>
                    <ButtonPrimary onClick={handleRejectInvite}>Rechazar</ButtonPrimary>
                  </>
                )}
            </div>

          ))
        )
        : (<h1>Currently you don&apos;t have any invitations</h1>)}
    </section>
  );
}

TournamentInvites.propTypes = {
  tournamentInvites: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    player: PropTypes.string.isRequired,
    tournament: PropTypes.string.isRequired,
    acceptedInvite: PropTypes.bool.isRequired,
    timestamp: PropTypes.string.isRequired,
  })).isRequired,
};
