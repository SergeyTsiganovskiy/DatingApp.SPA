import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { Http , Headers, RequestOptions} from '@angular/http';
import { AuthHttp } from '../../../node_modules/angular2-jwt';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) { }

   getUsers(): Observable<User[]>{
    return this.authHttp.get(this.baseUrl + 'users')
    .map(response => <User[]>response.json())
    .catch(this.handleError);
  }

   getUser(id): Observable<User>{
     return this.authHttp
        .get(this.baseUrl + 'users/' + id)
        .map(r => <User>r.json())
        .catch(this.handleError);
   }

   updateUser(id: number, user: User){
      return this.authHttp.put(this.baseUrl + 'users/' + id, user).catch(this.handleError);
   }


   setMainPhoto(userId: number, id: number){
      return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {}).catch(this.handleError);
   }


   deletePhoto(userId: number, id: number) {
      return this.authHttp.delete(this.baseUrl + 'users/' + userId + '/photos/' + id).catch(this.handleError);     
   }

  private handleError(error: any){
    const applicationError = error.headers.get('Application-Error');
    if (applicationError){
      return Observable.throw(applicationError);
    }
    
    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError){
      for (const key in serverError){
        if (serverError[key]){
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return Observable.throw(modelStateErrors || 'Sever error');
  }
}
