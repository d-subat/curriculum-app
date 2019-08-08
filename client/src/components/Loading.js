import React from "react";
import "./Loading.css";

const Loading = () => (
  <>
    <div className="loader">
      <span />      
    </div>
    
    
    <svg className="svg-hidden">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
        </filter>
      </defs>
    </svg>
  </>
);
export default Loading;
