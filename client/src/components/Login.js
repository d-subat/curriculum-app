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
  const submitSignIn = (e, type) => {
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
    <div className="topic" style={{flexDirection:"row"}}>
          <div className={signEmail? "sliderTab open": "sliderTab closed"}>
      <h1>Anmelden</h1>
              
          <SignIn type="Google" />
          <SignIn type="Facebook" />
          <div className="field">
          <button
            className={"btn Mail social"}
            onClick={() => toggleEmail(!signEmail)}>
            <SvgIcon name="Mail" /> Anmelden mit Email
          </button>
        
      </div>
      </div>
      {signEmail && (
        <div className={signRegistration ? "sliderTab open" : "sliderTab closed" }>
          <h1>Email Anmeldung</h1>
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

            <div className="field" style={{display:"flex",justifyContent:"space-between"}}>
            <button 
                type="submit"
                onClick={() => toggleEmail(!signEmail)}
                className="btn notify">
                         <SvgIcon name="back" />
              </button>

            <button className="btn confirm" onClick={() => toggleRegistration(!signRegistration)}>
          Noch keinen Account?{" "}
        </button>    <button
                type="submit"
                onClick={e => submitSignIn(e, "login")}
                className="btn notify"
              >
                Anmelden
              </button>
            </div>
          </div>
        </div>
      )}
      {signRegistration && (
        <div className="sliderTab closed"> 
          <h1>Neuen Account anlegen</h1>
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

            <div className="field" style={{display:"flex",justifyContent:"space-between"}}>
            <button
                type="submit"
                onClick={() => toggleRegistration(!signRegistration)}
                className="btn notify">
                         <SvgIcon name="back" />
              </button>
              <button
                type="submit"
                onClick={e => submitSignIn(e, "register")}
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
    <div className="field">
      <button className={`btn ${props.type} social`} type="submit">
        <SvgIcon name={props.type} /> Anmelden mit {props.type}
      </button>
      </div>
    );
};

export default Login;
