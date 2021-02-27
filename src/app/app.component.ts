import { Component } from '@angular/core';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public token = '';
  public secret = '';
  public isAuthorized = false;

  constructor(private api: ApiService) {}

  public login(): void{
    this.api.login().subscribe((data: any) => {
      this.token = data;
      this.isAuthorized = true;
    })
  }

  public getSecret(): void{
    this.api.secret().subscribe((data: any) => {
      this.secret = data;
    },
    err => this.secret = 'Unauthorized'
    )
  }

  public logout(): void {
    this.api.logout();
    this.isAuthorized = false;
    this.token = '';
    this.secret = '';
  }

}
