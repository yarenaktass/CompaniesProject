import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/ConfigureStore";
import * as yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import agent from "../../../context/agent";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Employee } from "../../models/employee";
import { addEmployeesAsync, fetchEmployeesAsync, updateEmployeeAsync } from "../../../slices/employeesSlice";
import EnumFormStateType from "../../models/EnumFormState";

interface CreateorUpdateEmployee {
    isEmployeeCreateorUpdatePopup: boolean;
    handlePopupClose: (event: {}) => void;
    formState: any
    id:any
}

const validationSchema = yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    title:yup.string().required("title is required").min(10, "Title must be at least 10 characters."),

});

export default function CreateorUpdateEmployee({isEmployeeCreateorUpdatePopup,handlePopupClose,formState,id}:CreateorUpdateEmployee){
    const dispatch = useAppDispatch();
    const isEmployeeUpdate = () => {
        return formState == EnumFormStateType.UpdateForm;
    };

    const [employee, setEmployeee] = useState(
        isEmployeeUpdate()
        ? {
            firstName:"",
            lastName:"",
            title:"",
            companyId:0,
            companyName:"",
            email:"",
            phoneNumber:"",
        }
        :{
            id:0,
            firstName:"",
            lastName:"",
            title:"",
            companyId:0,
            companyName:"",
            email:"",
            phoneNumber:"",
        }
    );

    useEffect(() => {
        getEmployeebyId();
    },[formState,id]);

    const getEmployeebyId = () =>{
        if(formState === EnumFormStateType.UpdateForm){
            agent.Employees.itemById(id)
              .then((response) => {
                setEmployeee(response);
              })
              .catch((error) => {
                console.log("Error fetching employee:", error);
              });
        }
    };

    const handleEmployeeSubmit = async (values:Employee) => {
        try {
            if(formState === EnumFormStateType.CreateForm){
                await dispatch(addEmployeesAsync(values));
            }else {
                await dispatch(updateEmployeeAsync({id, updatedEmployee:values}));
            }
            dispatch(fetchEmployeesAsync());
            handlePopupClose({});
        } catch (error:any) {
            console.log("Error adding company:", error);
        }
    };

    return(
        <>
        <Dialog open={isEmployeeCreateorUpdatePopup} onClose={handlePopupClose}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontStyle: "italic",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "lightblue",
            color: "white",
          }}
        >
          {id ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={employee}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleEmployeeSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="firstName"
                    label="Name"
                    size="small"
                    fullWidth
                  />
                  <div style={{ color: "red" }}>
                    <ErrorMessage name="firstName" component="div" />
                  </div>{" "}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="lastName"
                    label="Surname"
                    size="small"
                    fullWidth
                  />
                     <div style={{ color: "red" }}>
                    <ErrorMessage name="lastName" component="div" />
                  </div>{" "}
            
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="title"
                    label="Title"
                    size="small"
                    fullWidth
                  />
                        <div style={{ color: "red" }}>
                    <ErrorMessage name="title" component="div" />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="companyName"
                    label="Company Name"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="companyId"
                    label="CompanyID"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="email"
                    label="E-mail"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="phoneNumber"
                    label="Phone Number"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    backgroundColor: "lightblue",
                    display: "flex",
                  }}
                >
                  {id ? "Edit" : "Add"}
                </Button>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "lightblue",
                    display: "flex",
                  }}
                  onClick={(event) => handlePopupClose(event)}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
        </>
    )
};