import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  ngOnInit(): void {
    this.animateDigits();
  }

  animateDigits() {
    const randomNum = () => Math.floor(Math.random() * 9) + 1;

    let i = 0;
    const time = 30;
    const selector3 = document.querySelector('.thirdDigit');
    const selector2 = document.querySelector('.secondDigit');
    const selector1 = document.querySelector('.firstDigit');

    const loop3 = setInterval(() => {
      if (i > 40) {
        clearInterval(loop3);
        if (selector3) selector3.textContent = '4';
      } else {
        if (selector3) selector3.textContent = randomNum().toString();
        i++;
      }
    }, time);

    const loop2 = setInterval(() => {
      if (i > 80) {
        clearInterval(loop2);
        if (selector2) selector2.textContent = '0';
      } else {
        if (selector2) selector2.textContent = randomNum().toString();
        i++;
      }
    }, time);

    const loop1 = setInterval(() => {
      if (i > 100) {
        clearInterval(loop1);
        if (selector1) selector1.textContent = '4';
      } else {
        if (selector1) selector1.textContent = randomNum().toString();
        i++;
      }
    }, time);
  }
}
