import React, { useEffect, useState } from "react";
import agent from "../../../context/agent";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { UserRole } from "../../models/userRole";
import BackButton from "../../../constants/BackButton";
import { useAppDispatch, useAppSelector } from "../../store/ConfigureStore";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import Menu from "../../../layout/Menu";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import EnumFormStateType from "../../models/EnumFormState";
import UpdateUserRole from "./UpdateUserRole";
import { UserRolesSelectors, fetchUserRoleAsync } from "../../../slices/accountSlice";
import Loading from "../Loading";

const UserRoleTable = () => {
  const { user, userRoleLoaded,status } = useAppSelector((state) => state.account);
  const roles = useAppSelector(UserRolesSelectors.selectAll);
  const [userId, setUserId] = useState<any | null>(null);
  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState<any>("");
  const [isOpenUpdatePopup, setIsOpenUpdatePopup] = useState(false);


  useEffect(() => {
    if (!userRoleLoaded)  dispatch(fetchUserRoleAsync());
    debugger;
  }, [userRoleLoaded, dispatch]);
  

  if (status === "pendingFetchUserRole") {
    return  <Loading message='Loading users role...' />
  }

  const handleUpdateUserRole = (props: any, formStateType: number) => {
    setFormState(formStateType);
    setIsOpenUpdatePopup(true);
    setUserId(props);
    debugger;
  };

  const handleClose = () => {
    setIsOpenUpdatePopup(false);
    setUserId(null);
  };
  // useEffect(() => {
  //    fetchRoleList();
  // },[]);

  // const fetchRoleList = () => {
  //   agent.Account.list()
  //   .then((response) => {
  //     setUserRoles(response);
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching user roles:", error);
  //   });
  // }

  const handleDownloadExcel = () => {
    const data = roles.map((userRole) => ({
      ID: userRole.userId.toString(),
      USERNAME: userRole.username,
      ROLE: userRole.roles?.join(", ") ?? "No Roles",
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users' Role List");

    XLSX.writeFile(wb, "userRole_list.xlsx");
  };

  return (
    <>
      <div>
        <div>
          <AppBar position="static" sx={{ backgroundColor: "#E57373", mb: 4 }}>
            <Toolbar>
              <BackButton />
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <Typography variant="h4">Users' Role List</Typography>
              </Box>
              {user ? (
                <Menu />
              ) : (
                <Link to="/loginPage" style={{ textDecoration: "none" }}>
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "#E57373",
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
        <UpdateUserRole
         handlePopupClose={handleClose}
         isOpenUpdatePopup={isOpenUpdatePopup}
         formState={formState}
         userId={userId}
        />
        <div>
          <Button onClick={handleDownloadExcel}>
            <ArrowCircleDownIcon sx={{ color: "#E57373", fontSize: "36px" }} />
          </Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ fontWeight: "bold", color: "#E57373", width: "400px" }}
              >
                USER ID
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "#E57373", width: "500px" }}
              >
                USERNAME
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "#E57373", width: "300px" }}
              >
                ROLES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((userRole) => (
             <TableRow key={userRole.userId}>
                <TableCell>{userRole.userId}</TableCell>
                <TableCell>{userRole.username}</TableCell>
                <TableCell>
                  {userRole.roles?.join(", ") ?? "No Roles"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handleUpdateUserRole(
                        userRole.userId,
                        EnumFormStateType.UpdateForm
                        
                      )
                    }
                  >
                    <EditIcon sx={{ color: "green" }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserRoleTable;
