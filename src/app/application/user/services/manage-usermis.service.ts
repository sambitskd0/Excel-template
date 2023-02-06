import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ManageUsermisService {
  private userProfile = JSON.parse(
		sessionStorage.getItem("userProfile") || "{}"
	);
	private userId = this.userProfile.userId;
	private apiURL = environment.profileAPI;
	private apiMasterURL = environment.masterAPI;
	private intLevelId = this.userProfile.userLevel;
	private refreshRequired = new Subject<void>();
	get RefreshRequired() {
		return this.refreshRequired;
	}
	httpOptions = {
		headers: new HttpHeaders({
			"Content-Type": "application/json",
		}),
	};

  constructor(private httpClient: HttpClient) { }
  getMultiUserAndOfficer(typeOfUser: any,levelOfUser:any) {
		return this.httpClient
			.post(
				this.apiURL + "/getMultiUserAndOfficer",
				JSON.stringify({ typeOfUser: typeOfUser,levelOfUser:levelOfUser }),
				this.httpOptions
			)
	}
  viewMultiUserAndOfficerList(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewMultiUserAndOfficerList',
     JSON.stringify(post),
     this.httpOptions
   )
}

}
