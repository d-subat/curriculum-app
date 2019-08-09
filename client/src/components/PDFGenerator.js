import React from 'react';
import jsPDF from 'jspdf';

 

const PDFGenerator = (props) => {
  const renderData = props => {
      return `
      <h1 style="color:white;">${ props["Persönliche Daten"].name}</h1> 
      <h2 style="color:white;">${ props["Persönliche Daten"].profession}</h2> 
      <h4 style="color:red;text-align:center;"> sdfsdfsdf</h4>`
  };
  const doc = new jsPDF()
  
  doc.setFillColor(185,185,185);
  doc.rect(165, 0, 50, 1024, 'F'); 

  doc.setFillColor(30,144,255);
  doc.rect(0, 0, 1024, 50, 'F'); 

  var img = new Image();
  img.src = props.profileImg;  
  doc.addImage(img, 'PNG', 100, 100, 50,50);
  img.src = props.signature;
  doc.addImage(img, 'PNG', 0, 100, 50,50);
  doc.fromHTML(`${ renderData(props.data)}`)
  
  return (
    <div style={{flex:1,display:"flex"}} >
      <iframe title="PDF Output" src={doc.output('bloburl')} width="100%" height="100%"/>
    </div>
  ) 
};

export default PDFGenerator;