import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import stock from 'highcharts/modules/stock.src';
import more from 'highcharts/highcharts-more.src';


import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FileComponent } from './file/file.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { CompanyService } from './company.service';
import { StockCompareComponent } from './stock-compare/stock-compare.component';
import { LiveDataComponent } from './live-data/live-data.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const appRoutes: Routes = [
  { path: 'file', component: FileComponent },
  {
    path: 'home',
    component: HomeComponent
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }, 
  {
    path: 'company',
    component: CompanyHomeComponent
  }, 
  {
    path: 'stock',
    component: StockCompareComponent
  },
  {
    path: 'live',
    component: LiveDataComponent
  }, 
  {
    path: 'portfolio',
    component: PortfolioComponent
  }
];

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [stock, more];
}



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    FileComponent, 
    CompanyHomeComponent, StockCompareComponent, LiveDataComponent, PortfolioComponent
  ],
  imports: [
    
    BrowserModule, 
    FormsModule,
    HttpModule,
    HttpClientModule,
    ChartModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [CompanyService, { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
