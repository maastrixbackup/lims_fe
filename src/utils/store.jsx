import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../utils/userSlice";
import listReducer from "../utils/listSlice";
import selectedProjectReducer from "../utils/selectedProjectSlice";
import khataReducer from "../utils/khataSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    list: listReducer,
    selectedProject: selectedProjectReducer,
    khata: khataReducer,
  },
});
export default store;
