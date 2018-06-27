import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from '../company.service';
import { interceptingHandler } from '@angular/common/http/src/module';
import { Http, Response } from '@angular/http';
import { StockChart } from 'angular-highcharts';
import { chart } from 'highcharts';
import * as Highcharts from 'highcharts/';
import * as Highstock from 'highcharts/highstock';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolio:any[] = [];
  tickers:any[] = [];
  usename:String;
  errorMSG1: String;
  errorMSG2: String;
  stock: StockChart;
  @ViewChild('chartTarget') chartTarget: ElementRef;
  chart: Highstock.ChartObject;
  seriesOptions:any[] = [];
  finalStocks:any[] = [];

  constructor(private companyservice: CompanyService, private element: ElementRef, private http: Http) { }

  ngOnInit() {

  }
  getPortfolio(username){
    console.log(username);
    this.companyservice.getPortfolio(username).subscribe(data=>{
      if(data.portfolio==null)  this.portfolio = null;
      else this.portfolio = data.portfolio.tickers;
        this.tickers = data.tickers;
        console.log(data.portfolio);
        //console.log(this.tickers.indexOf("AAPL"));
        this.usename = username;
    });
  }

  addToPortfolio(ticker){
    let found:boolean = false;
    if(this.portfolio== null){
        
      this.portfolio = [];
      this.portfolio.push([ticker, 0]);
    }
    else{
      if (this.portfolio.length > 10){ 
        this.errorMSG2= "Upto 10 Tickers";
        return null;
    }
      let sum=0;
      this.portfolio.forEach(function(p){
          if(p[0]==ticker){
                found = true;
          }
          sum=sum+ parseFloat(p[1]);
      });
      if(sum > 100){
        this.errorMSG1  = "The total ticker % should be < 100%";
        return null;
      }else if(found == false){
        this.portfolio.push([ticker, 0]);
      }
    }
  }
  deleteTicker(ticker){
    let newPortfolio:any[]=[];
    this.portfolio.forEach(function(p){
      if(ticker != p[0]){
        newPortfolio.push(p);
      }
    });
    this.portfolio = newPortfolio;
    
  }

  submitPortfolio(){
    //console.log(this.portfolio);
    let sum=0;
    this.portfolio.forEach(function(p){
      
      sum=sum+ parseFloat(p[1]);
  });
  if(sum > 100){
    this.errorMSG1  = "The total ticker % should be < 100%";
    return null;
  }
  else{
    let data = {portfolio: this.portfolio, username: this.usename};
    this.companyservice.submitPortfolio(data).subscribe(res=>{
       this.finalStocks = res;  
       console.log("res" + res);
      
    });
    this.errorMSG1  = "Submitted Successfully!";
    this.errorMSG2 = "";
  }
  }
  initializeChart(){
    let i=0; 
    console.log("final");
    console.log(this.finalStocks);
      this.finalStocks.forEach(function(name){
        
        this.companyservice.getPortfolioStocks(name[0]).subscribe(data=>{
          this.seriesOptions[i] = {
            name: name[0],
            data: data
        };
        if(i == this.finalStocks.length){
          this.createChart();
          }
        i=i+1;

        });
      });
    
      
  }
  
  onChangeHandler(event){

    //console.log(event.target.id + "-" +event.target.value);
    this.portfolio.forEach(function(p){
      if(event.target.id  == p[0]){
        p[1] = parseFloat(event.target.value);
      }
    });

  }

  createChart() {

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
      yAxis:{
        title: {
          text: 'Price'
      },
      lineWidth: 2
      },
      tooltip: {
        valueDecimals: 2,
        shared:true, 
        pointFormat:'<span style="color:white;">{point.y}</span><br/>',
        backgroundColor: "#417fe2"
      },
      series: this.seriesOptions, 
      
    });
    
    

    /*const options: Highstock.Options =<any>  {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: this.seriesOptions
    };
    this.chart = chart(this.chartTarget.nativeElement, <any>options);*/
}



}
