import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs'; // 데이터를 변형할 때 쓰는 도구예요!
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  // private url = 'https://jsonplaceholder.typicode.com/users';
  private url = 'http://localhost:3000/api/users';
  users = signal<any[]>([]); // 공유할 데이터 저장소
  // 유저 목록을 가져오는 함수
  // 2. 데이터를 가져와서 시그널을 업데이트하는 함수
  loadUsers() {
    this.http
      .get<any[]>(this.url)
      .pipe(map((data) => data.map((u) => ({ id: u.id.toString(), name: u.name }))))
      .subscribe({
        next: (transformedData) => {
          // 서비스 내부의 시그널에 데이터를 저장합니다!
          this.users.set(transformedData);
        },
        error: (err) => console.error('데이터 로드 실패:', err),
      });
  }
  // user.service.ts
  updateUserName(id: string, newName: string) {
    const url = `${this.url}/${id}`;

    return this.http
      .patch(url, { name: newName })
      .pipe(
        // 서버 응답이 오면 서비스의 시그널을 즉시 업데이트!
        tap(() => {
          this.users.update((allUsers) =>
            allUsers.map((u) => (u.id === id ? { ...u, name: newName } : u)),
          );
        }),
      )
      .subscribe({
        next: (data) => console.log('이름 변경 성공! : ', data),
        error: (err) => console.error('이름 변경 실패:', err),
      });
  }
  addUser(name: string) {
    // 1. 서버에 보낼 데이터 (id는 보통 서버가 생성해주지만, 여기선 연습용이라 같이 보냅니다)
    const newUser = { name: name };

    return this.http
      .post<any>(this.url, newUser)
      .pipe(
        tap((response) => {
          // 2. 서버 저장 성공 시, 응답받은 데이터(id 포함)를 시그널에 추가
          this.users.update((prev) => [
            ...prev,
            {
              id: response.id.toString(), // 서버가 준 새 ID
              name: response.name,
            },
          ]);
        }),
      )
      .subscribe({
        next: () => console.log('유저 추가 성공!'),
        error: (err) => console.error('유저 추가 실패:', err),
      });
  }
  // getUsers는 loadUsers로 합쳐짐
  // getUsers() {
  //   return this.http.get<any[]>(this.url).pipe(
  //     // 서버 데이터를 우리 형식(id, name)에 맞게 변형합니다.
  //     map((data) =>
  //       data.map((user) => ({
  //         id: user.id.toString(),
  //         name: user.name,
  //       })),
  //     ),
  //   );
  // }
}
