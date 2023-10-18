import { EntityState, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Work } from "../app/models/Work";
import agent from "../context/agent";
import { RootState } from "../app/store/ConfigureStore";

const worksAdapter = createEntityAdapter<Work>();


interface WorksState extends EntityState<Work>{
    worksLoaded: boolean;
    status: string;
}

const initialState:WorksState = worksAdapter.getInitialState({
    worksLoaded:false,
    status: 'idle',
});

export const fetchWorksAsync =  createAsyncThunk<Work[]>(
    'works/fetchWorksAsync',
    async() => {
        try{
            return await agent.Works.list();
        }catch(error:any){
            console.log(error);
        }
    } 
)

export const addWorksAsync = createAsyncThunk<Work, Work>(
    'companies/addWorksAsync',
    async(newWork) => {
       try {
         const response = await agent.Works.addItem(newWork);
         return response;
       } catch (error:any) {
        console.log(error)
       }
    }
)


export const updateWorkAsync = createAsyncThunk<Work, {id: number, updatedWork: Work}>(
    'companies/updateWorkAsync',
    async({id, updatedWork}) =>{
        try {
           const response = await agent.Works.updateItem(id, updatedWork);
           return response;
        } catch (error:any) {
            console.log(error);
        }
    }
)

export const removeWorkAsync = createAsyncThunk<void, {workId:number}>(
    'companies/removeWorkAsync',
     async({workId},thunkAPI) => {
        try {
            await agent.Works.removeItem(workId);
            debugger;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
     }

)

export const worksSlice = createSlice({
    name:"works",
    initialState,
    reducers:{},

    extraReducers:(builder => {
        builder.addCase(fetchWorksAsync.pending, (state)=> {
            state.status = 'pendingFetchWorks';
        });

        builder.addCase(fetchWorksAsync.fulfilled, (state,action)=>{
            worksAdapter.setAll(state, action.payload);
            state.status= 'idle';
            state.worksLoaded = true;
        });
        builder.addCase(fetchWorksAsync.rejected, (state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(addWorksAsync.pending, (state)=>{
            state.status='pendingAddWork';
        });
        builder.addCase(addWorksAsync.fulfilled, (state,action)=>{
            worksAdapter.addOne(state, action.payload);
            state.status='idle';
        });
        builder.addCase(addWorksAsync.rejected,(state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(updateWorkAsync.pending, (state)=>{
            state.status='pendingUpdateWork';
        });
        builder.addCase(updateWorkAsync.fulfilled, (state,action)=>{
            if(action.payload.id !== undefined){
            worksAdapter.updateOne(state,{
                id:action.payload.id,
                changes:action.payload,
            });
            }
            state.status='idle';
        });
        builder.addCase(updateWorkAsync.rejected,(state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(removeWorkAsync.pending, (state,action) => {
            state.status = 'pendingRemoveWork' 
        });
        builder.addCase(removeWorkAsync.fulfilled, (state, action) => {
            worksAdapter.removeOne(state, action.meta.arg.workId);
            state.status = 'idle';
        });
        builder.addCase(removeWorkAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log('Error:', action.error.message);
        });
    })
})

export const workSelectors = worksAdapter.getSelectors((state: RootState) => state.works)