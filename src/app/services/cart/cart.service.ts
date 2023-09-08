import { Injectable } from '@angular/core';
import { StorageKey, StorageService } from '../localstorage/storage.service';
import { Product } from 'src/app/pages/catalogue/catalogue.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  products: Product[] = []
  cartProducts: any[] = []
  constructor(private local: StorageService) { }


  getCartProducts() {

    var l = this.local.get(StorageKey.Cart).then((cart: any) => {
      if (cart != null) return cart;
    })

      
  }

  sendToCart(id: number) {
    let p = this.products.filter(product => {
      return product.id == id
    })[0]

    this.setCartProducts(p)
  }

  setCartProducts(product: any) {
    this.cartProducts.push(product)
    this.local.set(StorageKey.Cart, this.cartProducts).then((cart: any) => { })
  }

  isInCart(product: any) {
    return this.cartProducts.some(p => p.id == product)
  }


  deleteCartProduct(cart: any[], id: any) {
    this.local.set(StorageKey.Cart, cart.filter(c => c.id != id)).then((cart: any) => { })
  }

}
