import React, {useState,useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Auth,{withAuth} from "./components/auth/auth"
import Login from "./components/Login";
import Loading from "./components/Loading";

import Header from "./components/Header";
import Home from ".//components/Home";
import Profile from ".//components/Profile";

import TopicEdit from ".//components/TopicEdit";
import Signature from "./components/Signature";
import NotFound from "./components/NotFound";

import PDFGenerator from "./components/PDFGenerator";
import WEBGenerator from "./components/WEBGenerator";
import axios from "axios";

import "./App.scss";



function App(props) {

  const [serverData, setData] = useState([]);
  const [signatureImage, setSignatureImage] = useState([]);
  const [profileImage, setProfileImage] = useState([]);
  const [updateStatus, setUpdate] = useState(false);
  const [isAuth,setAuth]  = useState(props.isAuth);
  


  useEffect(() => {
    console.log(updateStatus);
    async function fetchData() {
      const result = await axios.get("/api/curriculum");
      console.log(result.data)
      if (result.data) {
      setData(result.data.data);
      setSignatureImage(result.data.signature);
      setProfileImage(result.data.profileImage);
      }
    }
    fetchData();
  }, [updateStatus]);
    
   
  const saveProfileImage = (e) => {
    const saveCanvas = document.createElement("canvas");    
    const context = saveCanvas.getContext('2d');
    saveCanvas.width=300
    saveCanvas.height=240
    let data = [];
    const imgObj = new Image();
    imgObj.src = URL.createObjectURL(e.target.files[0]);
    imgObj.onload = function(){
        context.drawImage(imgObj, 0, 0,saveCanvas.width,saveCanvas.height);
        data = saveCanvas.toDataURL("image/png")
        fetchData();
      }
    

    const fetchData = async () => {
      const result = await axios.post("/api/update", {
        data: '"' + data + '"',
        column: "profileImage"
        });
        setProfileImage(  data) ;     
    }
    
  }


  return (
    
    <Router>
      {console.log( "within app:" + props.isAuth + "//" +props.authenticated)}
    {!!props.isAuth  ?    
    
    <>
      <Header  profileName={Object.keys(serverData).length > 0 ? `${serverData["Persönliche Daten"].name}` : ""} />
      <main>
        <Switch>
        <Route  path="/" exact={true} render={() => <Home  data={serverData} signature={signatureImage}  saveProfileImage={saveProfileImage}   profileImg={profileImage} /> } />  
          <Route  path="/profil" exact={true} render={() => <Profile data={serverData} signature={signatureImage}  saveProfileImage={saveProfileImage}   profileImg={profileImage} /> } />  
          <Route  path="/profil/unterschrift" render={() => <Signature updateStatus={updateStatus} setUpdate={setUpdate} signature={signatureImage} /> } />  
          <Route  path="/pdfview" render={() => <PDFGenerator signature={signatureImage}  profileImg={profileImage} data={serverData} /> } />            
          <Route  path="/webview" render={() => <WEBGenerator signature={signatureImage}  profileImg={profileImage} data={serverData} /> } />            
          <Route  path="/profil/:id"   render={({match}) => <TopicEdit  updateStatus={updateStatus} setUpdate={setUpdate} match={match} data={serverData} /> } />            
          
          <Route  component={NotFound}/>
        </Switch>
        
      </main>
     </> 
     :  <Route path="/"  render={({history}) =>   <Login history={history} />} />      
    }
    </Router>
  );
}

export default withAuth(App);
