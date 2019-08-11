import React from "react";
import { Link, withRouter } from "react-router-dom";
import SvgIcon from "./SvgIcon";



const Header = props => {
  const handleBackgroundColor = (e) => {

    document.documentElement.style.setProperty("--primary", e.target.value);

/* ## ******************************* ##
   ## TODO ## integrate into session
   ## ******************************* ## */
  }
  return (
    <>
      <header>
        <Link style={{flex:1}} to="/"><img src="/logo.svg" alt="curriculum vitae logo"/></Link>
        {props.history.location.pathname !== "/" ? (
          <Link to="/" style={{ justifyContent:"center",display:"flex",flex:1,color: "white" }}>            
            <SvgIcon name="back" />
            {props.history.location.pathname.substr(1)}
          </Link>
        ) : <div style={{ textAlign:"center",  padding: "1em",flex:1,color: "white" }}> Curriculum Vitae </div>
        }                
        <div className="navMenu"  style={{textAlign:"right",flex:1, display:"flex", justifyContent:"flex-end"}}>
    
    
    <label style={{   padding: "1em",borderLeft: "1px solid white"}} htmlFor="colorChooser"><SvgIcon name="settings" />
    <input onChange={handleBackgroundColor}  type="color" id="colorChooser" name="colorChooser" value="#e66465" />
    </label>
    
        <div onClick="" style={{  padding: "1em 0 1em 1em",borderLeft: "1px solid white"}}><SvgIcon name="user" /></div>
        </div>
      </header>
    </>
  );
};

export default withRouter(Header);
