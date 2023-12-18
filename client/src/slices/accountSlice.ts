import { createAsyncThunk, createSlice, isAnyOf ,createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import { User } from "../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../context/agent";
import { toast } from "react-toastify";
import { UserRole } from "../app/models/userRole";
import { RootState } from "../app/store/ConfigureStore";

const UserRoleAdapter = createEntityAdapter<UserRole>({
    selectId: (userRole) => userRole.userId,
 }); 

interface AccountState extends EntityState<UserRole>{
    user:User | null;
    status:string;
    userRoleLoaded:boolean;

}

const initialState:AccountState = UserRoleAdapter.getInitialState({
    user:null,
    status:'idle',
    userRoleLoaded:false,
});


export const fetchUserRoleAsync = createAsyncThunk<UserRole[]>(
    'account/fetchUserRoleAsync',
    async () => {
      try {
        debugger;
        return await agent.Account.list();
      } catch (error: any) {
        console.log(error)
      }
      debugger;
    }
  );
  
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
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const {...user} =userDto;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {
        condition: () => {
            if(!localStorage.getItem('user')) return false;
        }
    }
);


export const accountSlice = createSlice({
    name:'account',
    initialState,
    reducers:{
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        setUser: (state,action) => {
            const claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles}
        }
    },
    extraReducers:(builder => {
        builder.addCase(fetchUserRoleAsync.pending, (state) => {
            state.status = 'pendingFetchUserRole';
            debugger;
          });
          
          builder.addCase(fetchUserRoleAsync.fulfilled, (state, action) => {
            UserRoleAdapter.setAll(state, action.payload);
            console.log('Fulfilled Action Payload:', action.payload);
            state.status = 'idle';
            state.userRoleLoaded = true;
            debugger;
          });
          
          builder.addCase(fetchUserRoleAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log('Error:', action.error.message);
            debugger;
          });
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),(state,action)=>{
            const claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles}
            console.log(claims,"claims");
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (state,action) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
        });
        builder.addMatcher(isAnyOf(signInUser.pending, fetchCurrentUser.pending), (state) => {
        });
    })
})

export const {signOut, setUser} = accountSlice.actions;
export const UserRolesSelectors = UserRoleAdapter.getSelectors((state: RootState) => state.account)
