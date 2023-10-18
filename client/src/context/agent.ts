import axios, { AxiosError, AxiosResponse } from "axios";
import { Company } from "../app/models/company";
import { Employee } from "../app/models/employee";
import { Work } from "../app/models/Work";
import { store } from "../app/store/ConfigureStore";

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials=true;
const responseBody = (response:AxiosResponse) =>response.data;


axios.interceptors.request.use(config => {
   const token = store.getState().account.user?.token;
   if(token) config.headers.Authorization = `Bearer ${token}`;
   return config;
}) 
axios.interceptors.response.use(async response => {
    return response;
  },(error: AxiosError) => {
     const {data,status}= error.response! as AxiosResponse ;
     switch(status){
       case 400:
          if(data.errors){
             const modelStateErrors: string[] =[];
             for(const key in data.errors){
                if(data.errors[key]){
                   modelStateErrors.push(data.errors[key])
                }
             }
             throw modelStateErrors.flat();
          }

     }
    return Promise.reject(error.response);
  })
 
const requests = {
    get: (url:string) => axios.get(url).then(responseBody),
    post: ( url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: ( url: string, body: {}) => axios.put(url,body).then(responseBody),
    delete: ( url: string) => axios.delete(url).then(responseBody),
}


const Companies={
    list:() => requests.get('companies'),
    itemById:(id:number) => requests.get(`companies/${id}`),
    addItem: (company:Company) => requests.post('companies',company),
    removeItem:(id:number) => requests.delete(`companies/${id}`),
    updateItem:(id:number, company:Company) => requests.put(`companies/${id}`,company),
   
};
const Employees={
    list:() => requests.get('employees'),
    itemById:(id:number) => requests.get(`employees/${id}`),
    addItem: (employee:Employee) => requests.post('employees',employee),
    removeItem:(id:number) => requests.delete(`employees/${id}`),
    updateItem:(id:number, employee:Employee) => requests.put(`employees/${id}`,employee),
   
};
const Works={
    list:() => requests.get('works'),
    itemById:(id:number) => requests.get(`works/${id}`),
    addItem: (work:Work) => requests.post('works',work),
    removeItem:(id:number) => requests.delete(`works/${id}`),
    updateItem:(id:number, work:Work) => requests.put(`works/${id}`,work),
   
};


const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser')
 }
 
debugger;


const agent = {
    Companies,
    Employees,
    Works,
    Account
};
debugger;

export default agent;