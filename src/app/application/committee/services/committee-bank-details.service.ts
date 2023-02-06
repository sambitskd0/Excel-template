import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommitteeBankDetailsService {

  private committeeURL = environment.committeeAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient:HttpClient) { }

  getBankName(){
    const allData="";
    return this.httpClient.post(this.committeeURL+'/getBankDetails',JSON.stringify(allData))
    ;
  }
  addBankDetails(post:any,userId:any,schoolId:any,academicYear:any,profileId:any){
    const allData = { post, userId,schoolId,academicYear,profileId};
    return this.httpClient.post(this.committeeURL+'/addCommitteeBankDetails', JSON.stringify(allData));
 }

 viewCommitteeBankDetails(post:any){
    return this.httpClient.post(this.committeeURL+'/viewCommitteeBankDetails', JSON.stringify(post));
  }

  getBankingDetails(post:any){
    return this.httpClient.post(this.committeeURL+'/getCommitteeBankDetails', JSON.stringify({'id':post}));
  }
  updateBankDetails(post:any,userId:any,schoolId:any,profileId:any){
    const allData = { post, userId,schoolId,profileId};
    return this.httpClient.post(this.committeeURL+'/updateCommitteeBankDetails', JSON.stringify(allData));
  }
}
