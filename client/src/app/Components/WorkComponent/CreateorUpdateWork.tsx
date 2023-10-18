import { useEffect, useState } from "react";
import EnumFormStateType from "../../models/EnumFormState";
import { useAppDispatch } from "../../store/ConfigureStore";
import agent from "../../../context/agent";
import {
  addWorksAsync,
  fetchWorksAsync,
  updateWorkAsync,
} from "../../../slices/worksSlices";
import { Work } from "../../models/Work";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Checkbox,
  DialogActions,
  Button,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { formatDate } from "../../models/util";
import * as yup from "yup";
import ReactQuill from "react-quill";

interface CreateorUpdateWork {
  isOpenCreateorUpdatePopup: boolean;
  handlePopupClose: (event: {}) => void;
  formState: any;
  id: any;
}

const validationSchema = yup.object({
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters."),
});

export default function CreateorUpdateWork({
  isOpenCreateorUpdatePopup,
  handlePopupClose,
  formState,
  id,
}: CreateorUpdateWork) {
  const dispatch = useAppDispatch();

  const isWorkUpdate = () => {
    return formState == EnumFormStateType.UpdateForm;
  };
  const [work, setWork] = useState(
    isWorkUpdate()
      ? {
          title: "",
          description: "",
          employeeId: 0,
          assignedEmployee: "",
          companyId: 0,
          companyName: "",
          dueDate: new Date(),
          priority: 0,
        }
      : {
          id: 0,
          title: "",
          description: "",
          employeeId: 0,
          assignedEmployee: "",
          companyId: 0,
          companyName: "",
          dueDate: new Date(),
          priority: 0,
        }
  );
  useEffect(() => {
    getWorkById();
  }, [formState, id]);

  const getWorkById = () => {
    if (formState === EnumFormStateType.UpdateForm) {
      agent.Works.itemById(id)
        .then((response) => {
          setWork(response);
        })
        .catch((error) => {
          console.log("Error fetching work:", error);
        });
    }
  };

  const handleSubmit = async (values: Work) => {
    try {
      if (formState === EnumFormStateType.CreateForm) {
        await dispatch(addWorksAsync(values));
      } else {
        await dispatch(updateWorkAsync({ id, updatedWork: values }));
      }
      dispatch(fetchWorksAsync());
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
            backgroundColor: "purple",
            color: "white",
          }}
        >
          {id ? "Edit Work" : "Add Work"}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={work}
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
                    name="title"
                    label="Title"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <label htmlFor="description">Description</label>
                  <ReactQuill
                    id="description"
                    value={work.description || ""}
                    onChange={(value) => setWork((prevWork) => ({ ...prevWork, description: value }))}                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline"],
                        ["link"],
                      ],
                    }}
                  />
                  <div style={{ color: "red" }}>
                    <ErrorMessage name="description" component="div" />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="employeeId"
                    label="Employee ID"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="assignedEmployee"
                    label="Assigned Employee"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="companyId"
                    label="Company ID"
                    size="small"
                    fullWidth
                  />
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
                    name="dueDate"
                    label="Due Date"
                    size="small"
                    value={formatDate(work.dueDate)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    margin="dense"
                    name="priority"
                    label="Priority"
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
                    backgroundColor: "purple",
                    display: "flex",
                  }}
                >
                  {id ? "Edit" : "Add"}
                </Button>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "purple",
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
