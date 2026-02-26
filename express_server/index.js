const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: "형민" },
  { id: 2, name: "Gemini" },
];

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다!");
});
