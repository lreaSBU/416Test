import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

import Box from '@mui/material/Box';

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { cDat } = props;

    return (
        <div
            className={'comment'}
        >
            <Box sx={{p : 1, fontSize: '16px', color: 'blue'}}>{cDat.name}</Box>
            <Box sx={{p : 1, fontSize: '32px', color: 'black'}}>{cDat.msg}</Box>
        </div>
    );
}

export default CommentCard;