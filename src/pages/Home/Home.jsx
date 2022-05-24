/* eslint-disable max-len */
import './Home.scss';

export default function Home() {
  return (
    <main className="about-page">
      <h1 className="page-title--generic about__title">Quickstart</h1>
      <div className="about__container">
        <section className="about__section">
          <h1 className="about-section__title title--generic">How to create tournaments?</h1>
          <ol className="about__list">
            <li>
              Access the menu
              {' '}
              <span className="burguer-icon__container">
                <img className="burguer-icon" src="/icons/burguer-menu-icon.svg" alt="Menu Icon" />
              </span>
              {' '}
              at the top left corner
            </li>
            <li>
              Select the
              {' '}
              <i>Tournaments</i>
              {' '}
              option
            </li>
            <li>Click the icon</li>
            <li>Fill in all the information for your tournament</li>
            <li>
              Click the
              {' '}
              <i><strong>Create tournament</strong></i>
              {' '}
              button
            </li>
          </ol>
          <ul className="list__notes">
            <li>
              Notes
              <ul>
                <li>Available tournaments are: Free for all. Expect different formats in newer versions</li>
                <li>Open tournaments are available to all users</li>
                <li>Closed tournaments are available only to the players to invite</li>
                <li>Once you schedule the tournament you can&apos;t invite more players, be careful!</li>
              </ul>
            </li>
          </ul>
        </section>
        <section className="about__section">
          <h1 className="about-section__title title--generic">How to join a tournament?</h1>
          <ul>
            <li>
              Public tournaments
              <ol className="about__list">
                <li>
                  Access the menu
                  {' '}
                  <span className="burguer-icon__container">
                    <img className="burguer-icon" src="/icons/burguer-menu-icon.svg" alt="Menu Icon" />
                  </span>
                  {' '}
                  at the top left corner
                </li>
                <li>
                  Select the
                  {' '}
                  <i>Tournaments</i>
                  {' '}
                  option
                </li>
                <li>
                  In the
                  {' '}
                  <i><strong>Join a tournament!</strong></i>
                  {' '}
                  section find one that interest you
                </li>
                <li>
                  Click the
                  {' '}
                  <i><strong>Join tournament</strong></i>
                  {' '}
                  button and follow the instructions
                </li>
              </ol>
            </li>
          </ul>
          <ul>
            <li>
              Private tournaments
              <ol className="about__list">
                <li>Expect the invitation from the tournament master...</li>
                <li>
                  Access the menu
                  {' '}
                  <span className="burguer-icon__container">
                    <img className="burguer-icon" src="/icons/burguer-menu-icon.svg" alt="Menu Icon" />
                  </span>
                  {' '}
                  at the top left corner
                </li>
                <li>
                  Select the
                  {' '}
                  <i>Invitations</i>
                  {' '}
                  option
                </li>
                <li>Click the accept button</li>
              </ol>
            </li>
          </ul>
          <ul className="list__notes">
            <li>
              Notes
              <ul>
                <li>Once you accept an invitation or join an invitation, only the tournament master can remove you</li>
              </ul>
            </li>
          </ul>
        </section>
        <section className="about__section">
          <h1 className="about-section__title title--generic">How to track a tournament?</h1>
          <ol>
            <li>
              Access the menu
              {' '}
              <span className="burguer-icon__container">
                <img className="burguer-icon" src="/icons/burguer-menu-icon.svg" alt="Menu Icon" />
              </span>
              {' '}
              at the top left corner
            </li>
            <li>
              Select the
              {' '}
              <i>Profile or Tournaments</i>
              {' '}
              option
            </li>
            <li>
              Click the
              {' '}
              <i><strong>Standings</strong></i>
              {' '}
              button
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
