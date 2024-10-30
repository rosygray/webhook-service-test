const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // 引入 cors 中间件
const webhookRoutes = require("./src/routes/webhooks");

const app = express();
const PORT = 3000;

app.use(cors()); // 使用 CORS 中间件
app.use(bodyParser.json());

// 路由
app.use("/webhooks", webhookRoutes);

app.listen(PORT, () => {
  console.log(`Webhook service running at http://localhost:${PORT}`);
});
