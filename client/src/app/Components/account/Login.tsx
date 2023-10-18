import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Paper, Toolbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../../constants/BackButton';
import Menu from "../../../layout/Menu";
import { FieldValues, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../store/ConfigureStore';
import { signInUser } from '../../../slices/accountSlice';
import { toast } from 'react-toastify';


const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
    const {register, handleSubmit, formState:{isSubmitting, errors,isValid}} = useForm({
      mode:'onTouched'
    })

     async function submitForm(data: FieldValues){
      debugger;
       await dispatch(signInUser(data));
       toast.error("Unautorize");
       navigate('/');
      debugger;
    }

  return (
   <>
    <div>
   <AppBar position="static" sx={{ backgroundColor: 'lightblue', mb:4}}>
            <Toolbar>
                <BackButton/>
                <Box sx = {{flex:1, display:'flex', justifyContent: 'center'}}>
                     {/* <Typography variant="h4"></Typography> */}
                </Box>
                {/* <Menu/> */}
            </Toolbar>
        </AppBar>
   </div>
    <ThemeProvider theme={defaultTheme}>
      <Container component={Paper} maxWidth="sm" sx={{display:'flex', flexDirection:'column', alignItems:'center', p:4 }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              autoFocus
              {...register('username', {required:"Username is required"})}
              error={!!errors.username}
              helperText={errors?.username?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register('password', {required:"Password is required"})}
              error={!!errors.password}
              helperText={errors?.password?.message as string}
            />
            <Button
            disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 ,color: "white", backgroundColor: "lightblue",}}
              
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/registerPage">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
    </ThemeProvider>
   </>
  );
}