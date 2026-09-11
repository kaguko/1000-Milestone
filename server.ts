import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
});

// Endpoint: AI generation of bespoke 10-minute milestones based on formula
app.post("/api/generate-milestones", async (req, res) => {
  try {
    const { domainName, ticketType, saigonDistrict, count = 10, currentMaxId = 100 } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured. Use the built-in instant algorithmic generator instead.",
      });
    }

    const prompt = `Bạn là chuyên gia thiết kế hệ thống "1000 Milestone Ở Trọ Sài Gòn" cho người trẻ sống ở phòng trọ TP.HCM.
Nhiệm vụ: Đẻ ra ${count} milestone 10 phút cụ thể, thực tế, đúng chất Sài Gòn, theo công thức nghiêm ngặt:
Công thức: [Hành động 10 phút] + [Ở đâu tại Sài Gòn / Quanh phòng trọ] + [Thưởng biến đổi (dopamine/phát hiện thú vị/cảm giác mới)]

Bối cảnh:
- Lĩnh vực: ${domainName || "Chung"}
- Loại vé: ${ticketType || "Tùy chọn"}
${saigonDistrict ? `- Khu vực cụ thể: ${saigonDistrict}` : ""}
- Bắt đầu đánh số ID từ: ${currentMaxId + 1}

Yêu cầu định dạng JSON CHÍNH XÁC (không kèm markdown râu ria ngoài JSON array):
[
  {
    "id": number,
    "action": "Hành động 10 phút rõ ràng",
    "location": "Ở đâu cụ thể quanh trọ/quận Sài Gòn",
    "reward": "Thưởng biến đổi / Dopamine thu được",
    "title": "Mô tả đầy đủ: [Hành động 10 phút] + [Ở đâu] + [Thưởng biến đổi]"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "[]";
    const data = JSON.parse(text);
    res.json({ success: true, milestones: data });
  } catch (error: any) {
    console.warn("Gemini API spike or error, using intelligent fallback generator:", error?.message);
    const { domainName = "Khám phá Sài Gòn", ticketType = "Hẻm lạ", saigonDistrict = "Bình Thạnh", count = 5, currentMaxId = 1000 } = req.body || {};
    
    // Robust local fallback generator
    const actions = [
      "Đi bộ dọc con hẻm rẽ phải 3 lần liên tiếp quan sát các ban công",
      "Vào một quán nước ven đường có chữ cái C hoặc T, gọi 1 ly nước mía 10k",
      "Đứng trên thành cầu hoặc bờ kênh hứng trọn cơn gió mát 10 phút",
      "Ghé quán hủ tiếu gõ hoặc tiệm bánh mì góc đường quan sát cách cô chú buôn bán",
      "Tìm một góc tường rêu phong hoặc ô cửa sổ chụp 1 bức ảnh ánh nắng chiều"
    ];
    const locations = [
      `Khu hẻm nhỏ thuộc ${saigonDistrict}`,
      `Bờ kè kênh hoặc góc ngã tư ${saigonDistrict}`,
      `Quán nước cóc vỉa hè bình dân ${saigonDistrict}`,
      `Đoạn đường một chiều gần chợ dân sinh ${saigonDistrict}`
    ];
    const rewards = [
      "Phát hiện góc quán ăn giấu mình cực thơm ngon giá chỉ 25k",
      "Tâm trí nhẹ bẫng sau cả ngày cày cuốc trong phòng trọ chật chội",
      "Nhận lại nụ cười sởi lởi thân thương của người Sài Gòn",
      "Cảm giác được giải phóng khỏi trạng thái cắm mặt vào màn hình"
    ];

    const fallbackMilestones = Array.from({ length: Number(count) || 5 }).map((_, idx) => {
      const act = actions[idx % actions.length];
      const loc = locations[idx % locations.length];
      const rew = rewards[idx % rewards.length];
      return {
        id: Number(currentMaxId) + 1 + idx,
        action: act,
        location: loc,
        reward: rew,
        title: `[${act}] + [${loc}] + [${rew}]`
      };
    });

    res.json({ success: true, milestones: fallbackMilestones, note: "Được sinh bởi máy đẻ công thức dự phòng" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
