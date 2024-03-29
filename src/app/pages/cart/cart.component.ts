import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { StorageKey, StorageService } from 'src/app/services/localstorage/storage.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  id: string = ""
  cant = 1
  cartProducts: any[] = []
  totalAmount: any = 0
  totalNeto: any = 0
  totalDiscount:any = 0

  name: string = ""
  lastname: string = ""
  phone: string = ""
  email: string = ""
  comprobante: string = ""

  loading: boolean = false

  constructor(private cart_service: CartService, private products_service: ProductsService, private route: Router, private local: StorageService) { }

  ngOnInit(): void {
    this.getProductsCart()
  }

  getProductsCart() {
    this.cartProducts = []
    console.log("get cart product")
    this.local.get(StorageKey.Cart).then((cart: any) => {
      this.cartProducts = cart
      this.cartProducts.forEach(p => p.cant = 1)
      this.getTotalNeto()
      this.getTotalDiscount()
      this.getTotalToPay()
      this.setRandomID()
    })
  }

  deleteCartProduct(id:any) {
    this.cart_service.deleteCartProduct(this.cartProducts, id)
    this.getProductsCart()
  }

  getTotalNeto() {
    this.totalNeto = this.cartProducts.map(p => p.price * p.cant).reduce((acc, amount) => acc + amount);
  }

  getTotalDiscount() {
    this.totalDiscount = this.cartProducts.map(p => p.discount * p.cant).reduce((acc, amount) => acc + amount);
  }

  getTotalToPay() {
    this.totalAmount = this.cartProducts.map(p => (p.discount != "0"?p.discount:p.price) * p.cant).reduce((acc, amount) => acc + amount);
  }

  setRandomID() {
    this.id = Math.random().toString(36).substring(2, 6 + 2);
  }

  lessCant(id: any) {
    let cant = this.cartProducts.filter(p => p.id == id)[0].cant

    if (cant > 1) {
      this.cartProducts.filter(p => p.id == id)[0].cant = cant - 1
    }

    this.getTotalNeto()
    this.getTotalDiscount()
    this.getTotalToPay()
  }

  plusCant(id: any) {
    let cant = this.cartProducts.filter(p => p.id == id)[0].cant
    let limit = this.cartProducts.filter(p => p.id == id)[0].quantity

    if (cant < limit) {
      this.cartProducts.filter(p => p.id == id)[0].cant = cant + 1
    }

    this.getTotalNeto()
    this.getTotalDiscount()
    this.getTotalToPay()
  }

  verifyForm() {
    return !this.name || !this.lastname || !this.email || !this.phone || !this.comprobante
  }
  saveDelivery() {

    if (this.verifyForm()) return;

    this.loading = true
    const currentDate = new Date();
    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();

    const data = {
      order_code: this.id,
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      phone: this.phone,
      comprobante: this.comprobante,
      products: this.cartProducts,
      total: this.totalAmount,
      status: "ordenado",
      created: currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear,
    }
    this.products_service.setBuyOrder(data).then((resp) => {
      this.local.remove(StorageKey.Cart).then(() => { })
    })

  }

  goBack() {
    this.loading = false
    this.route.navigateByUrl('/catalogue')
  }
}
