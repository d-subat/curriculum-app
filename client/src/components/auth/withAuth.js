import React from 'react';

import AuthUserContext from './context';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const withAuth = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        userobj:   "ettset"
      };
    }

     componentDidMount() {
 
          this.setState({ authUser: false});
          if (!this.state.authUser) {
            this.props.history.push("/login");
          }
    }

    componentWillUnmount() {
    
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>          
          <Component {...this.props} />
          </AuthUserContext.Provider>
        
      );
    }
  }
  return compose(
    withRouter,    
  )(WithAuthentication);

  
};

export default withAuth;
