import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/store/ConfigureStore";
import {
  employeeSelectors,
  fetchEmployeesAsync,
  removeEmployeeAsync,
} from "../slices/employeesSlice";
import EnumFormStateType from "../app/models/EnumFormState";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { useEffect, useState } from "react";
import CreateorUpdateEmployee from "./CreateorUpdateEmployee";
import EmployeeHeader from "./EmployeeHeader";

const EmployeeTable = () => {
  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState<any>("");
  const [isEmployeeCreateorUpdatePopup, setIsEmployeeCreateorUpdatePopup] =
  useState(false);
  const [employeeId, setEmployeeeId] = useState<number | null>(null);
  const employees = useAppSelector(employeeSelectors.selectAll);
  const { employeesLoaded, status } = useAppSelector(
    (state) => state.employees
  );

  useEffect(() => {
    if(!employeesLoaded) dispatch(fetchEmployeesAsync());
  }, [employeesLoaded,dispatch]);

  const handleCreateorUpdateEmployee = (props: any, formStateType: number) => {
    setFormState(formStateType);
    setIsEmployeeCreateorUpdatePopup(true);
    setEmployeeeId(props);
  };

  const handlePopupClose = () => {
    setIsEmployeeCreateorUpdatePopup(false);
    setEmployeeeId(null);
  };

  const handleDownloadExcelEmployees = () => {
       const data = employees.map((employee) => ({
        "ID": employee.id.toString(),
        "FIRST NAME" : employee.firstName,
        "LAST NAME" : employee.lastName,
        "TİTLE": employee.title,
        // "COMPANY ID ": employee.companyId.ToStrinng(),
        "COMPANY NAME": employee.companyName,
        "E- MAİL": employee.email,
        "PHONE NUMBER": employee.phoneNumber
       }));

       const ws = XLSX.utils.json_to_sheet(data);
       const wb = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, "Employee List");
       XLSX.writeFile(wb, "employee_list.xlsx");
  };
  return (
    <>
    <EmployeeHeader/>
    <CreateorUpdateEmployee
       key={formState ===EnumFormStateType.UpdateForm ? "edit" : "add"}
       isEmployeeCreateorUpdatePopup={isEmployeeCreateorUpdatePopup}
       handlePopupClose={handlePopupClose}
       formState={formState}
       id={employeeId}
    />
    <div style={{display:"flex", alignItems:'center'}}>
      <Button
        variant="contained"
        sx={{ color: "white", backgroundColor: "darkbluee", display: "flex" }}
        onClick={() =>
          handleCreateorUpdateEmployee(null, EnumFormStateType.CreateForm)
        }
      >
        Add Employee
      </Button>
        <Button onClick={handleDownloadExcelEmployees}>
        <ArrowCircleDownIcon sx={{ color: "darkblue", fontSize: "36px" }} />
        </Button>
    </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "80px"  }}
            >
              NAME
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "80px" }}
            >
              SURNAME
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "200px"  }}
            >
              TİTLE
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "200px" }}
            >
              COMPANY NAME
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "200px" }}
            >
              E-MAİL
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "150px" }}
            >
              PHONE NUMBER
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.firstName}</TableCell>
              <TableCell>{employee.lastName}</TableCell>
              <TableCell>{employee.title}</TableCell>
              <TableCell>{employee.companyName}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phoneNumber}</TableCell>

              <TableCell>
                <Button
                  onClick={() =>
                    handleCreateorUpdateEmployee(
                      employee.id,
                      EnumFormStateType.UpdateForm
                    )
                  }
                >
                  <EditIcon sx={{ color: "darkGreen" }} />
                </Button>
                <Button
                  onClick={() =>
                    dispatch(
                      removeEmployeeAsync({
                        employeeId: employee.id.toString(),
                      })
                    )
                  }
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default EmployeeTable;
