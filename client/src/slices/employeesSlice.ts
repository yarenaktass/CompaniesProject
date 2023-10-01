import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, createStore } from "@reduxjs/toolkit";
import { Employee } from "../app/models/employee";
import agent from "../context/agent";
import { RootState } from "../app/store/ConfigureStore";


const employeesAdapter = createEntityAdapter<Employee>();


interface EmployeesState extends EntityState<Employee>{
    employeesLoaded: boolean;
    status: string;
}


const initialState:EmployeesState = employeesAdapter.getInitialState({
    employeesLoaded:false,
    status:'idle',
});



export const fetchEmployeesAsync =  createAsyncThunk<Employee[]>(
    'employees/fetchEmployeesAsync',
    async() => {
        try{
            return await agent.Employees.list();
        }catch(error:any){
            console.log(error);
        }
    } 
)

export const addEmployeesAsync = createAsyncThunk<Employee, Employee>(
    'employees/addEmployeesAsync',
    async(newEmployee) => {
       try {
         const response = await agent.Employees.addItem(newEmployee);
         return response;
       } catch (error:any) {
        console.log(error)
       }
    }
)

export const updateEmployeeAsync = createAsyncThunk<Employee, {id:number, updatedEmployee: Employee}>(
    'employees/updateEmployeesAsync',
    async ({id, updatedEmployee}) => {
        try {
            const response = await agent.Employees.updateItem(id, updatedEmployee);
            return response;
         } catch (error:any) {
             console.log(error);
         }
    }
)

export const removeEmployeeAsync = createAsyncThunk<void, {employeeId:number}>(
    'employees/removeEmployeesAsync',
    async({employeeId},thunkAPI) => {
        try {
            await agent.Employees.removeItem(employeeId);
            debugger;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const employeesSlice = createSlice({
    name:'employees',
    initialState,
    reducers:{},

    extraReducers:(builder => {
        builder.addCase(fetchEmployeesAsync.pending, (state)=>{
            state.status = 'pendingFetchEmployees';   
        });

        builder.addCase(fetchEmployeesAsync.fulfilled, (state,action)=>{
            employeesAdapter.setAll(state, action.payload);
            state.status= 'idle';
            state.employeesLoaded = true;
        });
        builder.addCase(fetchEmployeesAsync.rejected, (state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(addEmployeesAsync.pending, (state)=>{
            state.status='pendingAddEmployee';
        });
        builder.addCase(addEmployeesAsync.fulfilled, (state,action)=>{
            employeesAdapter.addOne(state, action.payload);
            state.status='idle';
        });
        builder.addCase(addEmployeesAsync.rejected,(state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(updateEmployeeAsync.pending, (state)=>{
            state.status='pendingUpdateEmployee';
        });
        builder.addCase(updateEmployeeAsync.fulfilled, (state,action)=>{
            if(action.payload.id !== undefined){
            employeesAdapter.updateOne(state,{
                id:action.payload.id,
                changes:action.payload,
            });
            }
            state.status='idle';
        });
        builder.addCase(updateEmployeeAsync.rejected,(state,action)=>{
            state.status='idle';
            console.log('Error:', action.error.message);
        });
        builder.addCase(removeEmployeeAsync.pending, (state,action) => {
            state.status = 'pendingRemoveEmployee' 
        });
        builder.addCase(removeEmployeeAsync.fulfilled, (state, action) => {
            employeesAdapter.removeOne(state, action.meta.arg.employeeId);
            state.status = 'idle';
        });
        builder.addCase(removeEmployeeAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log('Error:', action.error.message);
        });

        
    })
})

export const employeeSelectors = employeesAdapter.getSelectors((state: RootState) => state.employees)