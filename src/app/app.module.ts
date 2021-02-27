import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS }   from '@angular/common/http';
import { JwtInterceptor } from './core/services/jwt.interceptor';
import { ApiService } from './core/services/api.service';
import { CommonModule } from '@angular/common';
import { ShortPipe } from './core/pipes/short.pipe';
@NgModule({
  declarations: [
    AppComponent,
    ShortPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientModule,
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  },
  ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
