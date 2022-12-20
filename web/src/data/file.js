import axios from "axios";
import fileDownload from "js-file-download";

export async function uploadFile({ file, receiver, duration }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("receiver", receiver);
  formData.append("duration", duration);
  return await axios.post("/file", formData);
}

export async function downloadFile({ fileId, filename }) {
  const { data } = await axios.get(`/file/${fileId}`, { responseType: "blob" });
  console.debug(data);
  fileDownload(data, filename);
}

export async function getFileObjectUrl(fileId, size) {
  let sizeStr = size ? "?size=" + size : "";
  let url = "http://localhost:4000/file/" + fileId + sizeStr;
  console.log("url is", url);
  return url;
}
