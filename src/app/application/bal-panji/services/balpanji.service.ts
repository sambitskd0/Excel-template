import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, Observable, Subject, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BalpanjiService {

  constructor(private httpClient: HttpClient) { }
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;
  private studentAPI = environment.studentAPI;
  private refreshRequired = new Subject<void>();

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };

  get RefreshRequired() {
    return this.refreshRequired;
  }
  errorHandler(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getPanchayat(distId:any, blockId:any) {
    const panType = 2;
    const districtIdData = distId;
    const blockIdData = blockId;
    return this.httpClient.post(
      this.studentAPI + "/getPanchayat",
      JSON.stringify({ districtId : districtIdData ,blockId : blockIdData ,type:panType  }),
      this.httpOptions
    );
  }

  getVillage(distId:any, blockId:any)
  {
    const vilageType = 2;
    const districtIdData = distId;
    const blockIdData = blockId;
    // const panIdData = panId;
    return this.httpClient.post(
      this.studentAPI + "/getVillage",
      JSON.stringify({ districtId : districtIdData ,blockId : blockIdData ,type:vilageType  }),
      this.httpOptions
    );
  }

  getStudentIdAadhar(idAadhar:any)
  {
    return this.httpClient.post(
      this.studentAPI + "/getStudentIdAadhar",
      JSON.stringify({ idAadhar : idAadhar }),
      this.httpOptions
    );
  }

  getReligion()
  {
    const anxtType = 'RELIGION';
    return this.httpClient.post(
      this.studentAPI + "/getAnxtData",
      JSON.stringify({ anxtType : anxtType }),
      this.httpOptions
    );
  }
  getCaste(){
    const anxtType = 'CASTE';
    return this.httpClient.post(
      this.studentAPI + "/getAnxtData",
      JSON.stringify({ anxtType : anxtType }),
      this.httpOptions
    );
  }
  getSocialCategory()
  {
    const anxtType = 'SOCIAL_CATEGORY';
    return this.httpClient.post(
      this.studentAPI + "/getAnxtData",
      JSON.stringify({ anxtType : anxtType }),
      this.httpOptions
    );
  }

  getNominatedSchool(schoolId:any)
  {
    return this.httpClient.post(
      this.studentAPI + "/getNominatedSchool",
     JSON.stringify({ schoolId : schoolId }),
      this.httpOptions
    );
  }

  getEnrollmentBlock(schoolId : any)
  {
    return this.httpClient.post(
      this.studentAPI + "/getEnrollmentBlock",
      JSON.stringify({ schoolId : schoolId }),
      this.httpOptions
    );
  }

  getClass(schoolId : any)
  {
    return this.httpClient.post(
      this.studentAPI + "/getClassBalpanji",
      JSON.stringify({ schoolId : schoolId }),
      this.httpOptions
    );
  }
  
  getDisablity()
  {
    const anxtType = 'DISABILITY';
    return this.httpClient.post(
      this.studentAPI + "/getAnxtData",
      JSON.stringify({ anxtType : anxtType }),
      this.httpOptions
    );
  }

  balpanjiRegistration(data:any): Observable<any>
  {
    return this.httpClient.post(
      this.studentAPI + "/balpanjiRegistration",
      JSON.stringify(data),
      this.httpOptions
    );

  }

  viewBalpanjiApplication(post: any) 
  {
    return this.httpClient
      .post(
        this.studentAPI + "/viewBalpanjiApplication",
        // JSON.stringify(post),
        // this.httpOptions,
        Object.assign( post)
      )
      .pipe(catchError(this.errorHandler));

  }

  deleteBalpanjiApp(e:any)
  {
    return this.httpClient.post(
      this.studentAPI + "/deleteBalpanjiApp",
      JSON.stringify({ id : e }),
      this.httpOptions
    );
  }

  downloadBalpanjiServiceCsv(post:any)
  {
    return this.httpClient
    .post(
      this.studentAPI + "/downloadBalpanjiServiceCsv",
      Object.assign( post)
    )
    .pipe(catchError(this.errorHandler));
  }

  getBalpanjiEditData(id:any)
  {
    return this.httpClient.post(
      this.studentAPI + "/getBalpanjiEditData",
      JSON.stringify({ id : id }),
      this.httpOptions
    );
  }

  balpanjiEditDataRegistration(data : any)
  {
    return this.httpClient.post(
      this.studentAPI + "/balpanjiEditDataRegistration",
      JSON.stringify(data),
      this.httpOptions
    );
  }
  
  getModalBalpanji(e:any)
  {
    return this.httpClient.post(
      this.studentAPI + "/getModalBalpanji",
      JSON.stringify({ id : e }),
      this.httpOptions
    );
  }
}
