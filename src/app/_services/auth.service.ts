import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions , Response} from '@angular/http';
import 'rxjs/Rx';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt'
import { User } from '../_models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl;
  userToken: any;
  decodedToken: any;
  currentUser: User;
  jwtHelper: JwtHelper = new JwtHelper();
  private photoUrl = new BehaviorSubject('../../assets/user.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: Http) { }

  changeMemberPhoto(photoUrl: string){
    this.photoUrl.next(photoUrl);
  }

  login(model: any){
    return this.http.post(this.baseUrl + 'auth/login', model, this.requestOptions()).map((response: Response) => {
      const user = response.json();
      if (user){
        localStorage.setItem('token', user.tokenString);
        localStorage.setItem('user', JSON.stringify(user.user));
        this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
        this.currentUser = user.user;
        this.userToken = user.tokenString;
        if (this.currentUser.photoUrl !== null){
          this.changeMemberPhoto(this.currentUser.photoUrl);          
        }
        else {
          this.changeMemberPhoto('../../assets/user.jpg');
        }
      }
    }).catch(this.handleError);
  }

  register(user: User){
    return this.http.post(this.baseUrl + 'auth/register', user, this.requestOptions()).catch(this.handleError);
  }

  loggedIn(){
    return tokenNotExpired('token');
  }

  private requestOptions(){
    const headers = new Headers({'Content-type': 'application/json'});
    return new RequestOptions({headers: headers});
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
