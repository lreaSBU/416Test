import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event){
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }/*else{
            store.shiftSongIndex(index, song);
        }*/
    }
    let delButt = '';
    if(auth.loggedIn && !store.currentList.published){
        delButt = <input
            type="button"
            id={"remove-song-" + index}
            className="list-card-button"
            value={"\u2715"}
            onClick={handleRemoveSong}
        />
    }
    let cardClass = "list-card unselected-list-card";
    let highClass = "list-card selected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={(index == store.currentSongIndex ? highClass : cardClass)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            {delButt}
        </div>
    );
}

export default SongCard;