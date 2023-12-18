import moment from "moment";

export const formatDate = (date: Date) => { 
  return moment(date).format("DD/MM/YYYY");
};
export const isAdmin = (user:any) => {
  return user && user.roles?.includes("Admin");
};

