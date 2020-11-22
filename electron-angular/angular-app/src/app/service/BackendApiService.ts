export type integer = number;
import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IPeople } from 'src/model/IPeople.model';
import { PromiseUtil } from 'src/util/PromiseUtil';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  // private apiRoot: string;

  constructor(
    // private httpClient: HttpClient,
  ){
    // this.apiRoot = environment.backendApiRoot;
  }

  People = {

    post: async (body: IPeople)=>{
      sendToElectronBackend('ECHO', 'create this People', body);
      return Promise.resolve(body);
      
      // return await PromiseUtil.timedTask(2000, ()=>{
      //   let result: IPeople = {
      //     id: 123,
      //     version: 1,
      //     first_name: body.first_name,
      //     last_name: body.last_name,
      //   };
      //   return result;
      // });
      // return <IPeople> await this.httpClient.post<IPeople>(`${this.apiRoot}/People`, body).toPromise();
    },

  }
}

declare function sendToElectronBackend(channel: string, ...args : any[]);
