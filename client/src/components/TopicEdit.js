import React, { useState } from "react";
import axios from "axios";
import { isObject } from "util";
import { Redirect } from "react-router-dom";
import NotFound from "./NotFound";
import SvgIcon from "./SvgIcon";

const TopicEdit = props => {
  const [form, setValues] = useState({});
  const [serverPostData, setPostData] = useState();
  const [showStatus, toggleStatus] = useState(false);
  const [level, setLevel] = useState(0);
  const [data, setData] = useState(props.data);

  const dcpy = o => {
    return JSON.parse(JSON.stringify(o));
  };

  const updateData = () => {
    async function fetchData() {
      const result = await axios.post("http://localhost:4000/api/update", {
        data: JSON.stringify(data[props.match.params.id]),
        column: props.match.params.id
      });
      props.setUpdate(!props.updateStatus);
      toggleStatus(true);
      setPostData(result.data);
    }
    fetchData();
  };

  const handleChange = e => {
    let newData = dcpy(data);
    const fieldName = e.target.name;
    setValues({
      ...form,
      [fieldName]: e.target.value
    });
    console.log("---------", fieldName, e.target.value);

    if (isObject(Object.values(props.data[props.match.params.id])[0])) {
      newData[props.match.params.id][
        Object.keys(newData[props.match.params.id])[level]
      ][fieldName] = e.target.value;
    } else if (props.match.params.id === fieldName) {
      newData[props.match.params.id] = e.target.value;
    } else {
      newData[props.match.params.id][fieldName] = e.target.value;
    }
    setData(newData);
  };

  const addNewTopicItem = async e => {
    let newData = dcpy(props.data);
    let newObject = {};
    if (isObject(Object.values(props.data[props.match.params.id])[0])) {
      Object.keys(
        props.data[props.match.params.id][
          Object.keys(props.data[props.match.params.id])[0]
        ]
      ).map((item, i) => {
        newObject[item] = "-";
        console.log(newObject);
      });
      newData[props.match.params.id][
        Object.keys(props.data[props.match.params.id]).length + 1
      ] = {};
      Object.assign(
        newData[props.match.params.id][
          Object.keys(props.data[props.match.params.id]).length + 1
        ],
        newObject
      );

      console.log(
        newData[props.match.params.id],
        Object.keys(props.data[props.match.params.id]).length
      );
    }
    setData(newData);
    setLevel(Object.keys(props.data[props.match.params.id]).length + 1);
  };

  const parseJSON = (jsonObject, paramsID) => {
    const renderHTML = (type, label, content) => {
      switch (type) {
        case "area":
          return (
            <div
              className={`${label}`}
              style={{ display: "flex", marginTop: "2em" }}  >
              <textarea
                name={label}
                defaultValue={content}
                value={form[label]}
                placeholder={label}
                onChange={handleChange}  />
              <label htmlFor={paramsID}> {label}</label>
            </div>
          );
        default:
          return (
            <div className={`${label} row`}>
              <input
                onChange={handleChange}
                type="text"
                name={label}
                placeholder={label}
                key={
                  isObject(Object.values(props.data[props.match.params.id])[0])
                    ? content
                    : ""
                }
                defaultValue={content}
                value={form[label]}  />
              <label htmlFor={label}> {label}</label>
              <SvgIcon name="edit" />
            </div>
          );
      }
    };

    if (
      isObject(
        props.data[props.match.params.id][
          Object.keys(props.data[props.match.params.id])[level]
        ]
      )
    ) {
      return (
        <div className="field">
          {Object.keys(
            props.data[props.match.params.id][
              Object.keys(props.data[props.match.params.id])[level]
            ]
          ).map((item, i) => {
            return renderHTML(
              "input",
              item,
              props.data[props.match.params.id][
                Object.keys(props.data[props.match.params.id])[level]
              ][item]
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="field">
          {jsonObject && typeof jsonObject === "string"
            ? jsonObject.length >= 30
              ? renderHTML("area", paramsID, jsonObject)
              : renderHTML("input", paramsID, jsonObject)
            : Object.keys(jsonObject).map((item, i) => {
                return (
                  <>
                    {isObject(jsonObject[item])
                      ? parseJSON(jsonObject[item])
                      : renderHTML("input", item, jsonObject[item])}
                  </>
                );
              })}
        </div>
      );
    }
  };

  const controlPages = direction => {
    const maxPage = Object.keys(data[props.match.params.id]).length - 1;
    console.log(maxPage, level);
    if (direction === "up" && level < maxPage) {
      setLevel(level + 1);
    } else if (direction === "down" && level > 0) {
      setLevel(level - 1);
    }
  };

  const renderTopicData = (data, paramsID) => {
    return parseJSON(data, paramsID);
  };

  if (props.data.length < 1) {
    return "loading";
  }
  console.log(data[props.match.params.id]);
  if (data[props.match.params.id] === undefined) {
    return <Redirect to="/notFound" component={NotFound} />;
  }

  return (
    <>
      {showStatus && (
        <div className="status" onClick={() => toggleStatus(!showStatus)}>
          <div> {serverPostData}</div>
          <div>X</div>
        </div>
      )}
      <div className="topic">
        {isObject(Object.values(props.data[props.match.params.id])[0]) && (
          <div className="field controlPages"  >
            <button onClick={() => controlPages("down")} className="btn notify">
              &lt;
            </button>
            <button onClick={() => controlPages("up")} className="btn notify">
              &gt;
            </button>
            <button
              onClick={() => alert("not yet implemented")}
              className="btn notify"
            >
              remove
            </button>
            <button
              onClick={
                () => alert("not yet implemented") /*'() => addNewTopicItem()*/
              }
              className="btn notify"
            >
              add
            </button>
          </div>
        )}

        <h1>{props.match.params.id}</h1>

        {props.match.params.id
          ? renderTopicData(data[props.match.params.id], props.match.params.id)
          : null}
        <button className="btn notify" onClick={() => updateData(data)}>
          Save
        </button>
      </div>
    </>
  );
};
export default TopicEdit;
