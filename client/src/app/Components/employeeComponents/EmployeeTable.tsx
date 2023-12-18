import {
  AppBar,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/ConfigureStore";
import {
  employeeSelectors,
  fetchEmployeesAsync,
  removeEmployeeAsync,
} from "../../../slices/employeesSlice";
import EnumFormStateType from "../../models/EnumFormState";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { useEffect, useState } from "react";
import CreateorUpdateEmployee from "./CreateorUpdateEmployee";
import BackButton from "../../../constants/BackButton";
import Menu from "../../../layout/Menu";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const EmployeeTable = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state)=> state.account);
  const [formState, setFormState] = useState<any>("");
  const [isEmployeeCreateorUpdatePopup, setIsEmployeeCreateorUpdatePopup] =
    useState(false);
  const [employeeId, setEmployeeeId] = useState<number | null>(null);
  const employees = useAppSelector(employeeSelectors.selectAll);
  const { employeesLoaded, status } = useAppSelector(
    (state) => state.employees
  );
  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermCompanyName, setSearchTermCompanyName] = useState("");
  
  const filteredEmployees = employees.filter((employee) => {
    const name = employee.firstName.toLowerCase();
    const companyName = employee.companyName.toLowerCase();
    const searchName = searchTermName.toLowerCase();
    const searchCompanyName = searchTermCompanyName.toLowerCase();
    return name.includes(searchName) && companyName.includes(searchCompanyName);
  });

  useEffect(() => {
    if (!employeesLoaded) dispatch(fetchEmployeesAsync());
  }, [employeesLoaded, dispatch]);


  if (status === "pendingFetchEmployees") {
    return  <Loading message='Loading products...' />
  }

  const handleCreateorUpdateEmployee = (props: any, formStateType: number) => {
    setFormState(formStateType);
    setIsEmployeeCreateorUpdatePopup(true);
    setEmployeeeId(props);
    debugger;
  };

  const handlePopupClose = () => {
    setIsEmployeeCreateorUpdatePopup(false);
    setEmployeeeId(null);
  };

  const handleDownloadExcelEmployees = () => {
    const data = employees.map((employee) => ({
      ID: employee.id.toString(),
      "FIRST NAME": employee.firstName,
      "LAST NAME": employee.lastName,
      TİTLE: employee.title,
      // "COMPANY ID ": employee.companyId.ToStrinng(),
      "COMPANY NAME": employee.companyName,
      "E- MAİL": employee.email,
      "PHONE NUMBER": employee.phoneNumber,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee List");
    XLSX.writeFile(wb, "employee_list.xlsx");
  };
  return (
    <>
       <AppBar position="static" sx={{ backgroundColor: 'lightblue', mb:4}}>
            <Toolbar>
                <BackButton/>
                <Box sx = {{flex:1, display:'flex', justifyContent: 'center'}}>
                     <Typography variant="h4">Employee List</Typography>
                </Box>
                {user ? (
            <Menu />
          ) : (
            <Link to="/loginPage" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "lightblue",
                  display: "flex",
                }}
              >
                Login
              </Button>
            </Link>
          )}
            </Toolbar>
        </AppBar>
      <CreateorUpdateEmployee
        key={formState === EnumFormStateType.UpdateForm ? "edit" : "add"}
        isEmployeeCreateorUpdatePopup={isEmployeeCreateorUpdatePopup}
        handlePopupClose={handlePopupClose}
        formState={formState}
        id={employeeId}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
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
        <div>
        <TextField
          size="small"
          placeholder="searc by name..."
          value={searchTermName}
          onChange={(e) => setSearchTermName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "darkblue",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "darkblue",
              },
              "&.Mui-focudes fieldset": {
                borderColor: "darkblue",
              },
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        </div>
        <div style={{marginLeft: "10px"}}>
        <TextField
          size="small"
          placeholder="searc by company name..."
          value={searchTermCompanyName}
          onChange={(e) => setSearchTermCompanyName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "darkblue",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "darkblue",
              },
              "&.Mui-focudes fieldset": {
                borderColor: "darkblue",
              },
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        </div>
        
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "100px" }}
            >
              NAME
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "100px" }}
            >
              SURNAME
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "400px" }}
            >
              TİTLE
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "blue", width: "300px" }}
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
          {filteredEmployees.map((employee) => (
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
