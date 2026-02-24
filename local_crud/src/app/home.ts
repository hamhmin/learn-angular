import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // 👈 얘네가 꼭 필요해요!

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // 👈 HTML에서 쓰려면 여기에 등록!
  template: `
    <h2>여기는 홈 화면입니다! 🏠</h2>
    <nav>
      <a routerLink="notice">공지사항 보기</a> |
      <a routerLink="news">뉴스 보기</a>
    </nav>
    <hr />
    <router-outlet />
  `,
})
export class HomeComponent {}
