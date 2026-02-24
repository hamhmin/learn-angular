import { Component, input, output } from '@angular/core'; // 1. output 추가

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  template: `
    <div style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
      <h4>👤 유저 정보 상세</h4>
      <p>
        조회 중인 ID: <strong>{{ id() }}</strong>
      </p>

      <button (click)="onClose()">상세창 닫기</button>
    </div>
  `,
})
export class ProfileDetailComponent {
  id = input.required<string>(); // 필수 값으로 설정

  // 3. 부모에게 보낼 신호(output) 정의
  closeRequest = output<string>();

  onClose() {
    // 4. 신호 발송! (emit 대신 함수처럼 호출 가능)
    this.closeRequest.emit(this.id());
  }
}
