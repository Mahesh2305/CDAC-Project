const axios = require("axios").default;

export default class AxiosServices {
  post(url, data, isRequiredHeader = false, header) {
    console.log("Axios Post Request Url : ", url, " Data : ", data);
    return axios.post(url, data, isRequiredHeader && header);
  }

  Get(url, isRequiredHeader = false, header) {
    console.log("Axios Get Request Url : ", url);
    return axios.get(url, isRequiredHeader && header);
  }

  Delete(url, isRequiredHeader = false, header) {
    console.log("Axios Delete Request Url : ", url);
    return axios.delete(url, isRequiredHeader && header);
  }

  Put(url, data, isRequiredHeader = false, header) {
    console.log("Axios Put Request Url : ", url, " Data : ", data);
    return axios.put(url, data, isRequiredHeader && header);
  }

  Patch(url, data, isRequiredHeader = false, header) {
    console.log("Axios Patch Request Url : ", url, " Data : ", data);
    return axios.patch(url, data, isRequiredHeader && header);
  }
}
