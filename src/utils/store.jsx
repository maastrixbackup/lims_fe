import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../utils/userSlice'

const store = configureStore({
  reducer: {
    auth: authReducer
  }
})
export default store