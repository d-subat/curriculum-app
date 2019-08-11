import React, {useState} from "react";
import SvgIcon from "./SvgIcon";
import axios from "axios";

const Logins = () => {
  const [signEmail, toggleEmail] = useState(true);
  const [signRegistration, toggleRegistration] = useState(true);
  const [form, setValues] = useState({})

  const handleChange = e => {
    const fieldName = e.target.id; 
      setValues({
      ...form,
      [fieldName]: e.target.value
    });    
    
  };
const submitEMail = (e,type) => {
  e.preventDefault();
  console.log(form)
  const url = type==="login" ? "/login" : "/register";

    async function fetchData() {
      const result = await axios.post(url, 
         form,  // JSON.stringify(data[props.match.params.id]),
        
      );
      /*
      props.setUpdate(!props.updateStatus);
      toggleStatus(true);
      setPostData(result.data);
      */
    }
    fetchData();
  
}
    return (
    <div className="topic" >
<h1>Anmelden</h1>
        <div class="field">
          
          <div className="fieldrow">
            <SignIn type="Google" />            
            <SignIn type="Facebook" />
            <SignIn type="Mail" onClick={toggleEmail}   />
          </div>
          <button onClick={toggleRegistration}   />
        </div>
       
        <div className={signRegistration? "manually " : "manually closed"}>
        <legend>EMail ANmeldung</legend>
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
            </div></div>
       
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
          <button type="submit"      onClick={(e) => submitEMail(e,"login")} className="btn notify" >
            Anmelden
          </button>
        </div>
        </div>
        
  
        </div>

        <div className={signEmail? "manually " : "manually closed"}>
        <legend>Create New Account</legend>
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
            </div></div>
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
            </div></div>
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
          <button type="submit"      onClick={(e) => submitEMail(e,"register")} className="btn notify" >
            Account erstellen
          </button>
        </div>
        </div>
        
  
        </div>
    </div>

  );
};
const SignIn = (props) => {
    return (
      <form>
        <button className={`btn ${props.type}`} type="submit">
          <SvgIcon name={props.type} /> Login with  {props.type}
        </button>


      </form>
    );
  }

export default Logins;
