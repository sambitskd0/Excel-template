import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolCategoryService {
  private apiURL = environment.schoolAPI; 
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  constructor(private httpClient: HttpClient) { }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent || Description: View of Category name filter  */
  getCategoryName(): Observable<any> {
    let encId = "";
    return this.httpClient.post(this.apiURL + '/getCategoryName', JSON.stringify({ encId: encId }))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent || Description: View of all SchoolCategory with search filter  */
  viewSchoolCategory(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewSchoolCategory', JSON.stringify(post))
  }
  deleteSchoolCategory(id: number, userId: any,profileId:any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/deleteSchoolCategory', JSON.stringify({ 'encId': id, 'userId': userId,'profileId':profileId }))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : AddCategoryComponent || Description: add SchoolCategory  */
  addSchoolCategory(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addSchoolCategory', JSON.stringify(post))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : EditCategoryComponent || Description: get  Data for edit SchoolCategory */
  getSchoolCategory(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(
      this.apiURL + '/getSchoolCategory', JSON.stringify(allData))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 26-05-2022 || Component Name : EditCategoryComponent || Description: Updata SchoolCategory data  */
  updateSchoolCategory(post: any) {
    return this.httpClient.post(this.apiURL + '/updateSchoolCategory', JSON.stringify(post))
  }
}
