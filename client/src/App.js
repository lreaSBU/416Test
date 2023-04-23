import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    HomeScreen,
    HelpScreen,
    AppBanner,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    ForgotScreen,
    Statusbar,
    UserWrapper,
    MessageScreen,
    BrowseScreen,
    MessageWrapper,
    EditScreen
} from './components'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// --swatch - foundation: #ffffff;
// --swatch - primary: #5EB120;
// --swatch - complement: #D9D9D9;
// --swatch - contrast: #000000;
// --swatch - accent: #569F1D;
// --swatch - status: #FF0000;
const customTheme = createTheme({
    palette: {
        primary: {
            main: '#5EB120',
            accent: '#569F1D',
            complement: '#D9D9D9',
            status: '#FF0000',
        }
    }
})
/*
    Application's top-level component.
*/
const App = () => {
    return (
        <ThemeProvider theme={customTheme}>
            <BrowserRouter>
                <AuthContextProvider>
                    <GlobalStoreContextProvider>
                        <AppBanner />
                        <Switch>
                            <Route path="/" exact component={HomeWrapper} />
                            <Route path="/message/" exact component={MessageWrapper} />
                            <Route path="/edit/" exact component={EditScreen} />
                            <Route path="/login/" exact component={LoginScreen} />
                            <Route path="/register/" exact component={RegisterScreen} />
                            <Route path="/forgot/" exact component={ForgotScreen} />
                            <Route path="/help/" exact component={HelpScreen} />
                        </Switch>
                    </GlobalStoreContextProvider>
                </AuthContextProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
