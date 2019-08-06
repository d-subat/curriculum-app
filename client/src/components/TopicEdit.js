import React, {  useState } from "react";
import axios from "axios";
import { isObject } from "util";

const TopicEdit = ( props) => {
  const [form, setValues] = useState({});
  const [serverPostData, setPostData] = useState();
  const [showStatus, toggleStatus] = useState(false);
  const [level, setLevel] = useState(0);
  const [data, setData] = useState(props.data);
   
  const dcpy = o => {
    return (JSON.parse(JSON.stringify(o)))
  };
  
  const updateData = () => {  
    async function fetchData() {
      const result = await axios.post("http://localhost:4000/update", {
        data: JSON.stringify(data[props.match.params.id]),
        column: props.match.params.id
    });
      props.setUpdate(true);
      toggleStatus(true);
      setPostData(result.data);
    }
   fetchData(); 
  }

 
  const handleChange = e => {   
    let newData = dcpy( data)
    const fieldName = e.target.name;
    setValues({
      ...form,
      [fieldName]: e.target.value
    });
    if ( isObject(Object.values(props.data[props.match.params.id])[0])) {      
      newData[props.match.params.id][Object.keys(newData[props.match.params.id])[level]][fieldName] = e.target.value;    
    } else {
    newData[props.match.params.id][fieldName] = e.target.value;    
    }
    setData(newData);
  };

const addNewTopicItem = async (e) => {
  let newData = dcpy(props.data)
  let newObject = {}
  if ( isObject(Object.values(props.data[props.match.params.id])[0])) {      
    Object.keys(props.data[props.match.params.id][Object.keys(props.data[props.match.params.id])[0]]).map((item, i) => {
     newObject[item] = "-";
    console.log( newObject)}
    )
    newData[props.match.params.id][Object.keys(props.data[props.match.params.id]).length +1] = {}
    Object.assign (newData[props.match.params.id][Object.keys(props.data[props.match.params.id]).length +1] , newObject);
      
     console.log(newData[props.match.params.id], Object.keys(props.data[props.match.params.id]).length  );
    
  } 
   setData(newData);
   setLevel( Object.keys(props.data[props.match.params.id]).length +1 )
 
}


  const parseJSON = (jsonObject, test) => {
    const renderHTML = (type, label, content) => {
      switch (type) {
        case "area":
          return (
            <div>
              <textarea name={label} value={content} />
              <label htmlFor={test}> {label}</label>
            </div>
          );
        default:            
          return (
            <div className={label}>   
              <input
                onChange={handleChange}
                type="text"
                name={label}
                key={content}
                defaultValue={content}
                value={form[label]} />
              <label htmlFor={label}> {label}</label>
            </div>
          );
      }
    };
    
    if (isObject(props.data[props.match.params.id][Object.keys(props.data[props.match.params.id])[level]])) {
      return (
        <div className="field">
          {Object.keys(props.data[props.match.params.id][Object.keys(props.data[props.match.params.id])[level]]).map((item, i) => {
                return  (     
                  renderHTML("input", item, props.data[props.match.params.id][Object.keys(props.data[props.match.params.id])[level]][item])
                )})}
        </div>
      );   
    } else {
      return (
        <div className="field">
          {jsonObject && typeof jsonObject === "string"
            ? jsonObject.length >= 30
              ? renderHTML("area", test, jsonObject)
              : renderHTML("input", test, jsonObject)
            : Object.keys(jsonObject).map((item, i) => {
              return (
                <>
                  {renderHTML("input", item, jsonObject[item])}
                </>
              );
            })}
      </div>
    );
  }
  };

  const controlPages = (direction) => {
    const maxPage = Object.keys(data[props.match.params.id]).length-1
    console.log( maxPage ,level)
    if (direction === "up" && level < maxPage ) {
      setLevel(level+1) }
    else if (direction === "down" && level > 0 ) {
      setLevel(level-1) }
  }
 
  const renderTopicData = (data, test) => {
     return parseJSON(data, test);
  };
 
  if (props.data.length < 1) {
    return "loading";
  }
 
  return (
      <>  
          {showStatus &&  
      <div className="status" onClick={() => toggleStatus(!showStatus)}>
          <div> {serverPostData}</div>
          <div>X</div>
       </div>
    }
    <div className="topic">      
      {isObject(Object.values(props.data[props.match.params.id])[0]) && 
        <div className="field">
        <button onClick={() => controlPages("down")} className="btn notify">&lt;</button>      
        <button onClick={() => controlPages("up")} className="btn notify">&gt;</button>
        <button onClick={() => alert("not yet implemented")} className="btn notify">remove</button>
        <button onClick={() => addNewTopicItem()} className="btn notify">add</button>
        
      </div>
      }

      <h1>{props.match.params.id}</h1>
  
      {renderTopicData(data[props.match.params.id] , props.match.params.id)}
      <button onClick={ () => updateData(data)}>Save</button>
    </div>
    </>
  );
};
export default TopicEdit;