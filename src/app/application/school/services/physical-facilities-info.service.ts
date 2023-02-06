import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PhysicalFacilitiesInfoService {
  private apiURL = environment.schoolAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  } 

 
  constructor(  private httpClient : HttpClient) { }

  physicalFacilitiesInfoUpdate(post:any): Observable <any> {
    return this.httpClient.post(
      this.apiURL + '/updatePhysicalFacilitiesInfo',
      JSON.stringify(post)
    )
  }
  getPhysicalFacilitiesInfo(encId:string,academicYear:any){
    return this.httpClient
      .post(
        this.apiURL + '/getPhysicalFacilitiesInfo',
        JSON.stringify({encId:encId,academicYear:academicYear})
      )
     
  }
 
}
 