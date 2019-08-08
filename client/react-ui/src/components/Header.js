import React  from "react";
import { Link,withRouter } from "react-router-dom";
import SvgIcon from "./SvgIcon";







const Header = props => {

  return (
    <>
      <header>
        <Link to="/">
        
          Curriculum Vitae
        </Link>
        
        {props.history.location.pathname !=="/" && 
        <Link to="/">
        <SvgIcon name="back" />{props.history.location.pathname.substr(1,) }
      </Link>
}
        <div>
        
        </div>
        <div>Logout</div>
      </header>
  
 

    </>
  );
};

export default withRouter(Header);

  
 