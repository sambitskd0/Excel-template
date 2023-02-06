import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  Observable, Subject, tap } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ManageExpenditureTypeService {
  private apiURL = environment.grantAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  constructor(private httpClient: HttpClient) { }

  addExpenditureType(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + "/addExpenditureType",JSON.stringify(post));
  }
  viewExpenditureType(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + "/viewExpenditureType", JSON.stringify(post));
  }
  getExpenditureType(id: number): Observable<any> {
    const allData = { id: id };
    return this.httpClient.post(this.apiURL + "/getExpenditureType",JSON.stringify(allData));
  }
  updateExpenditureType(post: any) {
    return this.httpClient.post(this.apiURL + "/updateExpenditureType",JSON.stringify(post));
  }

  deleteExpenditureType(id: number, userId: any, profileId:any) {
    console.log(id);
    return this.httpClient.post(this.apiURL + "/deleteExpenditureType",JSON.stringify({ encId: id, userId: userId, profileId: profileId }))
      .pipe(
        tap(() => {
          this.RefreshRequired.next();
        })
      );
  }
}
