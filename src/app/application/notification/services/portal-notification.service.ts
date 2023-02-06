import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortalNotificationService {
  
  private notificationAPI = environment.notificationAPI;

  constructor(private httpClient: HttpClient) { }

  /* Created By : Deepti Ranjan || Created On : 17-10-2022 || Service method Name : getPortalNotifications || Description: To get portal notifications */
  getPortalNotifications(params: object): Observable<any> {
    return this.httpClient.post(this.notificationAPI + '/getPortalNotifications', params);
  }
}
