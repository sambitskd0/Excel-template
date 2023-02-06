import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassWiseTeacherTaggedService {
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };
  getSchoolWiseClasses(schoolId:string){
    return this.httpClient.post(this.schoolAPI + '/getSchoolClasses',JSON.stringify({encId : schoolId}));
  }
  getTeacherList(schoolId:string){
    return this.httpClient.post(this.teacherAPI + '/getTeacherLists',JSON.stringify({schoolId : schoolId}));
  }
  addClassTeacherTagged(post:any){
    return this.httpClient.post(this.teacherAPI + '/addClassTeacherTagged',JSON.stringify(post));
  }
  viewClassTeacherTagged(post: any): Observable<any> {
    return this.httpClient.post(this.teacherAPI + '/viewClassTeacherTagged',JSON.stringify(post));
  }
  deleteClassTeacherTagged(id: number,userId:any): Observable<any> {
    return this.httpClient.post(this.teacherAPI + '/deleteClassTeacherTagged',JSON.stringify({'encId':id, 'userId':userId}));
  }

  getTeacherTaggedById(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(this.teacherAPI + '/getTeacherTaggedById',JSON.stringify(allData));
  }
  updateClassTeacherTagged(post: any) {
    return this.httpClient.post(this.teacherAPI + '/updateClassTeacherTagged',JSON.stringify(post)) ; 
  }
}
