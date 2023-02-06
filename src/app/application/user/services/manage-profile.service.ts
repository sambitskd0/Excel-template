import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class ManageProfileService {
	private apiURL = environment.profileAPI;
	private userProfile = JSON.parse(
		sessionStorage.getItem("userProfile") || "{}"
	);

	private refreshRequired = new Subject<void>();
	get RefreshRequired() {
		return this.refreshRequired;
	}
	httpOptions = {
		headers: new HttpHeaders({
			"Content-Type": "application/json",
		}),
	};

	constructor(private httpClient: HttpClient) {}

	getUserProfile() {
		let userProfile: any = sessionStorage.getItem("userProfile");
		userProfile = JSON.parse(userProfile);
		return userProfile;
	  }

	getDesignation(levelId: any) {
		return this.httpClient.get(
			this.apiURL + "/getDesignation/" + levelId,
			this.httpOptions
		);
	}

	/**View Profile as per filter, By: Ayasakanta Swain, On: 01-Jun-2022, Component Name : ViewProfileComponent **/
	viewProfile(post: any): Observable<any> {
		post.intLevelId = this.getUserProfile()?.userLevel > 0 && this.getUserProfile()?.userLevel == 3 ? this.getUserProfile()?.userLevel - 1 : 0;

		return this.httpClient
			.post(
				this.apiURL + "/viewProfile",
				JSON.stringify(post),
				this.httpOptions
			)
			.pipe(catchError(this.errorHandler));
	}

	/**View Designation as per filter, By: Ayasakanta Swain, On: 06-Sep-2022, Component Name : ViewProfileComponent **/
	viewDesignation(post: any): Observable<any> {
		return this.httpClient
			.post(
				this.apiURL + "/viewDesignation",
				JSON.stringify(post),
				this.httpOptions
			)
			.pipe(catchError(this.errorHandler));
	}

	/**View Profile as per id, By: Ayasakanta Swain, On: 01-Jun-2022, Component Name : ViewProfileComponent **/
	getProfile(encId: string) {
		return this.httpClient
			.post(
				this.apiURL + "/getProfile",
				JSON.stringify({ encId: encId }),
				this.httpOptions
			)
			.pipe(catchError(this.errorHandler));
	}

	/**Add Profile, By: Ayasakanta Swain, On: 02-Jun-2022, Component Name : AddProfileComponent **/
	createProfile(post: any): Observable<any> {
		post.userId = this.getUserProfile()?.userId;
		return this.httpClient.post(
			this.apiURL + "/addProfile",
			JSON.stringify(post),
			this.httpOptions
		);
	}

	/**Update Profile, By: Ayasakanta Swain, On: 02-Jun-2022, Component Name : EditProfileComponent **/
	updateProfile(post: any): Observable<any> {
		post.userId = this.getUserProfile()?.userId;
		return this.httpClient.post(
			this.apiURL + "/updateProfile",
			JSON.stringify(post),
			this.httpOptions
		);
	}

	/**Delete Profile, By: Ayasakanta Swain, On: 02-Jun-2022, Component Name : ViewProfileComponent **/

	deleteProfile(encId: any) {
		return this.httpClient
			.post(
				this.apiURL + "/deleteProfile",
				JSON.stringify({ encId: encId, userId: this.getUserProfile()?.userId }),
				this.httpOptions
			)
			.pipe(
				tap(() => {
					this.RefreshRequired.next();
				})
			);
	}

	/**Change User status, By: Ayasakanta Swain, On: 21-Sep-2022, Component Name : ViewProfileComponent **/
	updateStatus(post: any): Observable<any> {
		post.userId = this.getUserProfile()?.userId;
		return this.httpClient.post(
			this.apiURL + "/updateStatus",
			JSON.stringify(post),
			this.httpOptions
		);
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
