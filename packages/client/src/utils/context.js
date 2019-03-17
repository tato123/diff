import Auth from './auth';
import React from 'react';


export const auth = new Auth();

const AuthContext = React.createContext();

export default AuthContext;