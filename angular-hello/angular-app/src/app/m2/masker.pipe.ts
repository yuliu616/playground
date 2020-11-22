import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masker'
})
export class MaskerPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (typeof value === "string") {
      let s = <string>value;
      let output = '';
      for (let i=0;i<s.length;i++){
        if (i==0 || i==s.length-1){
          output += s.substr(i,1);
        } else {
          output += '*';
        }
      }
      return output;
    } else {
      return "ELSE";
    }
  }

}
