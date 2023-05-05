import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goSocialMedia(page: string) {
    if(page == 'facebook') window.open("https://www.facebook.com/profile.php?id=100091290512115&mibextid=ZbWKwL", 'blank');
    if(page == 'instagram') window.open("https://instagram.com/katica_cantares4_7?igshid=ZDdkNTZiNTM=", 'blank');
    if(page == 'whatsapp') window.open("https://api.whatsapp.com/send?phone=50671623019", 'blank');
  }

}
