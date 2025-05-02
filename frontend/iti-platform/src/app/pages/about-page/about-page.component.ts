import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
// @ts-ignore
import AOS from 'aos';


@Component({
  selector: 'app-about-page',
  imports: [],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent implements OnInit {

  ngOnInit(): void {
    AOS.init();
    
  }
  
}
