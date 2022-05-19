import ProfileInfo from '../../sections/ProfileInfo/ProfileInfo';
import ProfileTournaments from '../../sections/ProfileTournaments/ProfileTournaments';

import './Profile.scss';

export default function Profile() {
  return (
    <div className="profile-page">
      <ProfileInfo />
      <ProfileTournaments />
    </div>
  );
}
