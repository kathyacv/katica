import { Component, HostListener, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from '../catalogue/catalogue.component';
import { StorageKey, StorageService } from 'src/app/services/localstorage/storage.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { RecommendedService } from 'src/app/services/recommended/recommended.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  

  products: Product[] = []
  productsFiltered: Product[] = []

  newImage: any
  recommended_product: any = {}

  name: string = "";
  message: string = "";
  messageForm: string = ""
  phrases: any[] = [
    "Limpieza facial: Lo primero que hay que hacer para tener una piel sana, es tener un programa completo de limpieza",
    "La limpieza facial es el  primer paso para lucir una piel sana",
    "Invierte en tu piel, va a representarte muchos años",
    "Se constante: En el cuidado de la piel, la prevención y la constancia son la clave",
    "Darse un tiempo cada día para relajarse y renovarse, es esencial para vivir bien",
    "La belleza, como el amor y la juventud, nacen de adentro hacia afuera",
    "La verdadera belleza brota del corazón y habita en los ojos.",
    "La vida no es perfecta, pero tu piel si puede serlo",
    "Cuidar de tu piel es el mejor regalo que puedes darle",
    "Cuidar de tu piel es una demostración de amor",
    "La naturaleza te da el rostro que tienes a los 20, depende de ti mantenerlo bien hasta los 50",
    "Cuida bien de tu cuerpo; es el único lugar donde tienes que vivir",
    "¡La belleza está en la piel! Cuídala, aceita, límpiala, frótala, perfúmala y ponte tu mejor ropa, aunque no sea una ocasión especial, y te sentirás como una reina.",
    "Un estilo de vida disciplinado y saludable es esencial para el cuidado de la piel",
    "Nunca es tarde para cuidarte. Nunca es tarde para comer sano, descansar lo suficiente, hacer ejercicio con regularidad y cuidar su piel",
    "Cuida bien tu piel e hidrátala. Si tienes buena piel, todo lo demás encajará en su lugar",
    "La piel radiante es el resultado del cuidado adecuado de la piel. Significa que puede usar menos maquillaje y dejar que la piel brille",
    "Una piel hermosa requiere compromiso, no un milagro",
    "La piel sana es un reflejo del bienestar genera",
    "Si quiere envejecer con gracia, cuide su piel, ya que refleja lo bien que la ha tratado a lo largo de los años",
    "Cuidar tu piel todos los días es como enviar notitas de amor a tu cuerpo",
    "La piel es la ventana del cuerpo al bienestar",
    "El cuidado de la piel es esencial, el maquillaje es una elección",
    "Cada cosa tiene su belleza, pero no todos pueden verla",
    "Tu mayor atractivo, es tu confianza",
    "No es la apariencia, es la esencia. No es el dinero, es la educación. No es la ropa es la clase",
    "Puedes ser preciosa a los treinta, encantadora a los cuarenta e irresistible el resto de tu vida",
    "Las modas pasan el estilo permanece",
    "Para sentirte atractiva, empieza por amarte más a ti misma",
    "Aunque viajemos por todo el mundo para encontrar la belleza, debemos llevarla con nosotros para poder encontrarla",
    "Cuida tu belleza espiritual interna. Eso se reflejará en tu cara",
    "No es la altura, ni el peso, ni los músculos, ni la belleza que te hacen una gran persona, es el corazón y la humildad",
    "Nada hace a una mujer más hermosa que la creencia de que lo es.",
    "El maquillaje es una extensión de tu personalidad. Junto con la ropa y los colores, expresa algo más",
  ]

  phraseRandom: string = ""
  menuContainer: boolean = false
  cartProducts: any[] = []
  productsWithDiscount: any
  productRecommended: any

  constructor(private recommended_service: RecommendedService, private local: StorageService, private products_service: ProductsService, private cart_service: CartService) { }

  ngOnInit(): void {
    this.width = window.innerWidth;
    
    this.phraseRandom = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    this.getAllMakeups()
    this.getRecommendedProduct() 
  }

  getCartProducts() {
    this.cartProducts = []
    this.productsWithDiscount = []
    this.local.get(StorageKey.Cart).then((cart: any) => {
      if(cart != null) this.cartProducts = cart;
      // this.getDiscountProducts()
    })
  }

  getDiscountProducts() {
    if (this.products.filter(p => p.discount != "0").length) {
      this.productsWithDiscount = this.products.filter(p => p.discount != "0")
    } else {
      this.productsWithDiscount = this.getMultipleRandom(this.products, 6)

    }
  }

  getAllMakeups() {
    this.products = []
    this.products_service.getMakeupProductsList().subscribe((products) => {
      this.products = products
      this.productsFiltered = this.products
      this.recommended_product = this.products[Math.floor(Math.random() * this.products.length)];
      this.getCartProducts()
      this.getDiscountProducts()
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

  deleteCartProduct(id:any) {
    this.cart_service.deleteCartProduct(this.cartProducts, id)
    this.getAllMakeups()
  }

  getRecommendedProduct() {
    this.recommended_service.getRecommendedProducts().subscribe(r => {
      this.productRecommended = r
      console.log(this.productRecommended)

      this.recommended_product = this.products.filter(p => p.id == this.productRecommended[0].product)[0]
      console.log(this.recommended_product )
    })
  }

  openMenu() {
    this.menuContainer = this.menuContainer? false:true
  }

  public width: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = window.innerWidth;
  }

  goSocialMedia(page: string) {
    if (page == 'facebook') window.open("https://www.facebook.com/profile.php?id=100091290512115&mibextid=ZbWKwL", 'blank');
    if (page == 'instagram') window.open("https://instagram.com/katica_cantares4_7?igshid=ZDdkNTZiNTM=", 'blank');
    if (page == 'whatsapp') window.open("https://api.whatsapp.com/send?phone=50671623019", 'blank');
  }


  

  

  getMultipleRandom(arr: Product[], num: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }


  public onValueChangeName(event: Event): void {
    const value = (event.target as any).value;
    this.name = value;
  }

  public onValueChangeMessage(event: Event): void {
    const value = (event.target as any).value;
    this.messageForm = value;
  }

  async sendMessage() {
    const number = 50688967637
    const message_katy = `Hola soy ${this.name} y ${this.messageForm}`;
    const url = `https://api.whatsapp.com/send?phone=${number}&text=${message_katy}`

    window.open(url)

    this.name = ""
    this.messageForm  = ""
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
}
}
