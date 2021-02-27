import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ApiService{
    constructor(private http: HttpClient) {}

    public login(): Observable<string>{
        return this.http.post('http://localhost:3000/login',{}).pipe(
            tap((data: any) => {
                localStorage.setItem('accessToken', data.value.accessToken);
                localStorage.setItem('refreshToken', data.value.refreshToken);
                return data.value.accessToken
            }),
            map(date => date.value.accessToken), 
            catchError(err => throwError(err))
        )
    }

    public secret(): Observable<string>{
        return this.http.get('http://localhost:3000/secret').pipe(
            map((data: any) => data.secret)
        );
    }

    public refreshToken(refreshToken: string): Observable<any> {
        return this.http.post(`http://localhost:3000/refresh?refreshToken=${refreshToken}`, {})
    }

    public logout(): void{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

}