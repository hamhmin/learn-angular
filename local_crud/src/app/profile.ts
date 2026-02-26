import { HttpClient } from '@angular/common/http'; // 1. 타입 임포트
import { Component, signal, effect, computed, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ProfileDetailComponent } from './profile-detail';
import { UserService } from './user';
@Component({
  selector: 'app-user-count',
  standalone: true,
  template: `
    <div style="background: #f0f0f0; padding: 10px; border-radius: 8px;">
      <h3>📊 실시간 통계</h3>
      <p>
        현재 등록된 유저 수: <strong>{{ count() }}</strong
        >명
      </p>
    </div>
  `,
})
export class UserCountComponent {
  private userService = inject(UserService);

  // 서비스의 users 시그널이 변하면 이 계산된(computed) 값도 자동으로 바뀝니다!
  count = computed(() => this.userService.users().length);
}
//
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    // RouterOutlet,
    // RouterLink,
    JsonPipe,
    ProfileDetailComponent,
    UserCountComponent,
  ],
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
    @if (isPopular()) {
      <p style="color: blue;">🔥 현재 유저가 많아 활발한 상태입니다!</p>
    } @else if (users().length > 0) {
      <p>유저 목록을 관리 중입니다.</p>
    } @else {
      <p>유저를 추가해 주세요.</p>
    }
    <hr />
    <strong>전체 데이터:</strong>
    <pre>{{ users() | json }}</pre>
    <input
      #newUserNameInput
      type="text"
      placeholder="새 이름을 입력하세요"
      (keyup.enter)="addUser(newUserNameInput.value)"
      (keyup)="(null)"
    />
    <button
      (click)="addUser(newUserNameInput.value)"
      [disabled]="newUserNameInput.value.trim().length < 2"
    >
      유저 추가
    </button>
    <button (click)="clearUsers()" style="margin-left: 10px;">전체 삭제</button>
    <button (click)="onLoadUsers()">유저불러오기</button>
    <hr />
    @if (isLoading()) {
      <div class="skeleton-loader">데이터를 불러오는 중입니다...</div>
    } @else {
      <ul>
        @for (user of users(); track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
    }
    @if (selectedId()) {
      <app-profile-detail
        [id]="selectedId()!"
        (closeRequest)="handleClose($event)"
        (nameChange)="handleNameChange($event)"
      >
      </app-profile-detail>
    }
    <app-user-count> </app-user-count>
  `,
})
export class ProfileComponent {
  // 2. HTTP 도구 주입받기
  private http = inject(HttpClient);
  private userService = inject(UserService);
  @ViewChild('newUserNameInput') inputRef!: ElementRef<HTMLInputElement>;

  // 1. 로딩 상태를 관리할 시그널 (처음에는 로딩 중이 아니니 false 혹은 시작하자마자 부른다면 true)
  isLoading = signal<boolean>(false);

  // 서비스의 시그널을 내 것처럼 연결합니다.
  // users = signal([
  //   { id: 'ham', name: '함형민' },
  //   { id: 'guest', name: '게스트' },
  // ]);
  users = this.userService.users;

  onLoadUsers() {
    this.userService.loadUsers();
  }
  // loadUsers() {
  //   this.isLoading.set(true); // (1) 로딩 시작!

  //   // 가짜 데이터를 주는 연습용 URL입니다.
  //   const url = 'https://jsonplaceholder.typicode.com/users';

  //   // this.http.get<any[]>(url).subscribe({
  //   this.userService.getUsers().subscribe({
  //     next: (data) => {
  //       // (2) 성공적으로 데이터를 받았을 때

  //       // // 서버에서 받은 배열을 우리 형식에 맞게 살짝 가공해서 set 해줍니다.
  //       // const formattedData = data.map((user) => ({
  //       //   id: user.id.toString(), // 숫자를 문자열로 변환
  //       //   name: user.name,
  //       // }));
  //       // this.users.set(formattedData);
  //       // 서버에서 받은 배열을 우리 형식에 맞게 살짝 가공해서 set 해줍니다.
  //       this.users.set(data); // 이젠 user.ts에서 불러온 값을 넣기때문에 바로 data로 넣음
  //     },
  //     error: (err) => {
  //       console.error('에러 발생!', err);
  //     },
  //     complete: () => {
  //       // (3) 성공하든 실패하든 통신이 종료되면 로딩 해제!
  //       this.isLoading.set(false);
  //     },
  //   });
  // }

  // 현재 선택된 유저 ID를 저장하는 시그널 (없으면 null)
  selectedId = signal<string | null>(null);

  // 1. 유저를 선택했을 때 (자식에게 ID 전달)
  selectUser(id: string) {
    this.selectedId.set(id);
  }

  // 4. 실제로 목록의 데이터를 바꾸는 핵심 함수
  handleNameChange(newName: string) {
    const id = this.selectedId();
    if (!id) return;
    this.userService.updateUserName(id, newName);
    return; //이제 userService.updateUserName가 아래 코드를 대신해줄것임.
    // 1. 서버의 특정 유저를 가리키는 주소
    const url = `https://jsonplaceholder.typicode.com/users/${id}`;

    // 2. 서버에 보낼 데이터 객체
    const body = { name: newName };

    // 3. PATCH 요청 보내기
    this.http.patch(url, body).subscribe({
      next: (response) => {
        // 서버 수정이 성공하면 우리 화면(시그널)도 바꿉니다.
        this.users.update((prev) => prev.map((u) => (u.id === id ? { ...u, name: newName } : u)));
        console.log('서버 업데이트 완료!', this.users());
      },

      error: (err) => alert('수정에 실패했습니다!'),
    });
  }
  // 2. 자식이 closeRequest 신호를 보냈을 때 실행될 함수
  handleClose(text: string) {
    console.log(text);
    this.selectedId.set(null); // ID를 비워서 @if 창을 닫음
  }
  addUser(name: string) {
    // 1. 이름 앞뒤 공백 제거
    const trimmedName = name.trim();

    // 2. 유효성 검사 (비어있거나 2글자 미만인 경우)
    if (trimmedName.length < 2) {
      // 여기에 사용자에게 알림을 주는 코드가 들어가면 좋겠죠?
      return;
    }
    this.userService.addUser(trimmedName);
    // 이전 addUser기능은 user.ts로 옮김.
    // 2. ✨ 즉시 비우기 (사용자는 기다릴 필요가 없어요!)
    // 1. inputRef 객체 전체를 확인
    console.log('📦 inputRef 전체:', this.inputRef);

    // 2. 실제 HTML 요소(알맹이)를 확인
    console.log('🔗 nativeElement:', this.inputRef.nativeElement);
    if (this.inputRef) {
      this.inputRef.nativeElement.value = '';
    }
    return;
    const nextNum = this.users().length + 1;
    this.users.update((prev) => [...prev, { id: 'user' + nextNum, name: '신규유저' + nextNum }]);
  }

  // ⭐ 데이터를 빈 배열로 만드는 함수
  clearUsers() {
    this.users.set([]); // 시그널을 빈 배열로 초기화
  }
  isPopular = computed(() => this.users().length > 3);
  ngOnInit() {
    // 컴포넌트가 시작될 때 서비스에게 데이터를 불러오라고 시킵니다.
    this.userService.loadUsers();
    console.log('🌱 ngOnInit에서 확인:', this.inputRef);
  }
  ngAfterViewInit() {
    // 3. HTML 템플릿(뷰)이 다 그려진 시점
    console.log('🖼️ ngAfterViewInit에서 확인:', this.inputRef);
  }
  constructor() {
    // users() 시그널이 변경될 때마다 이 코드가 자동으로 실행됩니다.
    effect(() => {
      console.log('constructor의 effect에서 발동 => 현재 유저 목록:', this.users());
    });
    console.log('🏗️ constructor에서 확인:', this.inputRef);
  }
}
