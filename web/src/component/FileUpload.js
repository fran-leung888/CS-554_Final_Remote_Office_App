import React, { useRef } from 'react';
import axios from 'axios';

function FileInput(props) {
    return <input type="file" ref={props.inputRef} />;
}

function UploadButton(props) {
    return <button onClick={props.onClick}>Upload</button>;
}

function FileUpload() {
    // Create a ref object for the file input
    const fileInput = useRef();

    // File upload handling function
    function handleUpload() {
        // Get the file selected by the user
        const file = fileInput.current.files[0];
        // Create a form data object
        const formData = new FormData();
        // Add the file to the form data
        formData.append('file', file);
        // Send the form data to the server using axios
        axios.post('/upload', formData);
    }

    return (
        <div>
            <FileInput inputRef={fileInput} />
            <UploadButton onClick={handleUpload} />
        </div>
    );
}

export default FileUpload;
