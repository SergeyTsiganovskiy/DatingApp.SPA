import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { Http , Headers, RequestOptions, Response} from '@angular/http';
import { AuthHttp } from '../../../node_modules/angular2-jwt';
import { PaginatedResult } from '../_models/pagination';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) { }

   getUsers(page?: number, itemsPerPage?: number){

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let queryString = '?';

    if (page !=null && itemsPerPage !=null){
      queryString += 'pageNumber=' + page + '&&pageSize=' + itemsPerPage;
    }

    return this.authHttp
    .get(this.baseUrl + 'users' + queryString)
    .map((response : Response) => {
       paginatedResult.result = response.json();
    
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
       return paginatedResult;

    })
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
