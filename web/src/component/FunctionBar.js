import React from 'react'
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from './Avatar';
import SearchUser from './SearchUser'
export default () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <Grid container direction='column'>
            <Grid item xs={2}>
                <Avatar>sdsd</Avatar>
                <IconButton onClick={handleClickOpen}>
                    <SearchIcon />
                </IconButton>
                <SearchUser open={open} handleClose={handleClose}/>
            </Grid>
            <Grid item xs={4}>
            </Grid>
        </Grid>
    )
}