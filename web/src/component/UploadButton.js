import IconButton from '@mui/material/IconButton';
import AttachFile from '@mui/icons-material/AttachFile';
import { createRef } from 'react';
import { uploadFile } from '../data/file';
import chats from '../data/chats';
import { useSelector } from 'react-redux';

export function UploadButton({ chatId }) {
    const uploadInputRef = createRef();
    const currentUser = useSelector((state) => state.user);

    async function handleUpload(event) {
        console.log("selected file", event.target.files);
        const file = event.target.files[0];
        event.target.value = "";
        const {data} = await uploadFile({ file, receiver: chatId });

        // send file message
        const randomId = Math.random();

        const messageResult = await chats.sendMessage(chatId, JSON.stringify(data), currentUser, 3);
        console.debug(messageResult);
    }

    return (
        <IconButton color="primary" aria-label="upload file" component="label">
            <input hidden type="file" ref={uploadInputRef} onChange={handleUpload} />
            <AttachFile />
        </IconButton>
    );
}