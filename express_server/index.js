const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: "형민" },
  { id: 2, name: "Gemini" },
  { id: 3, name: "Gemini2" },
];

app.get("/api/users", (req, res) => {
  res.json(users);
  console.log("get /api/users success");
});

app.post("/api/users", (req, res) => {
  const name = req.body.name;
  // 2. 새로운 유저 객체를 만듭니다.
  // (ID는 보통 현재 목록의 마지막 ID에 1을 더해서 생성합니다)
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name: name,
  };

  // 3. 서버의 메모리(users 배열)에 새 유저를 집어넣습니다.
  users.push(newUser);
  // 4. 앵귤러에게 "잘 추가됐어!"라고 알려주며 새 유저 정보를 다시 보냅니다.
  res.json(newUser);
  console.log("post /api/users success");
});
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userExists = users.find((u) => u.id === id);

  if (!userExists) {
    // ❌ 유저가 없으면 404 코드와 에러 메시지를 보냅니다.
    return res.status(404).json({ message: "해당 유저를 찾을 수 없습니다." });
  }
  users = users.filter((u) => u.id !== id);
  res.send({ deletedId: id, message: "삭제 성공" });
  console.log(`delete /api/users/${id} success`);
});
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  users = users.map((u) => (u.id == id ? { ...u, name: name } : u));
  res.json({ id, name });
});

app.listen(PORT, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다!");
});
