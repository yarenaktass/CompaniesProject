import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Menu from "./Menu";
import { Link } from "react-router-dom";
import { CSSProperties, useEffect } from "react";
import BackButton from "../constants/BackButton";
import { RootState, useAppSelector } from "../app/store/ConfigureStore";
import { useSelector } from "react-redux";

const companyTableImage = process.env.PUBLIC_URL + "/projectImg/companytable.png";
const employeeTableImage = process.env.PUBLIC_URL + "/projectImg/employeetable.png";
const workTableImg = process.env.PUBLIC_URL + "/projectImg/worktable.png";

export default function Home() {
  const { user } = useAppSelector((state) => state.account);
  const isLoggedIn = useSelector((state: RootState) => state.account.user !== null);
  const homeStyles: { [key: string]: CSSProperties } = {
    container: {
      textAlign: "center",
    },
    card: {
      maxWidth: "100%",
      marginTop: "40px",
      height:"100vh",
    },
    ctaButtons: {
      marginTop: "20px",
    },
    howToUse: {
      textAlign: "left",
      marginTop: "10px",
    },
    appBar: {
      backgroundColor: "pink",
    },
  };

  return (
    <div style={homeStyles.container}>
      <AppBar position="static" sx={homeStyles.appBar}>
        <Toolbar>
          <BackButton/>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Typography variant="h5">
              Company and Employee Management System
            </Typography>
          </Box>
          {user ? (
            <Menu/>
          ) : (
           <> <Link to="/loginPage" style={{ textDecoration: "none" }}>
           <Button
             sx={{
               color: "white",
               backgroundColor: "pink",
               display: "flex",
             }}
           >
             Login
           </Button>
         </Link>
        </>
          )}
        </Toolbar> 
      </AppBar>
      <Card style={homeStyles.card} variant="outlined">
        <CardContent style={{ height: "100%" }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
          You can review companies, their employees and employees' tasks, manage tables by editing and adding entries.
          </Typography>
       
          <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <div style={homeStyles.howToUse}>
              <Typography variant="h5" gutterBottom>
                How to Use ?
              </Typography>
              <List>
                <ListItem>
                  Click the "Add Company" button to add a new company.
                </ListItem>
                <ListItem>
                  After entering your company information, save it.
                </ListItem>
                <ListItem>
                  Click the "View Employees" button to manage employees.
                </ListItem>
                <ListItem>
                  Use the respective buttons to add new employees or update existing ones.
                </ListItem>
                <ListItem>
                You can assign tasks to your employees and manage the control of tasks.
                </ListItem>
              </List>
            </div>
            <div style={{ marginLeft: "20px" }}>
              <img src={companyTableImage} alt="Company Table" style={{ width: "400px", marginRight: "20px" }} />
              <img src={employeeTableImage} alt="Employee Table" style={{ width: "400px" }} />
              <img src={workTableImg} alt="Work Table" style={{width:"400px"}}/>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




