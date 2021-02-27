import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, finalize, map, switchMap, take } from "rxjs/operators";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor{
    private isTokenRefreshing = false;
    private tokenSubject = new BehaviorSubject<string | null>(null);
    private apiService: ApiService;

    constructor(private injector: Injector) {
        this.apiService = this.injector.get(ApiService);
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.injectToken(req);
        return next.handle(req).pipe(catchError(err => this.handleErrorResponse(err, req ,next)));
    }

    private handleErrorResponse(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler ): Observable<any>{
        if(error instanceof HttpErrorResponse){
            switch(error.status){
                case 400: return this.handle400Error(error);
                case 401: return this.handle401Error(req, next);
                default: return throwError(error); 
            }
        }
        throw throwError(error);
    }

    private handle400Error(error: HttpErrorResponse): Observable<any> {
        this.apiService.logout();
        return throwError(error);
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if(!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.tokenSubject.next(null);
            const refreshToken = `${localStorage.getItem('refreshToken')}`;
            return this.apiService.refreshToken(refreshToken).pipe(
                map((response: any) => response.value.accessToken),
                switchMap((newToken: string) => {
                    if(newToken){
                        localStorage.setItem('accessToken', newToken);
                        return next.handle(this.injectToken(req))
                    }
                    this.apiService.logout()
                    return throwError("");
                }),
                catchError(error => {
                    this.apiService.logout();
                    return throwError(error);
                }),
                finalize(() => {
                    this.isTokenRefreshing = false;
                }),
            )
        }
        else{
            this.tokenSubject.pipe(
                filter((token: string | null) => token != null),
                take(1),
                switchMap((token: string | null) => {
                    return next.handle(this.injectToken(req, token))
                })
            )
            return throwError("");

        }
    }

    private injectToken(req: HttpRequest<any>, newToken?: string | null): HttpRequest<any> {
        if(newToken){
            localStorage.setItem('accessToken', newToken);
        }
        const token = localStorage.getItem('accessToken');
        return req.clone({
            setHeaders: {
                ...(token ? {Authorization: `Bearer ${token}`} : {})
            }
        })
    }
}