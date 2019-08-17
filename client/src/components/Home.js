import React from "react";
import { NavLink } from "react-router-dom";

import SvgIcon from "./SvgIcon";
import Loading from "./Loading";
const Home = props => {



  return (
    <>

      <NavLink
        className="profile new" title="profile pic"
        style={{  cursor:"pointer" }}
        to="/Profil"  >
        <img src={props.profileImg} alt="profile pic" />
      
        <div className="profileName new">
          Profil erstellen
        </div>
     
        </NavLink>


      <NavLink
        className="btn notify"
        style={{ margin: "3em 4em 2em 4em" }}
        to="/pdfview"  >
        PDF-Ansicht
      </NavLink>
      <NavLink
        className="btn notify"
        style={{ margin: "3em 4em 2em 4em" }}
        to="/webview"  >
        Web-Ansicht
      </NavLink>

    </>
  );
};

export default Home;
