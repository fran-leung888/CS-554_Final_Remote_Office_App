import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:3000'
});

instance.interceptors.request.use(config=> {
    return config;
  }, err=> {
    return Promise.resolve(err);
  })
  instance.interceptors.response.use(data=> {

    return data.data;
  }, err=> {
    return Promise.resolve(err.response.data);
  })

export default instance;