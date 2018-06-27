import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from '../company.service';
import { chart } from 'highcharts';
import * as Highcharts from 'highcharts/';
import * as Highstock from 'highcharts/highstock';

@Component({
  selector: 'app-live-data',
  templateUrl: './live-data.component.html',
  styleUrls: ['./live-data.component.css']
})
export class LiveDataComponent implements OnInit {
  tickers:any[] = [];
  @ViewChild('chart') chartTarget: ElementRef;
  chart: Highstock.ChartObject;

  constructor(private companyservice: CompanyService) { }

  ngOnInit() {
    this.companyservice.getStockTicker().subscribe(tickers =>{
      this.tickers = tickers;
    });
  }
 
  live(stock){
    this.companyservice.getLiveData(stock).subscribe(data =>{
      const options: Highstock.Options =<any> {
        chart: {
          events: {
              load: function () {
  
                  // set up the updating of the chart each second
                  var series = this.series[0];
                  setInterval(function () {
                      var x = (new Date()).getTime(), // current time
                          y = Math.round(Math.random() * 100);
                      series.addPoint([x, y], true, true);
                  }, 1000);
              }
          }
      },
  
      rangeSelector: {
          buttons: [{
              count: 1,
              type: 'minute',
              text: '1M'
          }, {
              count: 5,
              type: 'minute',
              text: '5M'
          }, {
              type: 'all',
              text: 'All'
          }],
          inputEnabled: false,
          selected: 0
      },
  
      title: {
          text: 'Live '+ stock+' data'
      },
  
      exporting: {
          enabled: false
      },
  
      series: [{
          name: stock +' data',
          type: 'areaspline', 
          color: '#f72404',
          data: (function () {
              // generate an array of random data
              var data = [],
                  time = (new Date()).getTime(),
                  i;
  
              for (i = -999; i <= 0; i += 1) {
                  data.push([
                      time + i * 1000,
                      Math.round(Math.random() * 100)
                  ]);
              }
              return data;
          }())
      }]
  
    };
    this.chart = chart(this.chartTarget.nativeElement, <any>options);
    });
  }

  

}
