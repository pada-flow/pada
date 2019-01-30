// import * as axios from 'axios'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
import { Http } from './http'

import TicketManager from '../ticketManager'
const ticketManager = new TicketManager()
const http = new Http()

/**
 * Ticket get
 *
 * @returns
 */
function ticket(argv: AxiosRequestConfig) {
  const ticket = ticketManager.read()
  return http
    .get('http://localhost:31544/api/auth/ticket', { params: { ticket }})
}

/**
 * Login status check
 *
 * @returns
 */
function status(argv: any) {
  const ticket = ticketManager.read()
  return http
    .post('http://localhost:31544/api/auth/status', { ticket })
}

/**
 * List all tasks
 *
 */
function list(argv: AxiosRequestConfig) {
  const ticket = ticketManager.read()
  const headers = {'pada-ticket': ticket}
  return http
    .get('http://localhost:31544/api/task/list', {...argv, headers })
}

function logout(argv: any) {
  return http
    .post('http://localhost:31544/api/auth/logout')
}

interface PadaService {
  ticket: (cogfig?: AxiosRequestConfig) => AxiosPromise,
  status: (data?: any) => AxiosPromise,
  list: (config?: AxiosRequestConfig) => AxiosPromise,
  logout: (data?: any) => AxiosPromise
}

const PadaService: PadaService = {
  ticket,
  status,
  list,
  logout,
}

export default PadaService