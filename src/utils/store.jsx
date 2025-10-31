import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../utils/userSlice'
// import listReducer from '../utils/listSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    // list: listReducer
  }
})
export default store