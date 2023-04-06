import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    HomeScreen,
    AppBanner,
    WelcomeScreen,
    BrowseWrapper,
    EditScreen,
    ProfileScreen,
    ChatScreen,
    BrowseMapScreen
} from './components'
/*
    Application's top-level component.
*/
const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={HomeScreen} />
                        <Route path="/welcome/" exact component={WelcomeScreen} />
                        <Route path="/browse/" exact component={BrowseWrapper} />
                        <Route path="/browse/:mapid" exact component={BrowseMapScreen} />
                        <Route path="/profile/edit/:mapid" exact component={EditScreen} />
                        <Route path="/profile/:profileid" exact component={ProfileScreen} />
                        <Route path="/profile/chat/:profileid" exact component={ChatScreen} />
                    </Switch>

                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App
