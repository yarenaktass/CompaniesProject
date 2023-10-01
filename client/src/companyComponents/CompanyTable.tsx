import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/store/ConfigureStore";
import {
  companySelectors,
  fetchCompaniesAsync,
  removeCompanyAsync,
} from "../slices/companiesSlice";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateorUpdateCompany from "./CreateorUpdateCompany";
import EnumFormStateType from "../app/models/EnumFormState";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { formatDate } from "../app/models/util";
import CompanyHeader from "./CompanyHeader";

const CompanyTable = () => {
  const [formState, setFormState] = useState<any>("");
  const [isOpenCreateorUpdatePopup, setIsOpenCreateorUpdatePopup] =
    useState(false);
  const dispatch = useAppDispatch();
  const companies = useAppSelector(companySelectors.selectAll);
  const { companiesLoaded, status } = useAppSelector(
    (state) => state.companies
  );
  const [companyId, setCompanyId] = useState<number | null>(null);

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
    <CompanyHeader/>
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
          {companies.map((company) => (
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
