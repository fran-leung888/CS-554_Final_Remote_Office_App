import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './component/Home'
import Login from './component/Login';
import { Link, Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { setError, resetError } from './data/redux/errorSlice'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Account from './component/Account';
import { AuthProvider } from './component/Auth';
import PrivateRoute from './component/PrivateRoute';
import React, {Fragment} from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function App() {

  // const status = useSelector((state) => state.error.status)
  // const description = useSelector((state) => state.error.description)
  const error = useSelector((state) => state.error)
  const dispatch = useDispatch()

  return (
    <AuthProvider>
    <div>
      <Modal
        open={error.status}
        onClose={() => {dispatch(resetError())}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {error.description}
          </Typography>
        </Box>
      </Modal>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          {/* <PrivateRoute path='/home' element={<Home />} />
          <PrivateRoute path='/account' element={<Account />} /> */}
        </Routes>
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
