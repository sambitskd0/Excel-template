import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardMisService {
  private schoolApiURL = environment.schoolAPI;
  private teacherApiURL = environment.teacherAPI;
  constructor(private httpClient: HttpClient) { }
  teacherCount(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherApiURL + "/teacherCount",
      JSON.stringify(post)
    );
  }
  appointmentNatureTypeWise(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherApiURL + "/appointmentNatureTypeWise",
      JSON.stringify(post)
    );
  }

  getAppointmentwiseTeachers(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherApiURL + "/getAppointmentwiseTeachers",
      JSON.stringify(post)
    );
  }
  getGraphAppointmentType(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherApiURL + "/getGraphAppointmentType",
      JSON.stringify(post)
    );
  }
  getAppointmentTypeWiseTeachers(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherApiURL + "/getAppointmentTypeWiseTeachers",
      JSON.stringify(post)
    );
  }
}
