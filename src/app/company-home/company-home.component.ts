import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CompanyService } from '../company.service';
import { StockChart } from 'angular-highcharts';
import { chart } from 'highcharts';
import * as Highcharts from 'highcharts/';
import * as Highstock from 'highcharts/highstock';

//import * as HighchartsExporting from 'highcharts/modules/exporting';



@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.css']
})
export class CompanyHomeComponent implements OnInit {
  companies:any[] = [];
  companyDetail:any[] = [];
  stockList:any[] = [];
  volumeStock:any[] = [];
  stock: StockChart;
  refinedStock: any[] = [];
  @ViewChild('chartTarget') chartTarget: ElementRef;
  chart: Highstock.ChartObject;


  
  constructor(private companyservice: CompanyService ) { }

  ngOnInit() {
    this.companyservice.getCompanies().subscribe(companies =>{
      this.companies = companies;
    });
    
  }

  getCompanyDetail(company){
    this.companyservice.getCompanyDetail(company).subscribe(data =>{
      this.companyDetail = data.c;
      this.stockList = data.s;
      this.volumeStock = data.v;
      console.log(this.volumeStock);
      this.stock = new StockChart({
        rangeSelector: {
          enabled: true
        },
      
        scrollbar: {
          enabled: false
        },

        navigator: {
          enabled: false
        },
        title: {
          text: 'Stock Price'
        },
        yAxis:[{
          title: {
            text: 'Price'
        },
        lineWidth: 2
        },
        {
            title: {
            text: 'Volume/1000000',
                style: {
                    color: "#aaa"
                },
            
        },
            gridLineWidth: 0,
            opposite: true
        }],
        tooltip: {
          valueDecimals: 2,
          shared:true, 
          pointFormat:'<span style="color:white;">{point.y}</span><br/>',
          backgroundColor: "#417fe2"
        },
        series: [{
          name: 'Stock Price',
          data: this.stockList,
          type: 'areaspline', 
          yAxis: 0,
          color: '#f72404'
          
        },
        {
        name: 'Stock Volume',
          data: this.volumeStock,
          type: 'column', 
          yAxis: 1,
          color: '#fff'
        }
      ], 
        
      });
      
      
  });
  
    for(let i=0;i<this.stockList.length; i=i+2){
        this.refinedStock.push([this.stockList[i], this.stockList[i+1]]);
    }
    //console.log(this.refinedStock);
    
    

  }
  ngAfterViewInit() {
   
  }
 
}

/*
const options: Highstock.Options =<any> {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL Stock Price',
            data: this.stockList,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0])]
                ]
            }
        }]
    };
    this.chart = chart(this.chartTarget.nativeElement, options);

      */