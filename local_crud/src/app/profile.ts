import { Component, signal, effect, computed } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ProfileDetailComponent } from './profile-detail';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, RouterLink, JsonPipe, ProfileDetailComponent],
  template: `
    <h2>내 프로필 관리</h2>
    <ul>
      @for (user of users(); track user.id) {
      <li>
        <button (click)="selectUser(user.id)">{{ user.name }}</button>
      </li>
      } @empty {
      <li style="color: red; font-weight: bold;">⚠️ 등록된 유저가 하나도 없습니다!</li>
      }
    </ul>
    @if (users().length > 3) {
    <p style="color: blue;">🔥 현재 유저가 많아 활발한 상태입니다!</p>
    } @else if (users().length > 0) {
    <p>유저 목록을 관리 중입니다.</p>
    } @else {
    <p>유저를 추가해 주세요.</p>
    }
    <hr />
    <strong>전체 데이터:</strong>
    <pre>{{ users() | json }}</pre>
    <button (click)="addUser()">유저 추가</button>
    <button (click)="clearUsers()" style="margin-left: 10px;">전체 삭제</button>

    <hr />

    @if (selectedId()) {
    <app-profile-detail [id]="selectedId()!" (closeRequest)="handleClose($event)">
    </app-profile-detail>
    }
  `,
})
export class ProfileComponent {
  users = signal([
    { id: 'ham', name: '함형민' },
    { id: 'guest', name: '게스트' },
  ]);

  addUser() {
    const nextNum = this.users().length + 1;
    this.users.update((prev) => [...prev, { id: 'user' + nextNum, name: '신규유저' + nextNum }]);
  }

  // ⭐ 데이터를 빈 배열로 만드는 함수
  clearUsers() {
    this.users.set([]); // 시그널을 빈 배열로 초기화
  }
  isPopular = computed(() => this.users().length > 3);

  // 현재 선택된 유저 ID를 저장하는 시그널 (없으면 null)
  selectedId = signal<string | null>(null);

  // 1. 유저를 선택했을 때 (자식에게 ID 전달)
  selectUser(id: string) {
    this.selectedId.set(id);
  }

  // 2. 자식이 closeRequest 신호를 보냈을 때 실행될 함수
  handleClose(text: string) {
    console.log(text);
    this.selectedId.set(null); // ID를 비워서 @if 창을 닫음
  }
  constructor() {
    // users() 시그널이 변경될 때마다 이 코드가 자동으로 실행됩니다.
    effect(() => {
      console.log('현재 유저 목록:', this.users());
    });
  }
}
