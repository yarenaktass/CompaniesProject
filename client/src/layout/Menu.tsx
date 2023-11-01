import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../app/store/ConfigureStore";
import { signOut } from "../slices/accountSlice";

const menuLinkStyles = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none", // Altı çizili gelmemesi için
  padding: "8px 16px", // İkon ve metin arasındaki boşlukları artırır
};

const menuIconStyles = {
  color: "white",
};
const iconsStyle = {
  marginRight: "8px",
};

export default function Menu() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const prevOpen = React.useRef(open);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // style={{ zIndex: 1000 }} menü bileşenini diğer bileşenlerin üzerine getirecektir.
  return (
    <Stack direction="row" spacing={2}>
      <div style={{ zIndex: 1000 }}>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <MenuIcon style={menuIconStyles} />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {/* <MenuItem onClick={handleClose}>
                      <Link to="/loginPage" style={menuLinkStyles}>
                        <LockOpenIcon sx={iconsStyle} />
                        Sing-in
                      </Link>
                    </MenuItem> */}
                    <MenuItem onClick={handleClose}>
                      <Link to="/" style={menuLinkStyles}>
                        <HomeIcon sx={iconsStyle} />
                        Home
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link to="/companyTable" style={menuLinkStyles}>
                        <ApartmentIcon sx={iconsStyle} />
                        Company List
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link to="/employeeTable" style={menuLinkStyles}>
                        <BadgeIcon sx={iconsStyle} />
                        Employee List
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link to="/workTable" style={menuLinkStyles}>
                        <AssignmentIcon sx={iconsStyle} />
                        Work List
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        dispatch(signOut());
                      }}
                    >
                      <Link to="/loginPage" style={menuLinkStyles}>
                        <LogoutIcon sx={iconsStyle} />
                        Logout
                      </Link>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
