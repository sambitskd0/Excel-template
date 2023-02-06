import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ManageQuestionService {
  private userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  private userId = this.userProfile.userId;
  constructor(private httpClient: HttpClient) {}
  private apiURL = environment.inspectionAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  /**View Question as per filter, By: Ayasakanta Swain, On: 20-Jul-2022, Component Name : ViewQuestionComponent **/
  viewQuestion(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.apiURL + "/viewQuestion",
        JSON.stringify(post),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  /**Delete Question, By: Ayasakanta Swain, On: 20-Jul-2022, Component Name : ViewQuestionComponent **/
  deleteQuestion(encId: any) {
    return this.httpClient
      .post(
        this.apiURL + "/deleteQuestion",
        JSON.stringify({ encId: encId, userId: this.userId }),
        this.httpOptions
      )
      .pipe(
        tap(() => {
          this.RefreshRequired.next();
        })
      );
  }

  /**Add Question, By: Ayasakanta Swain, On: 20-Jul-2022, Component Name : AddQuestionComponent **/
  addQuestion(post: any): Observable<any> {
    post.userId = this.userId;
    return this.httpClient.post(
      this.apiURL + "/addQuestion",
      JSON.stringify(post),
      this.httpOptions
    );
  }

  /**Update Question, By: Ayasakanta Swain, On: 20-Jul-2022, Component Name : EditQuestionComponent **/
  updateQuestion(post: any): Observable<any> {
    post.userId = this.userId;
    return this.httpClient.post(
      this.apiURL + "/updateQuestion",
      JSON.stringify(post),
      this.httpOptions
    );
  }

  /**View Question as per id, By: Ayasakanta Swain, On: 20-Jul-2022, Component Name : EditQuestionComponent **/
  readQuestion(encId: string) {
    return this.httpClient
      .post(
        this.apiURL + "/readQuestion",
        JSON.stringify({ encId: encId }),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getSchoolCategory(){
    return this.httpClient.post(this.apiURL + '/getSchoolCategory', this.httpOptions)
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
}
