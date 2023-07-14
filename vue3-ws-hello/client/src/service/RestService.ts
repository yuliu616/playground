import { type HealthCheckDto } from "@/model/HealthCheckDto";
import axios from "axios";
import { type PostOptions } from "./HttpServiceCommon";

const REST_API_BASE_URL = '/api/1.0';
// const REST_API_BASE_URL = 'http://localhost:8888/api/1.0';

export class RestServiceImpl {

  apiBaseUrl: string;

  constructor(apiBaseUrl: string = REST_API_BASE_URL){
    this.apiBaseUrl = apiBaseUrl;
  }

  async get_version(): Promise<HealthCheckDto>{
    return await axios.get(`${this.apiBaseUrl}/version`).then(res=>res.data);
  }

  async get_time(): Promise<any>{
    return await axios.get(`${this.apiBaseUrl}/time`).then(res=>res.data);
  }

  async post_luckyDraw_join(options: PostOptions<post_luckyDraw_join_params>): Promise<any> {
    return await axios.post(`${this.apiBaseUrl}/luckyDraw/join`, options.body).then(res=>res.data);
  }

  async put_luckyDraw_start(): Promise<any> {
    return await axios.put(`${this.apiBaseUrl}/luckyDraw/start`, {}).then(res=>res.data);
  }

  async put_luckyDraw_stop(): Promise<any> {
    return await axios.put(`${this.apiBaseUrl}/luckyDraw/stop`, {}).then(res=>res.data);
  }

}

export function RestService(): RestServiceImpl {
  return new RestServiceImpl();
}

interface post_luckyDraw_join_params {
  clientId: number;
  name: string;
  guess: number;
  contribution: number;
}
