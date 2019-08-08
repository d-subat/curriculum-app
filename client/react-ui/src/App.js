import React, {useState,useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import Home from ".//components/Home";
import TopicEdit from ".//components/TopicEdit";
import Signature from "./components/Signature";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import PDFGenerator from "./components/PDFGenerator";
import axios from "axios";

import "./App.css";

/*
const routes = [
  { path: "/signature", name: "Signature", component: Signature },
  { path: "/pdfgenerator", name: "PDFGenerator", component: PDFGenerator },
  { path: "/Daniel Subat/:id", exact:true , name: "Edit Details", component: TopicEdit }

];
*/
function App() {

  const [serverData, setData] = useState([]);
  const [serverImageData, setImageData] = useState([]);
  const [updateStatus, setUpdate] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get("http://localhost:4000/curriculum");
      
      setData(result.data.data);
      setImageData(result.data.signature);
    }
    fetchData();
  }, [updateStatus]);
  
  const [profileImg, setProfileImg] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Maxbruecke_Nuernberg_110605_blue_hour.jpg/320px-Maxbruecke_Nuernberg_110605_blue_hour.jpg");
  const getProfileImage = (e) => {
    setProfileImg( URL.createObjectURL(e.target.files[0]) ); 
}
 
  return (
    <Router>
 
      
 


      <Header />
      <main>
        <Switch>
 
       
  <Route path="/" exact={true} render={() => <Home  data={serverData} signature={serverImageData}  getProfileImage={getProfileImage}   profileImg={profileImg} /> } />  
  <Route path="/signature" render={() => <Signature setUpdate={setUpdate} signature={serverImageData} /> } />  
  <Route path="/pdfgenerator" render={() => <PDFGenerator signature={serverImageData}  profileImg={profileImg} data={serverData} /> } />  
  <Route path="/Daniel Subat/:id" render={({match}) => <TopicEdit  setUpdate={setUpdate} match={match} data={serverData} /> } />  
          <Route path="/login"  render={() => <Login  />}/>
          <Route component={NotFound} />
          
        
 
        
          
        </Switch>
      </main>
    </Router>
  );
}

export default App;
