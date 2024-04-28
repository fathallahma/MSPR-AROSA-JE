import { configureStore, createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {token:"", lastName: "", firstName: "" },
  reducers: {
    connectUser: (state, action) => {
      state.token = action.payload.token;
      state.lastName = action.payload.lastName;
      state.firstName = action.payload.firstName;
    },
  },
});

const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState: { emailUser: "" },
  reducers: {
    forgetPasswordUserEmail: (state, action) => {
      state.emailUser = action.payload.emailUser;
    },
  },
});

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    forgetPassword: forgetPasswordSlice.reducer,
  },
});

export const connectUser = (payload) => {
  return {
    type: "user/connectUser",
    payload,
  };
};

export const forgetPasswordUserEmail = (payload) => {
  return {
    type: "forgetPassword/forgetPasswordUserEmail",
    payload,
  };
};
