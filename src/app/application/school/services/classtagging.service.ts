import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClasstaggingService {
constructor(private httpClient:HttpClient) { }
private apiURL = environment.schoolAPI;
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent || Description: View of all SchoolCategory with search filter  */
  viewClassTagging(post:any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewClassTagging', JSON.stringify(post))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : EditCategoryComponent || Description: get  Data for edit SchoolCategory */
  getClassTagging(id:number){
      return this.httpClient.get(this.apiURL + '/getClassTagging/'+ id)
    }
    /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 26-05-2022 || Component Name : EditCategoryComponent || Description: Updata SchoolCategory data  */
    updateClassTagging(post:any){
    return this.httpClient.post(this.apiURL + '/updateClassTagging', JSON.stringify(post))
    
  }
    

}
