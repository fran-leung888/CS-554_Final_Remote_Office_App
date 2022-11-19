import { configureStore } from '@reduxjs/toolkit'
import {composeWithDevTools, devToolsEnhancer} from 'redux-devtools-extension';
import userSlice from './userSlice';
import errorSlice from './errorSlice';


export default configureStore({
    reducer: {
        user: userSlice,
        error: errorSlice
    },
  })