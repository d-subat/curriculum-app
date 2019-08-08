import React , {useState} from 'react';
import Auth  from './auth/auth';
import { withRouter,Redirect } from "react-router-dom";


const Login = (props) =>  {

 

      return (
        <div>
          <p>You must log in to view the page </p>
          <button >Log in</button>
        </div>
      );
    
  }

  export default withRouter(Login);