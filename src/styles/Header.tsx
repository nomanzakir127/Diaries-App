import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { purple } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../rootReducer';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { useAppDispatch } from '../store';
import { setAuthState } from '../features/auth/authSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  header:{
      backgroundColor : purple[500],
      maxHeight: 50
  }
}));

export default function Header() {
  const classes = useStyles();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch();
  const cursor = {cursor:'pointer'}
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Diary
          </Typography>
           {isAuthenticated ? <PowerSettingsNewIcon onClick={() => dispatch(setAuthState(false))} style={cursor}/> : null} 
        </Toolbar>
      </AppBar>
    </div>
  );
}