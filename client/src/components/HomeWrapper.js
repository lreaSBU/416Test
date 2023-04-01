import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (!auth.loggedIn && store.currentView < 2)
        return <SplashScreen />    
    else
        return <HomeScreen />
}