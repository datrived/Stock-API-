import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';


@Component({
  selector: 'app-stock-compare',
  templateUrl: './stock-compare.component.html',
  styleUrls: ['./stock-compare.component.css']
})
export class StockCompareComponent implements OnInit {
  tickers:any[] = [];
  beta:any;
  correlation:any;
  constructor(private companyservice: CompanyService) { }

  ngOnInit() {
    this.companyservice.getStockTicker().subscribe(tickers =>{
      this.tickers = tickers;
    });
  }

  compare(stock1, stock2, from, to){
    
    this.companyservice.getStockComparision(stock1, stock2, from, to).subscribe(res =>{
      this.beta = res.beta;
      this.correlation = res.correlation;
    });


  }

}
