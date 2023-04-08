import { useContext } from 'react'
import BrowseScreen from './BrowseScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (!auth.loggedIn)
        return <SplashScreen />    
    else
        return <BrowseScreen />
}