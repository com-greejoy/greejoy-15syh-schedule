import axios from 'axios';

export function request(config) {

  const baseURL = config.baseURL || process.env.VUE_APP_BASE_API;

  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000
  });

  //request
  instance.interceptors.request.use((config) => {
    return config;
  }, (err) => {
    console.log(err);
  });

  //response
  instance.interceptors.response.use((res) => {
    return res.data;
  }, (err) => {
    console.log(err);
  });

  return instance(config);
}
