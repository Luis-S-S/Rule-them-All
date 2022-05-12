export default function Login() {
  return (
    <div className="login-container">
      <form className="login-form">
        <div className="form__control">
          <label htmlFor="email">
            Email
            <input type="email" id="email" />
          </label>
        </div>
        <div className="form__control">
          <label htmlFor="password">
            Password
            <input id="password" type="password" />
          </label>
        </div>
      </form>
    </div>
  );
}
