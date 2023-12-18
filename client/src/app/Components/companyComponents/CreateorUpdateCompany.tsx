import { useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../../store/ConfigureStore";
import * as yup from "yup";
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
import { Company } from "../../models/company";
import {
  addCompaniesAsync,
  fetchCompaniesAsync,
  updateCompanyAsync,
} from "../../../slices/companiesSlice";
import EnumFormStateType from "../../models/EnumFormState";
import { formatDate } from "../../models/util";
import { useSelector } from "react-redux";

interface CreateorUpdateCompany {
  isOpenCreateorUpdatePopup: boolean;
  handlePopupClose: (event: {}) => void;
  formState: any;
  id: any;
}

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  title: yup
    .string()
    .required("Title is required")
    .min(10, "Title must be at least 10 characters."),
});

export default function CreateorUpdateCompany({
  isOpenCreateorUpdatePopup,
  handlePopupClose,
  formState,
  id,
}: CreateorUpdateCompany) {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.account)

  const isUpdate = () => {
    return formState == EnumFormStateType.UpdateForm;
  };
  const [company, setCompany] = useState(
    isUpdate()
      ? {
          name: "",
          title: "",
          address: "",
          taxNumber: "",
          createDate: new Date(),
          updateDate: new Date(),
          isActive: false,
        }
      : {
          id: 0,
          name: "",
          title: "",
          address: "",
          taxNumber: "",
          createDate: new Date(),
          updateDate: new Date(),
          isActive: false,
        }
  );
 

  useEffect(() => {
    getCompanyById(id);
  }, [formState,id]);

  const getCompanyById = (id:any) => {
    if (formState === EnumFormStateType.UpdateForm) {
      agent.Companies.itemById(id)
        .then((response) => {
          setCompany(response);
        })
        .catch((error) => {
          console.log("Error fetching company:", error);
        });
    }
  };

  const handleSubmit = async (values: Company) => {
    try {
      if (formState === EnumFormStateType.CreateForm) {
        await dispatch(addCompaniesAsync(values));
      } else {
        await dispatch(updateCompanyAsync({ id, updatedCompany: values }));
      }
      dispatch(fetchCompaniesAsync());
      handlePopupClose({});
    } catch (error: any) {
      console.log("Error adding company:", error);
    }
  };
 
  return (
    <>
      <Dialog open={isOpenCreateorUpdatePopup} onClose={handlePopupClose}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontStyle: "italic",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "lightgreen",
            color: "white",
          }}
        >
          {id ? "Edit Company" : "Add Company"}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={company}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="name"
                    label="Name"
                    size="small"
                    fullWidth
                  />
                  <div style={{ color: "red" }}>
                    <ErrorMessage name="name" component="div" />
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
                    name="address"
                    label="Address"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="taxNumber"
                    label="Tax Number"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="createDate"
                    label="Create Date"
                    size="small"
                    value={formatDate(company.createDate)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="updateDate"
                    label="Update Date"
                    size="small"
                    value={formatDate(company.updateDate)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label style={{ marginLeft: "8px" }}>Active</label>
                  <Field
                    as={Checkbox}
                    margin="dense"
                    label="Active"
                    name="isActive"
                    size="small"
                    value={company.isActive}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    backgroundColor: "lightgreen",
                    display: "flex",
                  }}
                  >
                  {id ? "Edit" : "Add"}
                </Button>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "lightgreen",
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
  );
}
