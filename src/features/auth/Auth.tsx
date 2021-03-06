import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../interfaces/user.interface';
// import * as Yup from 'yup';
import http from '../../services/api';
import { saveToken, setAuthState } from './authSlice';
import { setUser } from './userSlice';
import { AuthResponse } from '../../services/mirage/routes/user';
import { useAppDispatch } from '../../store';
import { makeStyles } from '@material-ui/core/styles';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import EmailIcon from '@material-ui/icons/Email';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import { purple } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { ColorButton } from '../../styles/ColorButton'
// const schema = Yup.object().shape({
//   username: Yup.string()
//     .required('What? No username?')
//     .max(16, 'Username cannot be longer than 16 characters'),
//   password: Yup.string().required('Without a password, "None shall pass!"'),
//   email: Yup.string().email('Please provide a valid email address (abc@xy.z)'),
// });

const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: theme.spacing(2),
  },
  root:{
    marginTop: theme.spacing(3),
  },
  title: {
    fontSize: 14,
    float: 'right'
  },
  loginButton:{
    float:'right'
  },
  textField:{
    width: '100%'
  },
  form:{
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
  },
  cardTitle:{
    textAlign:'center'
  }
}));



const Auth: FC = () => {
  const { handleSubmit, register, errors } = useForm<User>();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const submitForm = (data: User) => {
    const path = isLogin ? '/auth/login' : '/auth/signup';
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12} sm={2} md={3} lg={3}></Grid>
        <Grid item xs={12} sm={8} md={6} lg={6}>
          <FormControl className={classes.form}>
            <Card>
              <CardContent>
                <div className={classes.margin}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <div className={classes.cardTitle}>
                          <Typography variant="h5" component="h2">
                            {isLogin ? 'Login' : 'Sign up'}
                          </Typography>
                        </div>
                    </Grid>
                  </Grid>
                </div>
                <div className={classes.margin}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={1} sm={1} md={1} lg={1}>
                        <AccountCircle style={{ color: purple[500] }}/>
                    </Grid>
                    <Grid item xs={11} sm={11} md={11} lg={11}>
                      <TextField id="input-username" className={classes.textField} ref={register} name="username" label="User name" />
                    </Grid>
                  </Grid>
                  {errors && errors.username && (
                      <p className="error">{errors.username.message}</p>
                  )}
                </div>
                <div className={classes.margin}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={1} sm={1} md={1} lg={1}>
                        <VpnKeyIcon style={{ color: purple[500] }}/>
                    </Grid>
                    <Grid item xs={11} sm={11} md={11} lg={11}>
                    <TextField id="input-password" className={classes.textField} ref={register} name="password" type="password" label="Password" />
                    </Grid>
                  </Grid>
                  {errors && errors.username && (
                      <p className="error">{errors.username.message}</p>
                  )}
                </div>
                {
                  !isLogin && (
                    <div className={classes.margin}>
                      <Grid container spacing={1} alignItems="flex-end">
                        <Grid item xs={1} sm={1} md={1} lg={1}>
                          <EmailIcon style={{ color: purple[500] }}/>
                        </Grid>
                        <Grid item xs={11} sm={11} md={11} lg={11}>
                          <TextField id="input-email" className={classes.textField} ref={register} name="email" label="Email"/>
                        </Grid>
                      </Grid>
                      {errors && errors.email && (
                        <p className="error">{errors.email.message}</p>
                      )}
                    </div>
                  )
                }
                <div className={classes.margin}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <ColorButton  color="primary" className={classes.loginButton} size="small" type="submit" disabled={loading} onClick={handleSubmit(submitForm)} startIcon={<ExitToAppIcon />}>
                          {isLogin ? 'Login' : 'Create account'}
                      </ColorButton >
                    </Grid>
                  </Grid>
                </div>
                <div className={classes.margin}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography className={classes.title} color="textSecondary" gutterBottom
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ cursor: 'pointer', opacity: 0.7 }}
                        >
                        {isLogin ? 'No account? Create one' : 'Already have an account?'}
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
                </CardContent>
              </Card>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} md={3} lg={3}></Grid>
      </Grid>  
  );
};

export default Auth;
/* <div className="auth">
      <div className="card"> 
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="inputWrapper">
            <input ref={register} name="username" placeholder="Username" />
            {errors && errors.username && (
              <p className="error">{errors.username.message}</p>
            )}
          </div>
          <div className="inputWrapper">
            <input
              ref={register}
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors && errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          {!isLogin && (
            <div className="inputWrapper">
              <input
                ref={register}
                name="email"
                placeholder="Email (optional)"
              />
              {errors && errors.email && (
                <p className="error">{errors.email.message}</p>
              )}
            </div>
          )}
          <div className="inputWrapper">
            <button type="submit" disabled={loading}>
              {isLogin ? 'Login' : 'Create account'}
            </button>
          </div>
          <p
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: 'pointer', opacity: 0.7 }}
          >
            {isLogin ? 'No account? Create one' : 'Already have an account?'}
          </p>
        </form>
      </div>  
    </div>
    */