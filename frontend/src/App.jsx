import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
};

export default App;