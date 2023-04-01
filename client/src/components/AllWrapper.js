import { useContext } from 'react'
import AllScreen from './AllScreen'
//import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function AllWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("AllWrapper auth.loggedIn: " + auth.loggedIn);
    
    return <AllScreen /> //no login needed
}