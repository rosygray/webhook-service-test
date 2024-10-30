const express = require("express");
const {
  createWebhook,
  getWebhooks,
  getWebhook,
  updateWebhook,
  deleteWebhook,
  triggerWebhook,
} = require("../controllers/webhookController");

const router = express.Router();

router.post("/", createWebhook);
router.get("/", getWebhooks);
router.get("/:id", getWebhook);
router.put("/:id", updateWebhook);
router.delete("/:id", deleteWebhook);
router.post("/:id/trigger", triggerWebhook);

router.post("/test-triggered-webhook/:id", (req, res) => {
  console.log("Log Data:", req.body);
  res.json({ message: "Triggered webhook received", data: req.body });
});
router.post("/test-triggered-webhook-2/:id", (req, res) => {
  console.log("Log Data:2", req.body);
  res.json({ message: "Triggered webhook received", data: req.body });
});
router.post("/test-triggered-webhook-3/:id", (req, res) => {
  console.log("Log Data:3", req.body);
  res.json({ message: "Triggered webhook received", data: req.body });
});

module.exports = router;
