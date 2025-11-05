import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../utils/userSlice'
import listReducer from '../utils/listSlice'
import selectedProjectReducer from "../utils/selectedProjectSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    list: listReducer,
    selectedProject: selectedProjectReducer,
  }
})
export default store