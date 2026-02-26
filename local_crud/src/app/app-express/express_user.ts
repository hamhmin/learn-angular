import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs'; // 데이터를 변형할 때 쓰는 도구예요!
interface ExpressUser {
  id: number; // Express(DB)에서 생성된 숫자형 ID
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpressUserService {
  private http = inject(HttpClient);
  // private url = 'https://jsonplaceholder.typicode.com/users';
  private url = 'http://localhost:3000/api/users';
  users = signal<ExpressUser[]>([]);
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
    // const url = `${this.url}/${id}`;
    // return this.http
    //   .patch(url, { name: newName })
    //   .pipe(
    //     // 서버 응답이 오면 서비스의 시그널을 즉시 업데이트!
    //     tap(() => {
    //       this.users.update((allUsers) =>
    //         allUsers.map((u) => (u.id === id ? { ...u, name: newName } : u)),
    //       );
    //     }),
    //   )
    //   .subscribe({
    //     next: (data) => console.log('이름 변경 성공! : ', data),
    //     error: (err) => console.error('이름 변경 실패:', err),
    //   });
  }
  updateUser(id: number, name: string) {
    const updateUrl = `${this.url}/${id}`;
    return this.http
      .put(updateUrl, { name: name })
      .pipe(
        tap(() => {
          this.users.update((prev) => prev.map((u) => (u.id == id ? { ...u, name: name } : u)));
        }),
      )
      .subscribe();
  }
  deleteUser(id: number) {
    const deleteUrl = `${this.url}/${id}`;
    console.log(deleteUrl);
    return this.http
      .delete(deleteUrl)
      .pipe(
        tap(() => {
          this.users.update((prev) => prev.filter((u) => u.id !== id));
        }),
      )
      .subscribe();
  }
  addUser(name: string) {
    const newUserRequest = { name: name }; // 서버로 보낼 데이터

    return this.http
      .post<ExpressUser>(this.url, newUserRequest)
      .pipe(
        tap((responseFromServer) => {
          // ❓ 여기서 'this.users' 시그널을 어떻게 업데이트하면
          // 기존 목록 뒤에 서버가 준 'responseFromServer'를 바로 붙일 수 있을까요?
          // 힌트: update()와 스프레드 연산자(...)를 활용해 보세요!
          console.log('서버에서 받은 데이터:', responseFromServer); // 👈 데이터 확인
          this.users.update((prev) => [...prev, responseFromServer]);
          console.log('업데이트 후 전체 목록:', this.users()); // 👈 시그널 값 확인
        }),
      )
      .subscribe();
    return;
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
