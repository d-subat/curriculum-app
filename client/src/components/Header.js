import React from "react";
import { Link, withRouter } from "react-router-dom";
import SvgIcon from "./SvgIcon";

const Header = props => {
  return (
    <>
      <header>
        <Link style={{flex:1}} to="/">Curriculum Vitae</Link>
        {props.history.location.pathname !== "/" ? (
          <Link to="/" style={{ justifyContent:"center",flex:1,color: "white" }}>            
            <SvgIcon name="back" />
            {props.history.location.pathname.substr(1)}
          </Link>
        ) : <div style={{ textAlign:"center",flex:1,color: "white" }}> {props.profileName}</div>
        }        
        <div style={{textAlign:"right",flex:1}}>Logout</div>
      </header>
    </>
  );
};

export default withRouter(Header);
