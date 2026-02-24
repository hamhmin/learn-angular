import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { ProfileComponent } from './profile';
import { NoticeComponent } from './notice'; // 👈 추가!
import { NewsComponent } from './news'; // 👈 추가!
import { ProfileDetailComponent } from './profile-detail'; // 프로필 상세 (새로 만듦)
export const routes: Routes = [
  { 
    path: 'home',
    component: HomeComponent, // Home의 틀이 되는 컴포넌트
    children: [
      { path: 'notice', component: NoticeComponent }, // 주소: /home/notice
      { path: 'news', component: NewsComponent }, // 주소: /home/news
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      // 주소: /profile/userid123
      { path: ':id', component: ProfileDetailComponent },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // 빈 주소면 홈으로 보냄
];
