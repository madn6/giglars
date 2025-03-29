import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
   isLoggedIn: boolean;
   userId: string | null;
   token:string | null
}

const initialState: AuthState = {
   isLoggedIn: false,
   userId: null,
   token:null
}


const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      login: (state, action: PayloadAction<{ userid: string;  token:string}>) => {
         state.isLoggedIn = true;
         state.userId = action.payload.userid;
         state.token = action.payload.token;
      },
      logout: (state) => {
         state.isLoggedIn = false;
         state.userId = null;
         state.token = null;
      },

   }
})


export const { login, logout } = authSlice.actions;
export default authSlice.reducer;