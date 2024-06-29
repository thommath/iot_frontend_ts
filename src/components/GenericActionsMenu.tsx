import { MouseEvent, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface Props {
  actions: {
    label: string;
    func: () => void;
  }[];
}

export function GenericActionsMenu(props: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="action-button"
        aria-controls={open ? "actions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "action-button",
        }}
      >
        {props.actions.map(({ label, func }) => (
          <MenuItem
            key={label}
            onClick={() => {
              handleClose();
              func();
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
