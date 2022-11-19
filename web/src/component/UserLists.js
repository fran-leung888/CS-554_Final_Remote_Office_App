import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

export default function BasicList(props) {


    const buidlUsers = () => {
        return props.users && props.users.map(user => {
            return (
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText >{user.name}</ListItemText>
                    </ListItemButton>
                </ListItem>
            )
        })
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

            <List dense={true}>
                {buidlUsers()}
            </List>
        </Box>
    );
}