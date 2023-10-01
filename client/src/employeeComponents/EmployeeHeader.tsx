import { AppBar, Box, Button,Toolbar, Typography } from "@mui/material";
import Menu from "../layout/Menu";

export default function EmployeeHeader(){

   
      
    return (
        <>
        <AppBar position="static" sx={{ backgroundColor: 'lightblue', mb:4}}>
            <Toolbar>
                <Box sx = {{flex:1, display:'flex', justifyContent: 'center'}}>
                     <Typography variant="h4">Employee List</Typography>
                </Box>
                <Menu/>
            </Toolbar>
        </AppBar>
        </>
       
    )
}