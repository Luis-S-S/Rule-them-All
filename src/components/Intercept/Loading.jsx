import './Intercept.scss';

export default function Loading() {
  return (
    <div className="loading__bg">
      <div className="loading-page__container">
        <h1 className="loading-page__title">
          Loading...
        </h1>
        <span className="loading-page__animation" />
      </div>
    </div>
  );
}
