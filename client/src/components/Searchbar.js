import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function Searchbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleSub(event){
        if(event.key == "Enter"){
            var newTerm = document.getElementById('sText').value;
            console.log("NEWTERM : " + newTerm);
            store.startSearch(newTerm);
        }
    }

    return (
        <input id="sText" type="text" onKeyPress={handleSub} />
    )
}

export default Searchbar;