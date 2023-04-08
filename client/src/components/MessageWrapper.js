import { useContext } from 'react'
import MessageScreen from './MessageScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

export default function MessageWrapper() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    console.log("MessageWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (!auth.loggedIn)
        return <SplashScreen />    
    else
        return <MessageScreen />
}