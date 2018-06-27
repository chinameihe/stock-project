import { Component, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stocks = []
  constructor(
    private _stock: StockService,
    private _http: HttpClient
  ) {}

  ngOnInit() {
    this.getStocks()
  }

    getStockInfo(symbol){
    let url = "https://api.iextrading.com/1.0/stock/market/batch?symbols="
    + symbol
    + "&types=quote,news,chart&range=1m&last=5"
    return this._http.get(url)
  }

  getStocks(){
    this._stock.getAll().subscribe((data:any) =>{
      for(let stock of data){
        this.getStockInfo(stock.symbol).subscribe((info:any)=> {
          console.log(info[stock.symbol])
          this.stocks.push(info[stock.symbol])
          // console.log(this.stocks)
        })
      }
    })
  }
}
