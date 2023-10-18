import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../context/agent";
import { Router } from "react-router-dom";

interface AccountState{
    user:User | null;
}

const initialState:AccountState = {
    user:null
}
export const signInUser = createAsyncThunk<User,FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try{
            debugger;
            const user = await agent.Account.login(data);
            localStorage.setItem('user', JSON.stringify(user));
            debugger;
            return user;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)
debugger;
export const fetchCurrentUser = createAsyncThunk<User>(
    'account/signInUser',
    async (_, thunkAPI) => {
        try{
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)
export const accountSlice = createSlice({
    name:'account',
    initialState,
    reducers:{
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    },
    extraReducers:(builder => {
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),(state,action)=>{
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (state,action) => {
            console.log(action.payload);
        });
    })
})

export const {signOut} = accountSlice.actions;
