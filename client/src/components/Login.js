import React, { useState } from "react";
import SvgIcon from "./SvgIcon";
import axios from "axios";

const Login = () => {
  const [signEmail, toggleEmail] = useState(false);
  const [signRegistration, toggleRegistration] = useState(false);
  const [form, setValues] = useState({});

  const handleChange = e => {
    const fieldName = e.target.id;
    setValues({
      ...form,
      [fieldName]: e.target.value
    });
  };
  const submitEMail = (e, type) => {
    e.preventDefault();
    console.log(form);
    const url = type === "login" ? "/login" : "/register";

    async function fetchData() {
      const result = await axios.post(
        url,
        form // JSON.stringify(data[props.match.params.id]),
      );
      /*
      props.setUpdate(!props.updateStatus);
      toggleStatus(true);
      setPostData(result.data);
      */
    }
    fetchData();
  };
  return (
    <div className="topic">
      <h1>Anmelden</h1>
      <div class="field">
        <div className="fieldrow">
          <SignIn type="Google" />
          <SignIn type="Facebook" />
          <button
            className={"btn Mail"}
            onClick={() => toggleEmail(!signEmail)}
          >
            <SvgIcon name="Mail" /> Anmelden mit Email
          </button>
        </div>
        <button onClick={() => toggleRegistration(!signRegistration)}>
          Noch keinen Account?{" "}
        </button>
      </div>
      {signEmail && (
        <div className={signEmail ? "open" : "closed"}>
          <h2>Email Anmeldung</h2>
          <div className="field">
            <div class="row">
              <input
                type="text"
                name="username"
                placeholder="username"
                id="username"
                onChange={handleChange}
                required
              />
              <label for="username">Username </label>
              <SvgIcon name="edit" />
            </div>
          </div>

          <div className="field">
            <div class="row">
              <input
                type="password"
                placeholder="password"
                name="password"
                id="password"
                onChange={handleChange}
                required
              />
              <label for="password">Password </label>
              <SvgIcon name="edit" />
            </div>

            <div className="field">
              <button
                type="submit"
                onClick={e => submitEMail(e, "login")}
                className="btn notify"
              >
                Anmelden
              </button>
            </div>
          </div>
        </div>
      )}
      {signRegistration && (
        <div className={signRegistration ? "open" : "closed"}>
          <h2>Neuen Account anlegen</h2>
          <div className="field">
            <div class="row">
              <input
                type="text"
                name="username"
                placeholder="username"
                id="username"
                onChange={handleChange}
                required
              />
              <label for="username">Username </label>
              <SvgIcon name="edit" />
            </div>
          </div>
          <div className="field">
            <div class="row">
              <input
                type="email"
                placeholder="usermail"
                name="usermail"
                id="usermail"
                onChange={handleChange}
                required
              />
              <label for="usermail">Email </label>
              <SvgIcon name="edit" />
            </div>
          </div>
          <div className="field">
            <div class="row">
              <input
                type="password"
                placeholder="password"
                name="password"
                id="password"
                onChange={handleChange}
                required
              />
              <label for="password">Password </label>
              <SvgIcon name="edit" />
            </div>

            <div className="field">
              <button
                type="submit"
                onClick={e => submitEMail(e, "register")}
                className="btn notify"
              >
                Account erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const SignIn = props => {
  return (
    <form>
      <button className={`btn ${props.type}`} type="submit">
        <SvgIcon name={props.type} /> Anmelden mit {props.type}
      </button>
    </form>
  );
};

export default Login;
