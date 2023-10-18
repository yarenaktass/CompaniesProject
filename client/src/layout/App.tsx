import EmployeeTable from "../app/Components/employeeComponents/EmployeeTable";
import CompanyTable from "../app/Components/companyComponents/CompanyTable";
import { Routes, Route } from "react-router-dom";
import HomeHeader from "./Home";
import WorkTable from "../app/Components/WorkComponent/WorkTable";
import Login from "../app/Components/account/Login";
import Register from "../app/Components/account/Register";

function App() {
  
  return (
    <div>
   <Routes>
    <Route path='/' element={<HomeHeader/>}/>
    <Route path='/companyTable' element={<CompanyTable/>}/>
    <Route path='/employeeTable' element={<EmployeeTable/>}/>
    <Route path='/workTable' element={<WorkTable/>}/>
    <Route path="/loginPage" element={<Login/>}/>
    <Route path="/registerPage" element={<Register/>}/>
   </Routes>
    </div>
  );
}

export default App;
