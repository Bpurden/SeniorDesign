import React from 'react';
import { Button } from 'react-bootstrap';
// import AuthService from '../../services/auth.service';

const RunPageNavbar = () => {
  // on logout delete JWT and redirect to the login page
  const doLogout = event => 
  {
    event.preventDefault();
    logout();
    window.location.href = '/';
  };

  function logout() { localStorage.removeItem("auth-token"); }

  return (
    <nav className="navbar">
      <h1 className="navbar-title-link" style={{marginBottom: "0px"}}><a href="/homepage">PEO STRI</a></h1>
      <div>
        <a className="navbar-links" href="/benchmark">Benchmark</a>
        <a className="navbar-links" href="/upload">Upload</a>
        
        <Button className="logout-login-register-button btn-dark" onClick={doLogout}>
          Log out
        </Button>

      </div>
    </nav>
  );
}

export default RunPageNavbar;