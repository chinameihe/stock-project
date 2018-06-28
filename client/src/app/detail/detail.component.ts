import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { StockService } from '../stock.service';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent implements OnInit, OnChanges {
  @ViewChild('chart')
  chartElement: ElementRef;

  data: any[]

  parseDate = d3.timeParse('%Y-%m-%d')

  private svgElement: HTMLElement;
  private chartProps: any;

  constructor(
    private _stock: StockService,
    private _http: HttpClient    
  ) {}

  ngOnChanges(){
    if (this.data) {
      console.log("build chart")
      this.buildChart();
    }
  }

  ngOnInit() {
    this.checkChart()
  }

  getChart(){
    let url = "https://api.iextrading.com/1.0/stock/aapl/chart/1y"
    return this._http.get(url)
  }

  checkChart(){
    this.getChart().subscribe((data:any)=>{
      console.log("get data: ", data);
      this.data = data;
      this.buildChart();
    })    
  }

  formatDate(){
    this.data.forEach(element => {
      if(typeof element.date ==="string") {
        element.date = this.parseDate(element.date)
      }
    });
  }

  buildChart(){
    this.chartProps = {};
    this.formatDate();

    // set the dimentsions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

    // set the ranges
    this.chartProps.x = d3.scaleTime().range([0, width]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);

    // define the axes
    var xAxis = d3.axisBottom(this.chartProps.x)
    var yAxis = d3.axisLeft(this.chartProps.y).ticks(5);
    let _this = this;

    // define the line
    var valueline = d3.line<any>()
    .x(function (d){
      if (d.date instanceof Date) {
        return _this.chartProps.x(d.date.getTime());
      }
    })
    .y(function (d){console.log("Close market"); return _this.chartProps.y(d.close)})

    // define the line
    var valueline2 = d3.line<any>()
      .x(function (d) {
        if (d.date instanceof Date) {
          return _this.chartProps.x(d.date.getTime());
        }
      })
      .y(function (d) { console.log('Open market'); return _this.chartProps.y(d.open); });
  
    var svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // scake the range of the data
    this.chartProps.x.domain(
      d3.extent(_this.data, function(d) {
        if (d.date instanceof Date) {
          return (d.date as Date).getTime();
        }
      })
    )
    this.chartProps.y.domain([0, d3.max(this.data, function(d) {
      return Math.max(d.close, d.open);
    })]);

    // Add the value Line2 path
    svg.append('path')
      .attr('class', 'line line2')
      .style('stroke', 'green')
      .style('fill', 'none')
      .attr('d', valueline2(_this.data));

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line line1')
      .style('stroke', 'black')
      .style('fill', 'none')
      .attr('d', valueline(_this.data));

    // add the x axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    this.chartProps.valueline = valueline;
    this.chartProps.valueline2 = valueline2;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
  }
}
