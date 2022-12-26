import React from "react";
import Grid from "@mui/material/Grid";
import SideBar from "./SideBar";

export default () => {
  return (
    <Grid container>
      <Grid item xs={2}>
        <SideBar></SideBar>
      </Grid>
      <Grid item xs={4}>
        <SideBar></SideBar>
      </Grid>
    </Grid>
  );
};
