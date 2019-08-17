import React from 'react';


 

const WEBGenerator = (props) => {
 
  
  return (
    <div style={{flex:1,display:"flex"}} >
      WEB
      {`
      <h1 style="color:white;">${ props["Persönliche Daten"].name}</h1> 
      <h2 style="color:white;">${ props["Persönliche Daten"].profession}</h2> 
      <h4 style="color:red;text-align:center;"> sdfsdfsdf</h4>`}
    </div>
  ) 
};

export default WEBGenerator;