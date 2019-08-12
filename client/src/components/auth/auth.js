import React, {Component} from 'react';
class auth {
    authenticated = true;
    login = () => {
        this.authenticated = true;
        return this.authenticated;
    }
}

const Auth = new auth();

const withAuth = (BaseComponent) =>  {
    class HOC extends Component {
      render() {
        return <BaseComponent 
  
        isAuth={Auth.authenticated}
        />;
      }
    }
      
    return HOC;
  };

const test = () => {
   // Fetch does not send cookies. So you should add credentials: 'include'
   fetch("http://localhost:4000/auth/login/success", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true
    }
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error("failed to authenticate user");
    })
    .then(responseJson => {
      this.setState({
        authenticated: true,
        user: responseJson.user
      });
    })
    .catch(error => {
      this.setState({
        authenticated: false,
        error: "Failed to authenticate user"
      });
    });
}

export {withAuth};
export default Auth;
 