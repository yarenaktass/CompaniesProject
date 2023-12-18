import React, { useEffect, useState } from "react";
import agent from "../../../context/agent";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/ConfigureStore";
import { UserRole } from "../../models/userRole";
import EnumFormStateType from "../../models/EnumFormState";
import { fetchUserRoleAsync } from "../../../slices/accountSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";

interface UpdateUserRoleProps {
  isOpenUpdatePopup: boolean;
  handlePopupClose: (event: {}) => void;
  formState: any;
  userId: any;
}

const UpdateUserRole: React.FC<UpdateUserRoleProps> = ({
  isOpenUpdatePopup,
  formState,
  handlePopupClose,
  userId,
}) => {
  const dispatch = useAppDispatch();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const [userDetails, setUserDetails] = useState<UserRole>({
    userId: "",
    username: "",
    roles: [],
  });
  const [roleList, setRoleList] = useState<string[]>([]);

  const handleSubmit = async (userRole: UserRole) => {
    try {
        console.log("Submitting userRole:", userRole);
        await agent.Account.changeRoles(userRole);
        console.log("Roles changed successfully.");
        debugger;
        dispatch(fetchUserRoleAsync());
        debugger;
        handlePopupClose({});
        console.log("Popup closed successfully.");
    } catch (error: any) {
        console.error("Error updating user roles:", error);
    }
};

 const FetchUserRoleList = () => {
  agent.Account.list()
  .then((response) => {
    setUserRoles(response);
  })
  .catch((error) => {
    console.error("Error fetching user roles:", error);
  });
}


  useEffect(() => {
    console.log("userId veya formState değişti:", userId, formState);
    getUserRoleById();
    fetchRoleList(); 
    debugger;
  }, [formState, userId]);


  const getUserRoleById = () => {
    if (formState === EnumFormStateType.UpdateForm && userId) {
      agent.Account.itemById(userId)
        .then((response) => {
          setUserDetails(response);
          debugger;
        })
        .catch((error) => {
          console.error("Error fetching userRole:", error);
        });
    }
  };
  const fetchRoleList = () => {
    agent.Account.list()
      .then((response) => {
        const roles = response.map((userRole: any) => userRole.roles).flat();
        const uniqueRoles: string[] = Array.from(new Set(roles));
        setRoleList(uniqueRoles);
      })
      .catch((error) => {
        console.error("Error fetching role list:", error);
      });
  };
  

  return (
    <Dialog open={isOpenUpdatePopup} onClose={handlePopupClose}>
      <DialogTitle>Edit User Roles</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={userDetails}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          <Form>
            <Field
              as={TextField}
              margin="dense"
              label="Username"
              fullWidth
              name="username"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="roles-label">Roles</InputLabel>
              <Field as={Select} labelId="roles-label" name="roles" multiple>
                {roleList.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "#E57373",
                  display: "flex",
                }}
              >
                Edit
              </Button>
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "#E57373",
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
  );
};

export default UpdateUserRole;
