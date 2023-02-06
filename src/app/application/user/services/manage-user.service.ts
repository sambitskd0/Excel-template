import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class ManageUserService {
	private userProfile = JSON.parse(
		sessionStorage.getItem("userProfile") || "{}"
	);
	private apiURL = environment.profileAPI;
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
	constructor(private httpClient: HttpClient) {}

	getUserProfile() {
		let userProfile: any = sessionStorage.getItem("userProfile");
		userProfile = JSON.parse(userProfile);
		return userProfile;
	  }

	/**View Profile as per filter, By: Ayasakanta Swain, On: 08-Jun-2022, Component Name : ViewuserComponent **/
	viewUser(post: any): Observable<any> {
		post.intLevelId =
			this.intLevelId > 0 && this.intLevelId == 3 ? this.intLevelId - 1 : 0;

		return this.httpClient
			.post(this.apiURL + "/viewUser", JSON.stringify(post))
			.pipe(catchError(this.errorHandler));
	}

	/**Untag User, By: Ayasakanta Swain, On: 20-Jun-2022, Component Name : untag profile from user **/
	unTagProfile(encId: any) {
		return this.httpClient
			.post(
				this.apiURL + "/unTagProfile",
				JSON.stringify({ encId: encId, userId: this.getUserProfile()?.userId }),
				this.httpOptions
			)
			.pipe(
				tap(() => {
					this.RefreshRequired.next();
				})
			);
	}

	/**Delete User, By: Ayasakanta Swain, On: 20-Jun-2022, Component Name : ViewuserComponent **/
	deleteUser(encId: any) {
		return this.httpClient
			.post(
				this.apiURL + "/deleteUser",
				JSON.stringify({ encId: encId, userId: this.getUserProfile()?.userId }),
				this.httpOptions
			)
			.pipe(
				tap(() => {
					this.RefreshRequired.next();
				})
			);
	}

	/**Reset Password of User, By: Ayasakanta Swain, On: 15-Sep-2022, Component Name : ViewuserComponent **/
	resetPass(encId: any) {
		return this.httpClient
			.post(
				this.apiURL + "/resetPass",
				JSON.stringify({ encId: encId, userId: this.getUserProfile()?.userId }),
				this.httpOptions
			)
			.pipe(
				tap(() => {
					this.RefreshRequired.next();
				})
			);
	}

	 /* Created By : Ayasakanta Swain, Created On: 25-Jan-2023, Description: Change password */
	 changePassword(post: any): Observable<any> {
		post.userId = this.getUserProfile()?.userId;
		post.loginUserTypeId = this.getUserProfile()?.loginUserTypeId;
		return this.httpClient.post(
		  this.apiURL + "/changePassword",
		  JSON.stringify(post),
		  this.httpOptions
		);
	  }

	/**Add User, By: Ayasakanta Swain, On: 09-Jun-2022, Component Name : AddUserComponent **/
	createUser(post: any): Observable<any> {
		post.userId = this.getUserProfile()?.userId;
		return this.httpClient.post(
			this.apiURL + "/addUser",
			JSON.stringify(post),
			this.httpOptions
		);
	}

	/**View User Details, By: Ayasakanta Swain, On: 09-Jun-2022, Component Name : ViewUserComponent **/
	getUser(encId: string) {
		return this.httpClient
			.post(
				this.apiURL + "/getUser",
				JSON.stringify({ encId: encId }),
				this.httpOptions
			)
			.pipe(catchError(this.errorHandler));
	}

	getRole(levelId: any) {
		return this.httpClient.get(
			this.apiURL + "/getRole/" + levelId,
			this.httpOptions
		);
	}

	getDesignationGroup(levelId: any) {
		return this.httpClient.get(
			this.apiURL + "/getDesignationGroup/" + levelId,
			this.httpOptions
		);
	}

	/**View sub-Designation, By: Ayasakanta Swain, On: 09-Sep-2022, Component Name : ViewUserComponent **/
	getSubDesignation(designtionId: any) {
		return this.httpClient.get(
			this.apiURL + "/getSubDesignation/" + designtionId,
			this.httpOptions
		);
	}

	/**View untagged profle list**/
	viewAvailableProfile(
		designationId: any,
		districtId: any,
		blockId: any,
		offclusterId: any,
		intProfileId: any
	) {
		return this.httpClient.post(
			this.apiURL + "/viewAvailableProfile",
			JSON.stringify({
				designationId,
				districtId,
				blockId,
				offclusterId,
				intProfileId,
			}),
			this.httpOptions
		);
	}

	/**View tagged Information **/

	viewTagInfo(
		designationId: any,
		districtId: any,
		blockId: any,
		offclusterId: any,
		blankUserid: any,
		userLevelid: any
	) {
		return this.httpClient.post(
			this.apiURL + "/viewTagInfo",
			JSON.stringify({
				designationId,
				districtId,
				blockId,
				offclusterId,
				blankUserid,
				userLevelid,
			}),
			this.httpOptions
		);
	}

	getUserList(
		designationId: any,
		districtId: any,
		blockId: any,
		offclusterId: any
	) {
		return this.httpClient.post(
			this.apiURL + "/getUserList",
			JSON.stringify({ designationId, districtId, blockId, offclusterId }),
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
