import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private _http: HttpClient) {}


  getAll(){
    return this._http.get('/api/stocks')
  }

  getOne(id){
    return this._http.get('/api/stocks/' + id)
  }

  addOne(data){
    return this._http.post('/api/stocks', data)
  }

  deleteOne(id){
    return this._http.delete('/api/stocks/' + id)
  }

  editOne(id, data){
    return this._http.put('/api/stocks/' + id, data)
  }

}
