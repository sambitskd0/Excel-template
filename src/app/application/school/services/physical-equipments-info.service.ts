import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PhysicalEquipmentsInfoService {
  private apiURL = environment.schoolAPI;
  private refreshRequired = new Subject<void>(); 
  get RefreshRequired() {
    return this.refreshRequired;
  }
  constructor(private httpClient : HttpClient) { }
  physicalEquipmentInfoUpdate(post:any): Observable <any> {
    return this.httpClient.post(
      this.apiURL + '/updatePhysicalEquipmentInfo',
      JSON.stringify(post)
    )
  }
  getPhysicalEquipmentInfo(encId:string,academicYear:any){
    return this.httpClient
      .post(
        this.apiURL + '/getPhysicalEquipmentInfo',
        JSON.stringify({encId:encId,academicYear:academicYear})
      )
  }
}
 