import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankDetailsService {

  private committeeURL = environment.committeeAPI;
  constructor(private httpClient:HttpClient) { }

  getBankName():Observable<any>{
    const allData="";
    return this.httpClient.post(this.committeeURL+'/getBankDetails',JSON.stringify(allData))
    ;
  }
}
