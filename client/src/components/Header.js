import React from "react";
import { Link, withRouter } from "react-router-dom";
import SvgIcon from "./SvgIcon";
 
const Header = props => {
  
  const handleBackgroundColor = e => {
    //hextorgb
    const r = parseInt(e.target.value.substr(1, 2), 16) / 255;
    const g = parseInt(e.target.value.substr(3, 2), 16) / 255;
    const b = parseInt(e.target.value.substr(5, 2), 16) / 255;
    //rgbtohsl
    const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:  h = (g - b) / d + (g < b ? 6 : 0); 
          break;
        case g:  h = (b - r) / d + 2;
          break;
        case b:  h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    h =  parseInt(h * 360).toFixed(1)
    s = (s * 100).toFixed(1) + "%"
    l = (l * 100).toFixed(1) + "%"
    document.documentElement.style.setProperty("--primaryColor", h );
    document.documentElement.style.setProperty("--primarySat",   s );
    document.documentElement.style.setProperty("--primaryLight", l );
  };
  return (
    <>
      <header>
        <Link style={{ flex: 1 }} to="/">
          <img src="/logo.svg" alt="curriculum vitae logo" />
        </Link>
        {props.history.location.pathname !== "/" ? (
          <Link
            to="/"
            style={{
              justifyContent: "center",
              display: "flex",
              flex: 1,
              color: "white"
            }}
          >
            <SvgIcon name="back" />
            {props.history.location.pathname.substr(1)}
          </Link>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "1em",
              flex: 1,
              color: "white"
            }}
          >
            {" "}
            Curriculum Vitae{" "}
          </div>
        )}
        <div
          className="navMenu"
          style={{
            textAlign: "right",
            flex: 1,
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <label
            style={{ padding: "1em", borderLeft: "1px solid white" }}
            htmlFor="colorChooser"
          >
            <SvgIcon name="settings" />
            <input
              onChange={handleBackgroundColor}
              type="color"
              id="colorChooser"
              name="colorChooser"
              value="#e66465"
            />
          </label>

          <div
            onClick=""
            style={{ padding: "1em 0 1em 1em", borderLeft: "1px solid white" }}
          >
            <SvgIcon name="user" />
          </div>
        </div>
      </header>
    </>
  );
};

export default withRouter(Header);
