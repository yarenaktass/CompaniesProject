import EmployeeTable from "../employeeComponents/EmployeeTable";
import CompanyTable from "../companyComponents/CompanyTable";
import { Routes, Route } from "react-router-dom";
import HomeHeader from "./Home";

function App() {
  
  return (
    <div>
   <Routes>
    <Route path='/' element={<HomeHeader/>}/>
    <Route path='/companyTable' element={<CompanyTable/>}/>
    <Route path='/employeeTable' element={<EmployeeTable/>}/>
   </Routes>
    </div>
  );
}

export default App;
