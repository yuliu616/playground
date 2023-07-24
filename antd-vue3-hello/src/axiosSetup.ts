import { type App } from 'vue';
import axios from "axios";
import type { ILogger } from './model/core/ILogger';

const logger: ILogger = console;

export function useAxios(vueApp: App): App {

  axios.defaults.timeout = +import.meta.env.VITE_REST_CALL_TIMEOUT_MS;
  
  return vueApp;
}
