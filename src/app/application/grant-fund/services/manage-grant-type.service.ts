import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, Subject, throwError, tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ManageGrantTypeService {
  private apiURL = environment.grantAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  constructor(private httpClient: HttpClient) { }
  viewGrantType(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + "/viewGrantType", JSON.stringify(post));
  }
  deleteGrantType(id: number, userId: any, profileId:any) {
    console.log(id);
    return this.httpClient.post(this.apiURL + "/deleteGrantType", JSON.stringify({ encId: id, userId: userId, profileId: profileId }))
      .pipe(
        tap(() => {
          this.RefreshRequired.next();
        })
      );
  }
  addGrantTypeData(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + "/addGrantType", JSON.stringify(post));
  }
  getGrantTypeData(id: number): Observable<any> {
    const allData = { id: id };
    return this.httpClient.post(this.apiURL + "/getGrantType", JSON.stringify(allData));
  }
  updateGrantTypeData(post: any) {
    return this.httpClient.post(this.apiURL + "/updateGrantType", JSON.stringify(post));
  }

}
