import { useContext, useState } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GlobalStoreContext } from '../store'
import ErrorModal from './ErrorModal';
import LoginScreen from './LoginScreen';

export default function ForgotScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [askEmail, setAskEmail] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [email, setEmail] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.registerUser(
            formData.get('email'),
            store
        );
    };

    const handleCodeSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let password = formData.get('newPass');
        let password2 = formData.get('rePass');
        if (password !== password2) {
            setPasswordsMatch(false);
            return;
        }
        await auth.verifyCode(
            email,
            formData.get('code'),
            formData.get('newPass'),
            store
        );
        // take user to login screen component
        setUpdatedPassword(true);

    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await auth.requestRecovery(
            formData.get('email'),
            store
        );
        setEmail(formData.get('email'));
        setAskEmail(false);

    };
    
    if (updatedPassword) {
        return (
            <LoginScreen></LoginScreen>
        )
    }

    if (askEmail) {
        return (
            <Container component="main" maxWidth="xs">
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
                    <Typography component="h1" variant="h5">
                    Enter your email to reset your password
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleEmailSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Continue
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    }
    if(!passwordsMatch){
        return (
            <Container component="main" maxWidth="xs">
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
                    <Typography component="h1" variant="h5">
                    Passwords do not match. Try again.
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleCodeSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="code"
                                    label="Verification Code"
                                    name="code"
                                    autoComplete="code"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="newPass"
                                    label="New Password"
                                    type="password"
                                    id="newPass"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="rePass"
                                    label="Re-enter Password"
                                    type="password"
                                    id="rePass"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Continue
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
            <Container component="main" maxWidth="xs">
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
                    <Typography component="h1" variant="h5">
                    We sent a verification code to your email. Enter the code, a new password, and re-enter the password to continue.
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleCodeSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="code"
                                    label="Verification Code"
                                    name="code"
                                    autoComplete="code"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="newPass"
                                    label="New Password"
                                    name="newPass"
                                    autoComplete="newPass"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="rePass"
                                    label="Re-enter Password"
                                    name="rePass"
                                    autoComplete="rePass"
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Continue
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
    );
}