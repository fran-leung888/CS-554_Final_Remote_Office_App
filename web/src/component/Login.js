import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { redirect, Link } from "react-router-dom";

import users from '../data/users'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../data/redux/userSlice'
import { setError } from '../data/redux/errorSlice'
import { checkResult, verifyString, verifyObj, checkRes } from '../utils/verificationUtils'

import Box from '@mui/material/Box';
import { TextField, Button, Stack } from '@mui/material';

export default () => {


    const [isSignUp, setIsSignUp] = useState(false)
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [passwd, setPasswd] = useState('')

    const dispatch = useDispatch()


    const handleChange = (set) => {
        return (e) => set(e.target.value)
    }
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            checkResult(verifyString(username, 'username'))
            checkResult(verifyString(passwd, 'password'))
            let res = await users.login(username, passwd)
            console.log(res)
            checkRes(res)
            checkResult(verifyObj(res.data, 'user'))
            dispatch(setUser(res.data))
            navigate('/home')
        } catch (e) {
            dispatch(setError({
                status: true,
                description: e
            }))
        }

    }
    const handleSignUp = async () => {
        try {
            checkResult(verifyString(name, 'name'))
            checkResult(verifyString(username, 'username'))
            checkResult(verifyString(passwd, 'password'))
            let res = await users.addUser(name, username, passwd)
            checkRes(res)
            checkResult(verifyObj(res.data, 'user'))
            setIsSignUp(false)
        } catch (e) {
            dispatch(setError({ status: true, description: e }))
        }
    }

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <Stack
                component="form"
                sx={{
                    width: '25ch',
                }}
                spacing={2}
                noValidate
                autoComplete="off"
            >
                {isSignUp && <TextField required label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />}
                <TextField required label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField required label="password" variant="outlined" type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)} />

                {!isSignUp ?
                    (<Stack sx={{ textAlign: 'center' }}>
                        <Button variant="contained" onClick={handleLogin}>Login</Button>

                        <div style={{ fontSize: '0.8em' }} onClick={(e) => setIsSignUp(true)}>Do not have an account? Sign up</div>
                    </Stack>)
                    :
                    (
                        <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>
                    )
                }

            </Stack>
        </Box>
    )
}