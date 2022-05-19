import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer__container">
      <div className="footer__information">
        <h3 className="footer__title">About the developer!</h3>
        <h4 className="footer__body">Luis Salcedo Salas</h4>
        <p className="footer__body">I am a Full Stack web developer whose excited to discover new technologies! I want to share my journey with you all!</p>
        <p className="footer__body">Check out my social media!</p>
        <div className="social-media__container">
          <a href="https://github.com/Luis-S-S" target="_blank" rel="noreferrer">
            <img className="social-media__icon" src="/icons/github-icon-white.svg" alt="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/luis-salcedo-salas/" target="_blank" rel="noreferrer">
            <img className="social-media__icon" src="/icons/linkedIn-logo-white.svg" alt="LinkedIn" />
          </a>
          <a href="mailto:rideluis@hotmail.com" target="_blank" rel="noreferrer">
            <img className="social-media__icon" src="/icons/email-logo-white.svg" alt="Email" />
          </a>
        </div>
      </div>
    </footer>
  );
}
