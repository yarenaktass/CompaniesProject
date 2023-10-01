import axios, { AxiosResponse } from "axios";
import { Company } from "../app/models/company";
import { Employee } from "../app/models/employee";

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials=true;
const responseBody = (response:AxiosResponse) =>response.data;

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
debugger;
const Employees={
    list:() => requests.get('employees'),
    itemById:(id:number) => requests.get(`employees/${id}`),
    addItem: (employee:Employee) => requests.post('employees',employee),
    removeItem:(id:number) => requests.delete(`employees/${id}`),
    updateItem:(id:number, employee:Employee) => requests.put(`employees/${id}`,employee),
   
};
debugger;


const agent = {
    Companies,
    Employees
};

export default agent;