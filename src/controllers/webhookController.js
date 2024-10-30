const axios = require("axios");
const webhooks = []; // 将 webhooks 改为数组
let idCounter = 1;

// 替换 URL 中的占位符
const replacePlaceholders = (url, data) => {
  return Object.keys(data).reduce((acc, key) => {
    return acc.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }, url);
};

const createWebhook = (req, res) => {
  const { name, url, auth_token, enabled, template_urls } = req.body;

  // 简单验证
  if (!name || !url || !Array.isArray(template_urls)) {
    return res.status(400).json({ error: "Invalid data provided." });
  }
  if (
    !Array.isArray(template_urls) ||
    template_urls.length === 0 ||
    template_urls.some((url) => !url.trim())
  ) {
    return res
      .status(400)
      .json({ error: "Template URLs are required and cannot be empty." });
  }

  try {
    const id = `webhook-${idCounter++}`; // 使用 idCounter 来生成唯一 ID
    // 创建 webhook 逻辑
    const newWebhook = {
      id,
      name,
      url,
      auth_token,
      enabled,
      template_urls,
    };

    webhooks.push(newWebhook); // 将新 webhook 添加到数组中
    console.log("webhooks:createWebhook ", webhooks);
    res.status(201).json(newWebhook); // 返回新创建的 webhook
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWebhooks = (req, res) => {
  res.json(webhooks); // 直接返回数组
};

const getWebhook = (req, res) => {
  const webhook = webhooks.find((w) => w.id === req.params.id);
  if (!webhook) {
    return res.status(404).json({ error: "Webhook not found" });
  }
  res.json(webhook);
};

const updateWebhook = (req, res) => {
  const webhookIndex = webhooks.findIndex((w) => w.id === req.params.id);
  if (webhookIndex === -1) {
    return res.status(404).json({ error: "Webhook not found" });
  }

  const { name, url, auth_token, enabled, template_urls } = req.body;
  webhooks[webhookIndex] = {
    ...webhooks[webhookIndex],
    name,
    url,
    auth_token,
    enabled,
    template_urls,
  };
  res.json(webhooks[webhookIndex]);
};

const deleteWebhook = (req, res) => {
  const webhookIndex = webhooks.findIndex((w) => w.id === req.params.id);
  if (webhookIndex === -1) {
    return res.status(404).json({ error: "Webhook not found" });
  }

  webhooks.splice(webhookIndex, 1); // 从数组中删除 webhook
  res.status(204).send();
};

const triggerWebhook = async (req, res) => {
  console.log("webhooks: ", webhooks);
  console.log("req.params: ", req.params);
  const webhook = webhooks.find((w) => w.id === req.params.id);
  console.log("webhook:triggerWebhook ", webhook);
  if (!webhook || !webhook.enabled) {
    return res.status(404).json({ error: "Webhook not found or disabled" });
  }

  const data = req.body.data || {};
  console.log("data:triggerWebhook ", data);

  try {
    // 在此处初始化 promises 数组
    const promises = webhook.template_urls.map(async (url) => {
      const urlWithData = replacePlaceholders(url, data);
      return axios.post(urlWithData, data, {
        headers: { Authorization: `Bearer ${webhook.auth_token}` },
      });
    });

    await Promise.all(promises); // 等待所有请求完成
    res.json({ message: "Webhook triggered" });
  } catch (error) {
    console.log("error: ", error);
    console.error("Error triggering webhook:", error.message);
    // res.status(500).json({ error: "Failed to trigger webhook" });
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createWebhook,
  getWebhooks,
  getWebhook,
  updateWebhook,
  deleteWebhook,
  triggerWebhook,
};
