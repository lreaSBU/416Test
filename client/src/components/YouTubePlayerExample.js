// import React from 'react';
// import { useContext } from 'react';
// import YouTube from 'react-youtube';
// import { GlobalStoreContext } from '../store'

// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import FastForwardIcon from '@mui/icons-material/FastForward';
// import FastRewindIcon from '@mui/icons-material/FastRewind';
// import Fab from '@mui/material/Fab'

// export default function YouTubePlayerExample() {
//     const { store } = useContext(GlobalStoreContext);
//     // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
//     // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
//     // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
//     // FROM ONE SONG TO THE NEXT

//     // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
//     let playRef = null;
//     let playlist = store.currentList != null ? store.currentList.songs : [];

//     // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
//     let currentSong = store.currentSongIndex;
//     if(currentSong == -1) currentSong = 0;

//     const playerOptions = {
//         height: '390',
//         width: '95%',
//         playerVars: {
//             // https://developers.google.com/youtube/player_parameters
//             autoplay: 0,
//         },
//     };

//     // THIS FUNCTION LOADS THE CURRENT SONG INTO
//     // THE PLAYER AND PLAYS IT
//     function loadAndPlayCurrentSong(player) {
//         let song = playlist[currentSong];
//         if(song == undefined) return; //playlist is empty
//         //if(!song || song.youTubeId == undefined) song = store.currentSong.youTubeId;
//         song = song.youTubeId;
//         console.log("TRYING TO PLAY: " + song);
//         //console.log("and song = " + JSON.stringify(song));
//         player.loadVideoById(song);
//         player.playVideo();
//     }

//     // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
//     function incSong() {
//         currentSong++;
//         currentSong = currentSong % playlist.length;
//         //store.switchTab(1);
//         //store.switchTab(0);
//         //store.shiftSongIndex(currentSong, playlist[currentSong]);
//     }
//     function decSong(){
//         currentSong--;
//         currentSong = currentSong % playlist.length;
//         //store.shiftSongIndex(currentSong, playlist[currentSong]);
//     }

//     function onPlayerReady(event) {
//         playRef = event.target;
//         console.log("vnduiobhcuwishnvcdishnjvodsahnjvlsxbJKvxlbaxshjvl: " + store.currentSongIndex);
//         loadAndPlayCurrentSong(event.target);
//         event.target.playVideo();
//     }

//     function handlePlay(e){
//         if(playRef == null){
//             console.log("PLAYREF NULL!!");
//             return;
//         }
//         playRef.playVideo();
//     }
//     function handlePause(e){
//         if(playRef == null){
//             console.log("PLAYREF NULL!!");
//             return;
//         }
//         playRef.pauseVideo();
//     }
//     function handleNext(e){
//         if(playRef == null){
//             console.log("PLAYREF NULL!!");
//             return;
//         }
//         incSong();
//         loadAndPlayCurrentSong(playRef);
//     }
//     function handlePrev(e){
//         if(playRef == null){
//             console.log("PLAYREF NULL!!");
//             return;
//         }
//         decSong();
//         loadAndPlayCurrentSong(playRef);
//     }

//     // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
//     // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
//     // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
//     // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
//     function onPlayerStateChange(event) {
//         let playerStatus = event.data;
//         let player = event.target;
//         if (playerStatus === -1) {
//             // VIDEO UNSTARTED
//             console.log("-1 Video unstarted");
//         } else if (playerStatus === 0) {
//             // THE VIDEO HAS COMPLETED PLAYING
//             console.log("0 Video ended");
//             incSong();
//             loadAndPlayCurrentSong(player);
//         } else if (playerStatus === 1) {
//             // THE VIDEO IS PLAYED
//             console.log("1 Video played");
//         } else if (playerStatus === 2) {
//             // THE VIDEO IS PAUSED
//             console.log("2 Video paused");
//         } else if (playerStatus === 3) {
//             // THE VIDEO IS BUFFERING
//             console.log("3 Video buffering");
//         } else if (playerStatus === 5) {
//             // THE VIDEO HAS BEEN CUED
//             console.log("5 Video cued");
//             //incSong();
//         }
//     }
//     //ADD IN THE BUTTONS FOR PLAY, PAUSE, NEXT, AND PREVIOUS HERE IN A DIV WRAPPER!!!:
//     return <div>
//         {(playlist.length == 0 ? 'No songs to play!' : <YouTube
//             videoId={playlist[currentSong]}
//             opts={playerOptions}
//             onReady={onPlayerReady}
//             onStateChange={onPlayerStateChange} />)}
//         <Box>
//             <Fab sx={{mx : '5%'}}>
//                 <IconButton size="large" color="inherit" onClick={handlePrev}><FastRewindIcon /></IconButton>
//             </Fab>
//             <Fab sx={{mx : '5%'}}>
//                 <IconButton size="large" color="inherit" onClick={handlePlay}><PlayArrowIcon /></IconButton>
//             </Fab>
//             <Fab sx={{mx : '5%'}}>
//                 <IconButton size="large" color="inherit" onClick={handlePause}><PauseIcon /></IconButton>
//             </Fab>
//             <Fab sx={{mx : '5%'}}>
//                 <IconButton size="large" color="inherit" onClick={handleNext}><FastForwardIcon /></IconButton>
//             </Fab>
//         </Box>
//     </div>;
// }