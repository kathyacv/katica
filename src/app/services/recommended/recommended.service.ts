import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MakeupBrands, MakeupCategories, Product } from 'src/app/pages/catalogue/catalogue.component';

@Injectable({
  providedIn: 'root'
})
export class RecommendedService {

  constructor(private firestore: Firestore) { }

  getRecommendedProducts(): Observable<Product[]> {
    const recommended = collection(this.firestore, 'recommend');
    return collectionData(recommended, {idField: 'id'}) as Observable<any>;
  }
}
