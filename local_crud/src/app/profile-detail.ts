import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  template: `
    <div style="border: 2px solid #3498db; padding: 15px; margin-top: 10px; border-radius: 8px;">
      <h4>👤 유저 정보 수정</h4>
      <p>조회 중인 ID: <strong>{{ id() }}</strong></p>

      <input #newNameInput type="text" placeholder="새 이름을 입력하세요" />
      <button (click)="onUpdate(newNameInput.value)">이름 변경</button>
      
      <hr />
      <button (click)="onClose()">창 닫기</button>
    </div>
  `,
})
export class ProfileDetailComponent {
  id = input.required<string>();
  
  closeRequest = output<string>();
  // 1. 이름을 변경하기 위한 새로운 output 추가
  nameChange = output<string>(); 

  onUpdate(newName: string) {
    if (newName.trim()) {
      // 2. 부모에게 새 이름을 보냅니다.
      this.nameChange.emit(newName);
    }
  }

  onClose() {
    this.closeRequest.emit(this.id());
  }
}