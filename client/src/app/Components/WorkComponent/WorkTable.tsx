import { Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import EnumFormStateType from "../../models/EnumFormState";
import { formatDate } from "../../models/util";
import { useAppDispatch, useAppSelector } from "../../store/ConfigureStore";
import { removeCompanyAsync } from "../../../slices/companiesSlice";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from "@mui/icons-material/Edit";
import { fetchWorksAsync, removeWorkAsync, workSelectors } from "../../../slices/worksSlices";
import * as XLSX from "xlsx";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import CreateorUpdateWork from "./CreateorUpdateWork";
import Menu from "../../../layout/Menu";
import BackButton from "../../../constants/BackButton";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const WorkTable = () => {
    const [formState, setFormState] = useState<any>("");
    const { user } = useAppSelector((state) => state.account);
    const [isOpenCreateorUpdatePopup, setIsOpenCreateorUpdatePopup] =
      useState(false);
    const dispatch = useAppDispatch();
    const works = useAppSelector(workSelectors.selectAll);
    const { worksLoaded, status } = useAppSelector(
      (state) => state.works
    );
    const [worksId, setWorkId] = useState<number | null>(null);
    const [searchTermCompanyName, setSearchTermCompanyName] = useState("");  
  
    const filteredWorks = works.filter((work) =>{
      const companyName = work.companyName.toLowerCase();
      const searchCompanyName = searchTermCompanyName.toLowerCase();
      return companyName.includes(searchCompanyName);
    });
  
    useEffect(() => {
      if (!worksLoaded) dispatch(fetchWorksAsync());
    }, [worksLoaded, dispatch]);
  
    if (status === "pendingFetchWorks") {
      return <Loading message='Loading products...' />
    }
  
    const handleCreateorUpdateWork = (props: any, formStateType: number) => {
      setFormState(formStateType);
      setIsOpenCreateorUpdatePopup(true);
      setWorkId(props);
    };
  
    const handleClose = () => {
      setIsOpenCreateorUpdatePopup(false);
      setWorkId(null);
    };
  
    const handleDownloadExcel = () => {
      const data = works.map((work) => ({
        "ID": work.id.toString(),
        "TİTLE": work.title,
        "DESCRİPTİON": work.description,
        "EMPLOYEE ID": work.employeeId.toString(),
        "ASSİGNED EMPLOYEE": work.assignedEmployee,
        "COMPANY ID": work.companyId.toString(),
        "COMPANY NAME": work.companyName.toLocaleString(),
        "PRİORİTY": work.priority.toString(),
        "DUE DATE": work.dueDate.toLocaleString(),
      }));
  
      const ws = XLSX.utils.json_to_sheet(data);
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Work List");
  
      XLSX.writeFile(wb, "work_list.xlsx");
    };
  
    return (
      <>
        <div>
        <AppBar position="static" sx={{ backgroundColor: 'purple', mb:4}}>
            <Toolbar>
                <BackButton/>
                <Box sx = {{flex:1, display:'flex', justifyContent: 'center'}}>
                     <Typography variant="h4">Work List</Typography>
                </Box>
                {user ? (
            <Menu />
          ) : (
            <Link to="/loginPage" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "purple",
                  display: "flex",
                }}
              >
                Login
              </Button>
            </Link>
          )}
            </Toolbar>
        </AppBar>
        </div>
        <CreateorUpdateWork
          key={formState === EnumFormStateType.UpdateForm ? "edit" : "add"}
          handlePopupClose={handleClose}
          isOpenCreateorUpdatePopup={isOpenCreateorUpdatePopup}
          formState={formState}
          id={worksId}
        />
      <div style={{display:"flex", alignItems:'center'}}>
      <Button
          variant="contained"
          sx={{ color: "white", backgroundColor: "purple", display: "flex" }}
          onClick={() =>
            handleCreateorUpdateWork(null, EnumFormStateType.CreateForm)
          }
        >
          Add Work
        </Button>
        <Button onClick={handleDownloadExcel}>
          <ArrowCircleDownIcon sx={{ color: "purple", fontSize: "36px" }} />
        </Button>
         <div style={{marginLeft:"10px"}}>
         <TextField
            size="small"
            placeholder="search by title..."
            value={searchTermCompanyName}
            onChange={(e) => setSearchTermCompanyName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset" : {
                  borderColor: "purple",
                  borderWidth:2,
                },
                "&:hover fieldset" : {
                  borderColor:"purple", // Mouse ile üstüne gelindiğinde çizgi rengi
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple",   // Odaklandığında çizgi rengi
                },
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon/>
            }}
        />
         </div>
      </div>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "purple" , width:"50px" }}>
                TİTLE
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "purple" , width:"400px" }}>
                DESCRİPTİON
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "purple", width:"200px" }}>
                ASSİGNED EMPLOYEE
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "purple", width:"150px" }}>
                COMPANY NAME
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "purple", width:"30px" }}>
                PRİORİTY
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "purple", width:"80px" }}>
                DUE DATE
              </TableCell>
           
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorks.map((work) => (
              <TableRow key={work.id}>
                <TableCell>{work.title}</TableCell>
                <TableCell dangerouslySetInnerHTML={{ __html: work.description }} />
                <TableCell>{work.assignedEmployee}</TableCell>
                <TableCell>{work.companyName}</TableCell>
                <TableCell>{work.priority}</TableCell>
                <TableCell>
                    {formatDate(work.dueDate)}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handleCreateorUpdateWork(
                        work.id,
                        EnumFormStateType.UpdateForm
                      )
                    }
                  >
                    <EditIcon sx={{ color: "darkGreen" }} />
                  </Button>
                  <Button
                    onClick={() =>
                      dispatch(
                        removeWorkAsync({ workId: work.id.toString() })
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
  
  export default WorkTable;
  