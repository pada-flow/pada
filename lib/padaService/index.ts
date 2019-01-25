import axios from 'axios'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

/**
 * Ticket get
 *
 * @returns
 */
function ticket(argv: AxiosRequestConfig) {
  return axios
    .get('http://localhost:31544/api/auth/ticket', argv)
}

/**
 * Login status check
 *
 * @returns
 */
function status(argv: any) {
  return axios
    .post('http://localhost:31544/api/auth/status', argv)
}

interface PadaService {
  ticket: (cogfig?: AxiosRequestConfig) => AxiosPromise,
  status: (data?: any) => AxiosPromise,
}

const PadaService: PadaService = {
  ticket,
  status,
}

export default PadaService