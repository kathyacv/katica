import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MakeupBrands, MakeupCategories, Product } from 'src/app/pages/catalogue/catalogue.component';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private firestore: Firestore) { }

  getMakeupProductsList(): Observable<Product[]> {
    const products = collection(this.firestore, 'products');
    return collectionData(products, {idField: 'id'}) as Observable<any>;
  }

  getMakeupCategories(): Observable<MakeupCategories[]> {
    const products = collection(this.firestore, 'categories');
    return collectionData(products, {idField: 'id'}) as Observable<any>;
  }

  getMakeupBrands(): Observable<MakeupBrands[]> {
    const products = collection(this.firestore, 'brands');
    return collectionData(products, {idField: 'id'}) as Observable<any>;
  }

  setBuyOrder(data: any){
    const order = collection(this.firestore, "buy_order");
    return addDoc(order, data)
  }
}
