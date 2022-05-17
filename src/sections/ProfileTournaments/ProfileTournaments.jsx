import './ProfileTournaments.scss';

export default function ProfileInfo() {
  return (
    <div className="profile-page__tournaments">
      <h1>Tournaments</h1>
      <div className="profile-tournaments__container">
        <div className="profile-tournaments__item">Created</div>
        <div className="profile-tournaments__item">Participating</div>
        <div className="profile-tournaments__item">Finished</div>
      </div>
    </div>
  );
}
