import { HealthCheckDto } from "@/model/HealthCheckDto";
import axios from "axios";
import { PostOptions } from "./HttpServiceCommon";

const DEFAULT_API_BASE_URL = '/api/1.0';

export class RestServiceImpl {

  apiBaseUrl: string;

  constructor(apiBaseUrl: string = DEFAULT_API_BASE_URL){
    this.apiBaseUrl = apiBaseUrl;
  }

  async get_version(): Promise<HealthCheckDto>{
    return await axios.get(`${this.apiBaseUrl}/version`).then(res=>res.data);
  }

  async get_time(): Promise<any>{
    return await axios.get(`${this.apiBaseUrl}/time`).then(res=>res.data);
  }

}

export function RestService(): RestServiceImpl {
  return new RestServiceImpl();
}
