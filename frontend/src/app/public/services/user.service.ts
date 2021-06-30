import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { IUser } from 'src/app/model/user.interface';
import { catchError, tap } from "rxjs/operators"
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }
  create(user: IUser): Observable<IUser>{
    return this.http.post<IUser>('api/users/register', user).pipe(
      tap((createUser: IUser)=> this.snackbar.open(`User ${createUser.username} created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
      catchError(e=>{
        this.snackbar.open(`User could not be created: ${e.error.message}`, 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
        })
        return throwError(e);
      })
    )
  }
}
