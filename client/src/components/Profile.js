import React from "react";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";

import { isObject } from "util";
import SvgIcon from "./SvgIcon";

const Profile = props => {
  const renderData = serverData => {
    return Object.keys(serverData).map((item, index) => (
      <details key={index}>
        <summary>
          <div>{item} </div>
          <NavLink to={`/CV/${item}`}>
            <SvgIcon name="edit" />
          </NavLink>
        </summary>
        {parseJSON(serverData[item])}
      </details>
    ));
  };

  const parseJSON = (jsonObject, test, test1) => {
    return jsonObject && typeof jsonObject === "string" ? (
      <div className="field">
        <label htmlFor={test}> {test}</label>
        <div name={test}> {jsonObject} </div>
      </div>
    ) : (
      Object.keys(jsonObject).map((item, i) => {
        return isObject(jsonObject[item]) ? (
          parseJSON(jsonObject[item])
        ) : (
          <div key={i} className="field">
            <label htmlFor={item}> {item}</label>
            <div name={item} className={item}>
              {jsonObject[item]}
            </div>
          </div>
        );
      })
    );
  };

  return (
    <>
      <div className="profile" title="profile pic">
        <img src={props.profileImg} alt="profile pic" />
        <div className="profileName">
          {Object.keys(props.data).length > 0
            ? props.data["Persönliche Daten"].name
            : ""}
        </div>
        <label className="file" htmlFor="file">
          <SvgIcon name="image" title="Profilbild ändern" />
          <input
            type="file"
            onChange={props.saveProfileImage}
            id="file"
            accept="image/*"
          />
        </label>
      </div>
      {Object.keys(props.data).length > 0 ? (
        renderData(props.data)
      ) : (
        <Loading />
      )}

      <details>
        <summary>
          Unterschrift
          <NavLink to="/signature">
            <SvgIcon name="edit" />
          </NavLink>
        </summary>
        <div style={{ display: "grid", placeContent: "center" }}>
          <img src={props.signature} width="300" alt="signature" />
        </div>
      </details>

 
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="16px"
        height="10px"
      >
        <symbol viewBox="0 0 42 60" id="pointer">
          <path
            fill="#00F"
            d="M8.223,9.818c-0.241,0.242-0.628,0.242-0.871,0L0.181,2.655c-0.241-0.242-0.241-0.638,0-0.879l1.604-1.595			c0.242-0.241,0.629-0.241,0.87,0l5.133,5.133l5.132-5.133c0.242-0.241,0.629-0.241,0.87,0l1.604,1.595			c0.242,0.242,0.242,0.638,0,0.879L8.223,9.818z"
          />
        </symbol>
      </svg>
    </>
  );
};

export default Profile;
