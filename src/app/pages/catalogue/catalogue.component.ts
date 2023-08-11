import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StorageKey, StorageService } from 'src/app/services/localstorage/storage.service';
import { ProductsService } from 'src/app/services/products/products.service';

export interface Product {
  id: number,
  name: string,
  colors: any[],
  category: string,
  brand: string,
  price: number,
  photo_url: string,
  color: string,
  description: string,
  stock: number,
  discount: string
}

export interface MakeupCategories {
  id: any,
  name_category: string
}
export interface MakeupBrands {
  id: any,
  name: string
}

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  @Output('ngModelChange') update = new EventEmitter();

  makeupBrands: MakeupBrands[] = [{ id: '0', name: "Todos" }]
  makeupCategories: MakeupCategories[] = [{ id: '0', name_category: "Todos" }]
  products: Product[] = []
  productsFiltered: Product[] = []

  filterText: string = ""

  productDetail: any
  isDetailOpen: boolean = false

  filterList: any[] = []
  searchText: any = ""

  cartProducts: any[] = []
  loading: boolean = false
  constructor(private local: StorageService, private products_service: ProductsService) { }

  ngOnInit(): void {
    this.getAllMakeups()
    this.getCartProducts()
  }

  getCartProducts() {
    this.local.get(StorageKey.Cart).then((cart: any) => {
      if(cart != null) this.cartProducts = cart;
      console.log(cart)
    })
  }

  setCartProducts(product: any) {
    this.isDetailOpen = false
    this.cartProducts.push(product)
    this.local.set(StorageKey.Cart, this.cartProducts).then((cart: any) => { })
  }

  getAllMakeups() {
    this.products_service.getMakeupProductsList().subscribe((products) => {
      console.log(products)
      this.products = products
      this.productsFiltered = this.products
    })

    this.products_service.getMakeupCategories().subscribe((categories) => {
      console.log(categories)
      this.makeupCategories = categories

    })

    this.products_service.getMakeupBrands().subscribe((brands) => {
      console.log(brands)
      this.makeupBrands = brands
    })

    this.productDetail = this.products[0]
  }

  filter(name: any, type: any) {

    console.log(this.filterList.includes(name))
    if (this.filterList.includes(name)) {
      const indice = this.filterList.indexOf(name);
      if (indice !== -1) {
        this.filterList.splice(indice, 1);
      }
    } else {
      this.filterList.push(name)
    }

    if (this.filterList.length == 0) {
      this.productsFiltered = this.products
      return
    }


    this.productsFiltered = this.products.filter((product) => {
      return this.filterList.includes(product.category) ||
        this.filterList.includes(product.brand)
    })
  }

  filterByName() {
    console.log(this.searchText)
    if (this.searchText == "") {
      this.cleanData()
      this.getAllMakeups()
      return
    }
    this.productsFiltered = this.productsFiltered.filter((product) => {
      return product.name.toLowerCase().includes(this.searchText.toLowerCase())
    })
  }

  sendToCart(id: number) {

    let p = this.products.filter(product => {
      return product.id == id 
    })[0]

    this.setCartProducts(p)
  }

  showDetail(id: number) {
    console.log(id)
    this.productDetail = this.products.filter(product => {
      return product.id == id
    })[0]

    this.openDetails()
    console.log(this.productDetail)

    this
  }

  openDetails() {
    this.isDetailOpen = this.isDetailOpen ? false : true;
  }

  saveToCart(product: Product) {
    this.local.set(StorageKey.Cart, product)
  }

  openFilter() {
    const element = document.getElementById('filter')

  }

  cleanData() {
    this.makeupBrands = []
    this.makeupCategories = []
    this.products = []
    this.productsFiltered = []
    this.filterText = ""
    this.filterList = []
    this.searchText = ""
  }

  isInCart(product: any) {
    return this.cartProducts.some(p => p.id == product)
  }
}
