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
    this._stock.getAll().subscribe((data:any) => {
      for(let stock of data){
        this.getStockInfo(stock.symbol).subscribe((info:any) => {
          // console.log(info[stock.symbol])
          this.stocks.push(info[stock.symbol])
          // console.log(this.stocks)
        })
      }
    })
  }

  

  /**
   *  TODO
   *  1. Implement function that use socket to sbuscribe stocks, call that func in ngOnInit after getStocks 
   *  2. Listen on updates(socket.on('message')), update stock view when received updates
   *  3. Implement Stop Watching method: remove stock from db, unsubscribe through socket, etc
   *  4. Implement Add Stock Component(search for stock and add to db, subscribe though socket, etc)
   *  5. Implement Stock Detail Component(use chart data to show trend within 1d/1w/1m/1y/...)
   *  Remember
   *  Everytime you change your stocks table in db, you should use socket to subscribe/unsubscribe
   * */       
}
