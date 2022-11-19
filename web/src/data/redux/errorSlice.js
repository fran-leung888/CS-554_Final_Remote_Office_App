import { createSlice } from '@reduxjs/toolkit'

export const errorSlice = createSlice({
    name: 'error',
    initialState: {
        status: false,
        description: '',
    },
    reducers: {
        setError: (state, action) => {
            state.status = action.payload.status
            state.description = action.payload.description
            
        },
        resetError: (state) => {
            // state.status = false
            // state.description = ''
            return {
                status: false,
                description: '',
            }
        }
    },
})

// Action creators are generated for each case reducer function

export const { setError, resetError } = errorSlice.actions
export default errorSlice.reducer