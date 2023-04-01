import { useContext } from 'react'
import UserScreen from './UserScreen'
//import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function UserWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("UserWrapper auth.loggedIn: " + auth.loggedIn);
    
    return <UserScreen /> //no login needed
}