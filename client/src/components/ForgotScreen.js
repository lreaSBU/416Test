import { useContext, useState } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ErrorModal from './ErrorModal';
import LoginScreen from './LoginScreen';

export default function ForgotScreen() {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(0);

    const handleCodeSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let password = formData.get('newPass');
        let password2 = formData.get('rePass');
        if (password !== password2) {
            setStep(0); setStep(1); //just force a refresh
            auth.makeError('Passwords do not match!');
            return;
        }
        let resp = await auth.verifyCode(
            email,
            formData.get('code'),
            password,
            password2
        );
        if(resp) setStep(2); //go to login page
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let resp = await auth.requestRecovery(
            formData.get('email')
        );
        if(resp){
            setEmail(formData.get('email'));
            setStep(1);
        }
    };

    return step == 2 ? <LoginScreen />
    : ( <Container component="main" maxWidth="xs">
            <ErrorModal></ErrorModal>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                {step ? 
                    <Typography component="h1" variant="h5">
                        Verification code sent
                    </Typography>
                :
                    <Typography component="h1" variant="h5">
                        Enter email address
                    </Typography>
                }
                <Box component="form" noValidate onSubmit={(e) => {
                    switch(step){
                        case 0: handleEmailSubmit(e); break;
                        case 1: handleCodeSubmit(e); break;
                    }}} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid hidden={!!step} item xs={12}>
                            <TextField
                                sx={{marginTop: 1}}
                                required
                                fullWidth
                                id='email'
                                label="Email Address"
                                name='email'
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid hidden={!step} item xs={12}>
                            <TextField
                                sx={{marginTop: 1}}
                                required
                                fullWidth
                                id="code"
                                label="Verification Code"
                                name="code"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid hidden={!step} item xs={12}>
                            <TextField
                                sx={{marginTop: 1}}
                                hidden={!step}
                                required
                                fullWidth
                                id="newPass"
                                label="New Password"
                                name="newPass"
                                type="password"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid hidden={!step} item xs={12}>
                            <TextField
                                sx={{marginTop: 1}}
                                hidden={!step}
                                required
                                fullWidth
                                id="rePass"
                                label="Re-enter Password"
                                name="rePass"
                                type="password"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 10, mb: 2}}
                    > Continue </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>);
}