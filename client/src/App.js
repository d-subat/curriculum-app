import React, {useState,useEffect} from "react";
import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom";

import Auth from "./components/auth/auth";
import Login from "./components/Login";

import PrivateRoute from './components/PrivateRoute'
import Header from "./components/Header";
import Home from ".//components/Home";
import TopicEdit from ".//components/TopicEdit";
import Signature from "./components/Signature";
import NotFound from "./components/NotFound";

import PDFGenerator from "./components/PDFGenerator";
import axios from "axios";

import "./App.css";

export const UserContext = React.createContext();

function App() {

  const [serverData, setData] = useState([]);
  const [signatureImage, setSignatureImage] = useState([]);
  const [profileImage, setProfileImage] = useState([]);
  const [updateStatus, setUpdate] = useState(false);
  const [AuthUser, setAuthUser] = useState(false);
  

  useEffect(() => {
    console.log(updateStatus);
    async function fetchData() {
      const result = await axios.get("/curriculum");
      
      setData(result.data.data);
      setSignatureImage(result.data.signature);
      setProfileImage(result.data.profileImage);
      
    }
    fetchData();
  }, [updateStatus]);
  
  
  const saveProfileImage = (e) => {
    const saveCanvas = document.createElement("canvas");    
    const context = saveCanvas.getContext('2d');
    let data = [];
    const imgObj = new Image();
    imgObj.src = URL.createObjectURL(e.target.files[0]);
    imgObj.onload = function(){
        context.drawImage(imgObj, 0, 0);
        data = saveCanvas.toDataURL("image/png")
        fetchData();
      }
    

    const fetchData = async () => {
      const result = await axios.post("http://localhost:4000/update", {
        data: '"' + data + '"',
        column: "profileImage"
        });
        setProfileImage(  data) ;     
    }
    
  }


  return (
    <Router>
      <Header  profileName={Object.keys(serverData).length > 0 ? `${serverData["Persönliche Daten"].name}` : ""} />
      <main>
      <UserContext.Provider value={AuthUser}>
        <Switch>
        <PrivateRoute  path="/" exact={true} render={() => <Home  data={serverData} signature={signatureImage}  saveProfileImage={saveProfileImage}   profileImg={profileImage} /> } />  
        <PrivateRoute  path="/signature" render={() => <Signature updateStatus={updateStatus} setUpdate={setUpdate} signature={signatureImage} /> } />  
        <PrivateRoute  path="/pdfgenerator" render={() => <PDFGenerator signature={signatureImage}  profileImg={profileImage} data={serverData} /> } />  
        <PrivateRoute  path={Object.keys(serverData).length > 0 ? `/${serverData["Persönliche Daten"].name}/:id` : ""} render={({match}) => <TopicEdit  updateStatus={updateStatus} setUpdate={setUpdate} match={match} data={serverData} /> } />  
          <Route path="/login"  render={() => <Login  user={this.props.user} />}/>
          <Route component={NotFound} />
        </Switch>
        </UserContext.Provider>
      </main>
    </Router>
  );
}

export default App;
