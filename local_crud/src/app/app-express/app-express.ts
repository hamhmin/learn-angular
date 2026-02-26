import { Component, OnInit, inject } from '@angular/core';
import { ExpressUserService } from './express_user';
import { FormsModule } from '@angular/forms'; // 👈 [(ngModel)]을 쓰기 위해 필요!

@Component({
  selector: 'app-express',
  standalone: true,
  imports: [FormsModule], // 👈 꼭 추가해주세요
  template: `
    <div style="padding: 20px; border: 1px solid #ccc;">
      <h2>🚀 Express 서버 연동 중</h2>

      <input
        #nameInput
        type="text"
        placeholder="추가할 이름 입력"
        style="padding: 10px; margin-right: 10px;"
      />
      <button (click)="onAddUser(nameInput.value); nameInput.value = ''">추가</button>

      <hr />

      <ul>
        @for (user of ExpressUserService.users(); track user.id) {
          <input #nameEditInput type="text" value="{{ user.name }} " />
          <button (click)="onUpdateUser(user.id, nameEditInput.value)">수정</button>
          <li>
            [{{ user.id }}] {{ user.name }} <button (click)="onDeleteUser(user.id)">x</button>
          </li>
        }
      </ul>
    </div>
  `,
})
export class AppExpress {
  // 서비스를 public으로 가져오면 HTML에서 바로 ExpressUserService.users()를 쓸 수 있어 편합니다.
  public ExpressUserService = inject(ExpressUserService);

  ngOnInit() {
    this.ExpressUserService.loadUsers();
  }

  onAddUser(newName: string) {
    if (newName.trim()) {
      this.ExpressUserService.addUser(newName);
    }
  }
  onDeleteUser(id: number) {
    this.ExpressUserService.deleteUser(id);
  }
  onUpdateUser(id: number, name: string) {
    this.ExpressUserService.updateUser(id, name);
  }
}
