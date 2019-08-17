import React, {Component} from 'react';
class auth {
    authenticated = false;
    login = () => {
        this.authenticated = true;
        return this.authenticated;
    }
    logout = () => {
      this.authenticated = false;
      return this.authenticated;
  }
}

const Auth = new auth();

const withAuth = (BaseComponent) =>  {





    

    class HOC extends Component {
        /*
        constructor(props) {
            super(props);
            this.state = {authenticated:false};
        }
        */
       state = {authenticated:false};
        componentDidMount = async () => {
            console.log("trying")
            await fetch("http://localhost:4000/auth/loginSuccess", {
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
                  //throw new Error("failed to authenticate user");
                })
                .then(data => {
                    
                    
                    Auth.login()
                  this.setState({
                    authenticated: true,
                    user: data.user
                  });
                  
                })
                .catch(error => {
                  this.setState({
                    authenticated: false,
                    error: "Failed to authenticate user"
                  });
                });
                console.log("auth from react:"+  this.state.authenticated)
        }


        render() 
        
        
        {
            console.log("auth from react2:"+   this.state.authenticated)
        return <BaseComponent {...this.props } {...this.state} isAuth={Auth.authenticated} />;
      }
    }
      
    return HOC;
 
};

 

export {withAuth};
export default Auth;
 