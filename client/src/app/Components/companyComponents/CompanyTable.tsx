import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/ConfigureStore";
import {
  companySelectors,
  fetchCompaniesAsync,
  removeCompanyAsync,
} from "../../../slices/companiesSlice";
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
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import CreateorUpdateCompany from "./CreateorUpdateCompany";
import EnumFormStateType from "../../models/EnumFormState";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { formatDate } from "../../models/util";
import { title } from "process";
import BackButton from "../../../constants/BackButton";
import Menu from "../../../layout/Menu";
import { Link } from "react-router-dom";

const CompanyTable = () => {
  const [formState, setFormState] = useState<any>("");
  const { user } = useAppSelector((state) => state.account);
  const [isOpenCreateorUpdatePopup, setIsOpenCreateorUpdatePopup] =
    useState(false);
  const dispatch = useAppDispatch();
  const companies = useAppSelector(companySelectors.selectAll);
  const { companiesLoaded, status } = useAppSelector(
    (state) => state.companies
  );
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermTitle, setSearchTermTitle] = useState("");  

  const filteredCompanies = companies.filter((company) =>{
    const name = company.name.toLowerCase();
    const title = company.title.toLowerCase();
    const searchName = searchTermName.toLowerCase();
    const searchTitle = searchTermTitle.toLowerCase();
    return name.includes(searchName) && title.includes(searchTitle);
  });

  useEffect(() => {
    if (!companiesLoaded) dispatch(fetchCompaniesAsync());
  }, [companiesLoaded, dispatch]);

  if (status === "pendingFetchCompanies") {
    return <div>Loading...</div>;
  }

  const handleCreateorUpdateCompany = (props: any, formStateType: number) => {
    setFormState(formStateType);
    setIsOpenCreateorUpdatePopup(true);
    setCompanyId(props);
  };

  const handleClose = () => {
    setIsOpenCreateorUpdatePopup(false);
    setCompanyId(null);
  };

  const handleDownloadExcel = () => {
    const data = companies.map((company) => ({
      ID: company.id.toString(),
      NAME: company.name,
      TİTLE: company.title,
      ACTİVE: company.isActive.toString(),
      "TAX NUMBER": company.taxNumber,
      "CREATE DATE": company.createDate.toLocaleString(),
      "UPDATE DATE": company.updateDate.toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Company List");

    XLSX.writeFile(wb, "company_list.xlsx");
  };

  return (
    <>
   <div>
   <AppBar position="static" sx={{ backgroundColor: 'lightgreen', mb:4}}>
            <Toolbar>
                <BackButton/>
                <Box sx = {{flex:1, display:'flex', justifyContent: 'center'}}>
                     <Typography variant="h4">Company List</Typography>
                </Box>
                {user ? (
            <Menu />
          ) : (
            <Link to="/loginPage" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "lightgreen",
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
      <CreateorUpdateCompany
        key={formState === EnumFormStateType.UpdateForm ? "edit" : "add"}
        handlePopupClose={handleClose}
        isOpenCreateorUpdatePopup={isOpenCreateorUpdatePopup}
        formState={formState}
        id={companyId}
      />
    <div style={{display:"flex", alignItems:'center'}}>
    <Button
        variant="contained"
        sx={{ color: "white", backgroundColor: "darkGreen", display: "flex" }}
        onClick={() =>
          handleCreateorUpdateCompany(null, EnumFormStateType.CreateForm)
        }
      >
        Add Company
      </Button>
      <Button onClick={handleDownloadExcel}>
        <ArrowCircleDownIcon sx={{ color: "darkgreen", fontSize: "36px" }} />
      </Button>
     <div>
     <TextField
          size="small"
          placeholder="search by name..."
          value={searchTermName}
          onChange={(e) => setSearchTermName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset" : {
                borderColor: "darkgreen",
                borderWidth:2,
              },
              "&:hover fieldset" : {
                borderColor:"darkgreen", // Mouse ile üstüne gelindiğinde çizgi rengi
              },
              "&.Mui-focused fieldset": {
                borderColor: "darkgreen",   // Odaklandığında çizgi rengi
              },
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon/>
          }}
      />
     </div>
       <div style={{marginLeft:"10px"}}>
       <TextField
          size="small"
          placeholder="search by title..."
          value={searchTermTitle}
          onChange={(e) => setSearchTermTitle(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset" : {
                borderColor: "darkgreen",
                borderWidth:2,
              },
              "&:hover fieldset" : {
                borderColor:"darkgreen", // Mouse ile üstüne gelindiğinde çizgi rengi
              },
              "&.Mui-focused fieldset": {
                borderColor: "darkgreen",   // Odaklandığında çizgi rengi
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
            {/* <TableCell style={{ fontWeight: 'bold', color: 'green' }}>ID</TableCell> */}
            <TableCell style={{ fontWeight: "bold", color: "green" , width:"50px" }}>
              NAME
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "green" , width:"150px" }}>
              TİTLE
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "green", width:"500px" }}>
              ADDRESS
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "green", width:"40px" }}>
              ACTİVE
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "green", width:"40px" }}>
              TAX NUMBER
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "green" , width:"40px" }}>
              CREATE DATE
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "green", width:"40px"  }}>
              UPDATE DATE
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCompanies.map((company) => (
            <TableRow key={company.id}>
              {/* <TableCell>{company.id.toString()}</TableCell> */}
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.title}</TableCell>
              <TableCell>{company.address}</TableCell>
              <TableCell>
                {company.isActive ? (
                  <CheckIcon sx={{ color: "green" }} />
                ) : (
                  <ClearIcon sx={{ color: "red" }} />
                )}
              </TableCell>
              <TableCell>{company.taxNumber}</TableCell>
              <TableCell>
                  {formatDate(company.createDate)}
              </TableCell>
              <TableCell>
                   {formatDate(company.createDate)}
              </TableCell>

              <TableCell>
                <Button
                  onClick={() =>
                    handleCreateorUpdateCompany(
                      company.id,
                      EnumFormStateType.UpdateForm
                    )
                  }
                >
                  <EditIcon sx={{ color: "darkGreen" }} />
                </Button>
                <Button
                  onClick={() =>
                    dispatch(
                      removeCompanyAsync({ companyId: company.id.toString() })
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

export default CompanyTable;
