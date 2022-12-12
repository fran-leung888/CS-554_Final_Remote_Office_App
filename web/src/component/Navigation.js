import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthConext  } from "./Auth";
import SignOutButton from "./SignOut";
import '../App.css';

const Navigation = () => {
    const { currentUser } = useContext(AuthConext)
return <div>{ currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
}

const NavigationAuth = () => {
    return (
        <nav className="navigation">
            <ul>
                <li>
                    <NavLink exact to='/' activeClassName='active'>
                        Landing
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to='/home' activeClassName='active'>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to='/account' activeClassName='active'>
                        Account
                    </NavLink>
                </li>
                <li>
                    <SignOutButton />
                </li>
            </ul>
        </nav>
    );
}

const NavigationNonAuth = () => {
    return (
        <nav className="navigation">
            <ul>
                <li>
                    <NavLink exact to='/' activeClassName='active'>
                        Landing
                    </NavLink>
                </li>
                <NavLink exact to='/signup' activeClassName='active'>
                        SignUp
                    </NavLink>               
                <li>
                    <NavLink exact to='/login' activeClassName='active'>
                        Login
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}


export default Navigation;