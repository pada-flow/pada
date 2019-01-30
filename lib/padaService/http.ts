import * as axios from 'axios'

export class Http {
  constructor() {
    // default request setting
    axios.default.interceptors.request.use(
      this.requestInterceptor
    )

    // default response setting
    axios.default.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor,
    )
  }

  public delete(uri: string, config?: axios.AxiosRequestConfig) {
    return axios.default.delete(uri, config)
  }

  public get(uri: string, config?: axios.AxiosRequestConfig) {
    return axios.default.get(uri, config)
  }

  public post(uri: string, body?: any, config?: axios.AxiosRequestConfig) {
    return axios.default.post(uri, body, config)
  }

  public put(uri: string, body?: any, config?: axios.AxiosRequestConfig) {
    return axios.default.put(uri, body, config)
  }

  // 拦截者
  requestInterceptor(config) {
    return config
  }

  // 拦截者
  successInterceptor(response) {
    return response
  }

  // 拦截者
  errorInterceptor(error) {
    if (error.response) {
      const { data } = error.response
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(data.message)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    process.exit(0)
  }
}