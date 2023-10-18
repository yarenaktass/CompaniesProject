import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { companiesSlice } from "../../slices/companiesSlice";
import { employeesSlice } from "../../slices/employeesSlice";
import { worksSlice } from "../../slices/worksSlices";
import { accountSlice } from "../../slices/accountSlice";

export const store = configureStore({
    reducer:{
       companies:companiesSlice.reducer,
       employees:employeesSlice.reducer,
       works:worksSlice.reducer,
       account:accountSlice.reducer
    }
})

export type RootState= ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
