import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, createStore } from "@reduxjs/toolkit";
import { Company } from "../app/models/company";
import agent from "../context/agent";
import { RootState } from "../app/store/ConfigureStore";
import { DELETE_COMPANY } from "../constants/companyConstant";

const companiesAdapter = createEntityAdapter<Company>();

interface CompaniesState extends EntityState<Company>{
    companiesLoaded: boolean;
    status: string;
}

const initialState:CompaniesState = companiesAdapter.getInitialState({
    companiesLoaded:false,
    status: 'idle',
});


export const fetchCompaniesAsync =  createAsyncThunk<Company[]>(
    'companies/fetchCompaniesAsync',
    async() => {
        try{
            return await agent.Companies.list();
        }catch(error:any){
            console.log(error);
        }
    } 
)

export const addCompaniesAsync = createAsyncThunk<Company, Company>(
    'companies/addCompaniesAsync',
    async(newCompany) => {
       try {
         const response = await agent.Companies.addItem(newCompany);
         return response;
       } catch (error:any) {
        console.log(error)
       }
    }
)

export const updateCompanyAsync = createAsyncThunk<Company, {id: number, updatedCompany: Company}>(
    'companies/updateCompanyAsync',
    async({id, updatedCompany}) =>{
        try {
           const response = await agent.Companies.updateItem(id, updatedCompany);
           return response;
        } catch (error:any) {
            console.log(error);
        }
    }
)

export const removeCompanyAsync = createAsyncThunk<void, {companyId:number}>(
    'companies/removeCompanyAsync',
     async({companyId},thunkAPI) => {
        try {
            await agent.Companies.removeItem(companyId);
            debugger;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
     }

)

export const deleteCompany = (companyId:number)=> ({
    type: DELETE_COMPANY,
    paload:companyId,
});


export const companiesSlice = createSlice({
    name:'companies',
    initialState,
    reducers:{},
    // reducers= (state= initialState, action) => {
    //     switch (action.type) {
    //         case 'DELETE_COMPANY':
    //             const companyIdToDelete = action.payload;
    //             const updatedCompaniees = state.companies.filter((company) => company.id !== companyIdToDelete)
    //             return {
    //                 ...state,
    //                 companies : updatedCompaniees,
    //             }
    //         default:
    //             return state;         
    //     }
    // },
    extraReducers:(builder => {
        builder.addCase(fetchCompaniesAsync.pending, (state)=>{
            state.status = 'pendingFetchCompanies';   
        });

        builder.addCase(fetchCompaniesAsync.fulfilled, (state,action)=>{
            companiesAdapter.setAll(state, action.payload);
            state.status= 'idle';
            state.companiesLoaded = true;
        });
        builder.addCase(fetchCompaniesAsync.rejected, (state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(addCompaniesAsync.pending, (state)=>{
            state.status='pendingAddCompany';
        });
        builder.addCase(addCompaniesAsync.fulfilled, (state,action)=>{
            companiesAdapter.addOne(state, action.payload);
            state.status='idle';
        });
        builder.addCase(addCompaniesAsync.rejected,(state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(updateCompanyAsync.pending, (state)=>{
            state.status='pendingUpdateCompany';
        });
        builder.addCase(updateCompanyAsync.fulfilled, (state,action)=>{
            if(action.payload.id !== undefined){
            companiesAdapter.updateOne(state,{
                id:action.payload.id,
                changes:action.payload,
            });
            }
            state.status='idle';
        });
        builder.addCase(updateCompanyAsync.rejected,(state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(removeCompanyAsync.pending, (state,action) => {
            state.status = 'pendingRemoveWork' 
        });
        builder.addCase(removeCompanyAsync.fulfilled, (state, action) => {
            companiesAdapter.removeOne(state, action.meta.arg.companyId);
            state.status = 'idle';
        });
        builder.addCase(removeCompanyAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log('Error:', action.error.message);
        });

        
    })

})

export const companySelectors = companiesAdapter.getSelectors((state: RootState) => state.companies)