import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolMediumOfInstructionService {

  private mediumOfInstructionURL = environment.schoolAPI;
  constructor(private httpClient:HttpClient) { }
  getmediumOfInstruction(schoolId:any):Observable<any>{
    return this.httpClient.post(this.mediumOfInstructionURL+'/getMediumOfInstruction',JSON.stringify({schoolId:schoolId}))
    ;
  }
}
