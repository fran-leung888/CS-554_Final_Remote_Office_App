import React, { useContext } from "react";
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';

const PrivateRoute = ({ element, loggedIn, ...rest}) => {
    return (
        <Route
            {...rest}
            element={loggedIn ? element :  <Navigate to={ '/login' }/>}
        />
    );
}

export default PrivateRoute