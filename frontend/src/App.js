import React from 'react';
import LoginPage from './Login';

function App() {
  const handleLogin = creds => {
    // TODO: call your auth API
    console.log('Logging in:', creds);
  };

  return <LoginPage onLogin={handleLogin} />;
}

export default App;

