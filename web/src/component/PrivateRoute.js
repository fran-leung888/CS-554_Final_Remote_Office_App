import React, { useContext } from "react";
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';

const PrivateRoute = ({ component: RouteComponent, ...rest}) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <Route
        {...rest}
        render={(routeProps) => (!!currentUser ? <RouteComponent {...routeProps}/> : <Navigate to={ 'signin' }/> )} 
    />
    );
}

export default PrivateRoute