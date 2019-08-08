import React  from "react";
import { NavLink } from "react-router-dom";
 
import { isObject } from "util";
import SvgIcon from "./SvgIcon";

const Home = props => {
 
  const renderData = serverData => {
    return (
      <>
        {Object.keys(serverData).map((item, index) => (
          <details key={index}>
            <summary>
              <div>{item} </div>
              <NavLink   to= {`/Daniel Subat/${item}`}>
                <SvgIcon name="edit" />
              </NavLink>
            </summary>
            {parseJSON(serverData[item])}
          </details>
        ))}
      </>
    );
  };
 
  const parseJSON = (jsonObject, test, test1) => {
    return (
      <>
        {jsonObject && typeof jsonObject === "string" ? (
          <div className="field">
            <label htmlFor={test}> {test}</label>
            <div name={test}> {jsonObject} </div>
          </div>
        ) : (
          Object.keys(jsonObject).map((item, i) => {
            return (
              <>
                {isObject(jsonObject[item]) ? (
                  parseJSON(jsonObject[item])
                ) : (
                  <div key={i} className="field">
                    
                    <label htmlFor={item}> {item}</label>
                    <div name={item} className={item}>
                      
                      {jsonObject[item]}
                    </div>
                  </div>
                )}
              </>
            );
          })
        )}
      </>
    );
  };

  return (
    <>
      <div className="profile">
        <label className="file" htmlFor="file">
          <SvgIcon name="image" />
          <input
            type="file"
            onChange={props.getProfileImage}
            id="file"
            accept="image/*"
          />
        </label>
        <div className="profileName">Daniel Subat</div>
        <img src={props.profileImg} alt="profile pic"/>   
      </div>

      {renderData(props.data)}

      <NavLink className="btn notify" to="/signature">
        Unterschrift
      </NavLink>
    
      <div style={{display:"grid",placeContent: "center"}}> 
      <img src={props.signature} width="300" alt="signature" /></div>

      <NavLink className="btn notify" to="/pdfgenerator">
      PDF generieren
      </NavLink>
      
    </>
  );
};

export default Home;
