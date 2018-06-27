import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";





@Injectable()
export class CompanyService {

  constructor(private http: Http) { }

  getCompanies(){
    return this.http.get('/company/api')
    .map(res => res.json());
  }

  getCompanyDetail(company){
    return this.http.get('/company/api/'+company)
    .map(res => res.json());
  }

  getStockTicker(){
    return this.http.get('/company/ticker')
    .map(res => res.json());

  }

  getStockComparision(stock1, stock2, from, to){
    return this.http.get('/company/ticker/'+stock1+'/'+stock2+'/'+from +'/'+to)
    .map(res => res.json());
  }

  getLiveData(stock){
    return this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=ISAJZ4X7ZZ31Y1QC')
    .map(res => res.json());
  }

  getPortfolio(username){
    return this.http.get('/portfolio/api/'+username)
    .map(res => res.json());

  }

  submitPortfolio(data){
    return this.http.post('/portfolio/api', data)
    .map(res => res.json());
  }

  getPortfolioStocks(name){
    return this.http.get('/portfolio/stock/'+name)
    .map(res => res.json());
  }
}
