import axios from "axios";
import fileDownload from "js-file-download";

export async function uploadFile({
    file,
    receiver
}) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiver", receiver);
    return await axios.post("/file", formData);
}

export async function downloadFile({ fileId, filename }) {
    const { data } = await axios.get(`/file/${fileId}`, { responseType: "blob" });
    console.debug(data);
    fileDownload(data, filename);
}

export async function getFileObjectUrl(fileId) {
    const { data } = await axios.get(`/file/${fileId}`, { responseType: "blob" });
    return URL.createObjectURL(data);
  }