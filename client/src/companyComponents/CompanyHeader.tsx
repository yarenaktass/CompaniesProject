import { AppBar, Box, Button,Toolbar, Typography } from "@mui/material";
import Menu from "../layout/Menu";

export default function CompanyHeader(){

   
      
    return (
        <>
        <AppBar position="static" sx={{ backgroundColor: 'lightgreen', mb:4}}>
            <Toolbar>
                <Box sx = {{flex:1, display:'flex', justifyContent: 'center'}}>
                     <Typography variant="h4">Company List</Typography>
                </Box>
                <Menu/>
            </Toolbar>
        </AppBar>
        </>
       
    )
}