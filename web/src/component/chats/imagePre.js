import React, { useEffect, useState, useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";


export default function ImagePre(props) {
  console.log("render image preview", props.data);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <img
        src={props.data.cropped}
        loading="lazy"
      />
      <Dialog onClose={()=>{handleClose}} open={open}>
        <img src={props.data.original}
        loading="lazy"></img>
      </Dialog>
    </div>
  );
}
