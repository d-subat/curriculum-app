import React, { useState } from "react";
import SvgIcon from "./SvgIcon";
import { Redirect } from "react-router-dom";
import axios from "axios";

const Login = (props) => {
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
  const submitSignIn = (e, type) => {
    e.preventDefault();
    console.log(form);
    const url = type === "login" ? "http://localhost:4000/login" : "/register";


    async function fetchData() {
      const result = await axios.post(
        url,
        form // JSON.stringify(data[props.match.params.id]),
      );
      console.log(result);
      props.history.push('/ ')
    //  props.setUpdate(!props.updateStatus);
      
      
    }
    fetchData();
    
  };
  return (
    <div className="login" >
  <h3  >
    <img src="/logo.svg" alt="curriculum vitae logo" width="64" /> CVDocuments <span> v0.1</span>
  </h3>
    <div className="topic login" style={{ flexDirection: "row" }}>
      <div className={signEmail ? signRegistration? "sliderTab closed" : "sliderTab open": "sliderTab "}>
        <h1>Anmelden</h1>
        <SignIn type="Google" submitSignIn={submitSignIn} />
        <SignIn type="Facebook" submitSignIn={submitSignIn} />
        <div className="field">
          <button
            className={"btn Mail social"}
            onClick={() => toggleEmail(!signEmail)}>
            <SvgIcon name="Mail" /> Anmelden mit Email
          </button>
        </div>
      </div>
      {signEmail && (
        <div className={signRegistration ? signEmail? "sliderTab open" : "sliderTab closed": "sliderTab"}>
          <h1>Email Anmeldung</h1>
          <div className="field">
            <div class="row">
              <input
                type="text"
                name="username"
                placeholder="username"
                id="username"
                onChange={handleChange}
                required/>
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
                required />
              <label for="password">Password </label>
              <SvgIcon name="edit" />
            </div>
            <div
              className="field"
              style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => toggleEmail(!signEmail)}
                className="btn notify">
                <SvgIcon name="back" />
              </button>
              <button
                className="btn confirm"
                onClick={() => toggleRegistration(!signRegistration)}>
                Noch keinen Account?
              </button>
              <button
                type="submit"
                onClick={e => submitSignIn(e, "login")}
                className="btn notify">
                Anmelden
              </button>
            </div>
          </div>
        </div>
      )}
      {signRegistration && (
        <div className={signRegistration ? signEmail? "sliderTab closed" : "sliderTab open": "sliderTab"}>
          <h1>Neuen Account anlegen</h1>
          <div className="field">
            <div class="row">
              <input
                type="text"
                name="username"
                placeholder="username"
                id="username"
                onChange={handleChange}
                required/>
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
                required/>
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
                required/>
              <label for="password">Password </label>
              <SvgIcon name="edit" />
            </div>
            <div
              className="field"
              style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => toggleRegistration(!signRegistration)}
                className="btn notify">
                <SvgIcon name="back" />
              </button>
              <button
                type="submit"
                onClick={e => submitSignIn(e, "register")}
                className="btn notify">
                Account erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
const SignIn = props => {
  return (
    <div className="field">
      <a className={`btn ${props.type} social`}    href={"http://localhost:4000/auth/" + props.type.toLowerCase()}
                >
        <SvgIcon name={props.type} /> Anmelden mit {props.type}
      </a>
    </div>
  );
};

export default Login;
