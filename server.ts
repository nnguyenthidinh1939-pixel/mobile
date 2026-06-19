import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini if key is present
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API client successfully initialized.");
    } catch (err) {
      console.error("Failed to initialize Gemini client:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY not set. Using smart custom simulated responses as fallback.");
  }

  // API response for HLV AI AI Gym Coach
  app.post("/api/gym-coach", async (req, res) => {
    try {
      const { message, history, language } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const clientLanguage = language || "VI";

      // Check if we have active Gemini
      if (ai) {
        // Construct chat payload
        // Prepare system instructions for GYMMASTER BOT AI in appropriate language
        let systemInstruction = 
          "Bạn là 'GYMMASTER BOT AI', Huấn luyện viên thể hình ảo cao cấp của hệ thống phòng tập FIT GYM. " +
          "Bạn luôn xưng hô thân thiện, tràn đầy động lực, năng lượng và nhiệt huyết, xưng 'Tôi' (hoặc 'HLV AI') và gọi khách hàng là 'bạn' hoặc 'anh/chị'. " +
          "Hãy trả lời bằng tiếng Việt một cách rõ ràng, ngắn gọn, có cấu trúc tốt (sử dụng bullet points hoặc in đậm để người dùng dễ theo dõi). " +
          "Hãy cung cấp các chương trình tập luyện thực tế, lời khuyên dinh dưỡng, giải đáp thắc mắc về các gói dịch vụ FitGym một cách chu đáo nhất.";
        
        if (clientLanguage === "EN") {
          systemInstruction = 
            "You are 'GYMMASTER BOT AI', the premium virtual fitness coach of FIT GYM. " +
            "Respond in English with a friendly, highly motivational, energetic and supportive attitude. Use 'I' or 'AI Coach' and refer to the user as 'guest' or 'you'. " +
            "Keep answers concise, clear, well-structured (using bullet points or bold text), and provide actionable, practical workout schedules, nutritional advice, or detail memberships.";
        } else if (clientLanguage === "ZH") {
          systemInstruction = 
            "你是 'GYMMASTER BOT AI'，FIT GYM 尊享级智能虚拟健身教练。 " +
            "请以中文回复，语气要热情友好、充满动力与能量、关怀体贴。自称“教练”或“本 AI 教练”，称呼用户为“您”或“朋友”。 " +
            "请提供条理清晰、简明扼要、格式美观（多用粗体与列表点）的实用健身运动计划、科学营养建议或解答卡包会费等相关疑问。";
        }

        // Map client history to Gemini contents structure
        const contents = [];
        if (history && Array.isArray(history)) {
          // Gemini wants structured array of model/user turns
          history.forEach((turn: any) => {
            contents.push({
              role: turn.role === "assistant" ? "model" : "user",
              parts: [{ text: turn.content }],
            });
          });
        }
        
        // Append the current message
        contents.push({
          role: "user",
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        const textOutput = response.text;
        return res.json({ reply: textOutput });
      } else {
        // High quality simulated localized coaching responses when Gemini is not fully configured
        let simulatedReply = "";
        
        if (clientLanguage === "EN") {
          simulatedReply = "Hello! I am your FIT GYM AI Coach. The smart gateway is currently undergoing brief maintenance, but I can definitely give you quick, practical recommendations based on your goal:\n\n";
        } else if (clientLanguage === "ZH") {
          simulatedReply = "您好！我是 FIT GYM 智能 AI 私人教练。目前网络连接主通路正在维护中，但我仍为您准备了以下高效运动及科学膳食小贴士：\n\n";
        } else {
          simulatedReply = "Chào bạn! Tôi là HLV AI của FIT GYM. Rất tiếc hiện tại cổng kết nối thông minh đang bảo trì một chút, nhưng tôi vẫn có thể đưa ra một vài gợi ý nhanh cho bạn nhé:\n\n";
        }
        
        const cleanMsg = message.toLowerCase();
        if (cleanMsg.includes("ngực") || cleanMsg.includes("chest") || cleanMsg.includes("thực hành") || cleanMsg.includes("exercise") || cleanMsg.includes("tập")) {
          if (clientLanguage === "EN") {
            simulatedReply += "**Hypertrophy Chest Day Routine:**\n\n" +
              "1. **Incline Barbell Bench Press**: 4 sets x 8-10 reps (Targeting upper chest for thickness)\n" +
              "2. **Flat Dumbbell Press**: 3 sets x 10 reps (Maximizing middle pectoral fibers)\n" +
              "3. **Cable Crossover**: 3 sets x 12-15 reps (Isolating outer chest and inner line definition)\n" +
              "4. **Dips**: 3 sets x max reps (Sculpting lower pectorals)\n\n" +
              "*Note*: Drink plenty of water and rest 60-90 seconds between sets!";
          } else if (clientLanguage === "ZH") {
            simulatedReply += "**高效胸肌维度轰炸课表 (Hypertrophy Chest Day):**\n\n" +
              "1. **上斜杠铃卧推 (Incline Barbell Press)**: 4 组 x 8-10 次（深度刺激上胸，增加厚度）\n" +
              "2. **平板哑铃推举 (Flat Dumbbell Press)**: 3 组 x 10 次（最大化募集胸大肌中段纤维）\n" +
              "3. **绳索夹胸 (Cable Crossover)**: 3 组 x 12-15 次（隔离雕刻胸肌外缘与中间胸沟）\n" +
              "4. **双杠臂屈伸 (Dips)**: 3 组 x 极限次数（塑造细致下胸边缘）\n\n" +
              "*温馨提示*: 每组休息 60-90 秒，每天需补充充足的水哦！";
          } else {
            simulatedReply += "**Lịch Tập Ngực Tăng Cơ Siêu Nhanh (Hypertrophy Chest Day):**\n\n" +
              "1. **Incline Barbell Bench Press**: 4 sets x 8-10 reps (Tách biệt ngực trên, tạo độ dày)\n" +
              "2. **Flat Dumbbell Press**: 3 sets x 10 reps (Kích hoạt phần ngực giữa tối đa)\n" +
              "3. **Cable Crossover**: 3 sets x 12-15 reps (Ép căng cơ ngực ngoài và tạo rãnh sâu)\n" +
              "4. **Dips (Xà kép)**: 3 sets x max reps (Cắt ngực dưới săn chắc)\n\n" +
              "*Lưu ý*: Hãy uống đủ 2-3 lít nước và giữ khoảng cách nghỉ giữa các hiệp là 60-90 giây nhé!";
          }
        } else if (cleanMsg.includes("bụng") || cleanMsg.includes("mỡ") || cleanMsg.includes("diet") || cleanMsg.includes("ăn") || cleanMsg.includes("béo") || cleanMsg.includes("fat") || cleanMsg.includes("weight")) {
          if (clientLanguage === "EN") {
            simulatedReply += "**Belly Fat Loss & Lean Diet Plan:**\n\n" +
              "- **Breakfast**: 2 boiled eggs + 1 slice of whole-wheat dark toast + 1 banana.\n" +
              "- **Lunch**: 150g grilled chicken breast + 1 small bowl of brown rice + steamed broccoli.\n" +
              "- **Afternoon Snack**: 1 unsweetened Greek yogurt cup + a grab of almonds.\n" +
              "- **Dinner**: 120g seared salmon (or lean beef tenderloin) + leafy mixed salad with olive oil dressing.\n\n" +
              "*Action Point*: Cut out refined sugar, heavy fried grease, and go to bed before 11 PM!";
          } else if (clientLanguage === "ZH") {
            simulatedReply += "**科学燃烧腹部脂肪营养膳食食谱:**\n\n" +
              "- **黄金早餐**: 2 枚白水煮蛋 + 1 片全麦黑面包 + 1 根香蕉。\n" +
              "- **能量午餐**: 150g 优质香煎鸡胸肉 + 1 小碗糙米饭 + 白灼西兰花。\n" +
              "- **低卡下午茶**: 1 杯无糖希腊酸奶 + 一小把巴旦木坚果。\n" +
              "- **低碳晚餐**: 120g 嫩煎三文鱼（或高蛋白牛肉）+ 混合生菜黄瓜沙拉配橄榄油。\n\n" +
              "*秘诀点拨*: 杜绝一切加工糖、重度油炸垃圾食品，保证晚上 23:00 前安然入睡！";
          } else {
            simulatedReply += "**Thực Đơn Giảm Mỡ Bụng Khoa Học Trong 7 Ngày:**\n\n" +
              "- **Bữa sáng**: 2 quả trứng luộc + 1 lát đầy bánh mì đen + 1 quả chuối tiêu.\n" +
              "- **Bữa trưa**: 150g ức gà áp chảo + 1 bát nhỏ gạo lứt + rau súp lơ xanh hấp.\n" +
              "- **Bữa phụ chiều**: 1 hũ sữa chua không đường + nắm nhỏ hạt hạnh nhân.\n" +
              "- **Bữa tối**: 120g cá hồi áp chảo (hoặc thịt bò áp chảo) + salad xà lách dưa chuột sốt dầu ô liu.\n\n" +
              "*Bí quyết*: Hạn chế tối đa đường tinh luyện, đồ chiên rán mỡ dầu và hãy ngủ trước 23h nha!";
          }
        } else if (cleanMsg.includes("gói tập") || cleanMsg.includes("bảng giá") || cleanMsg.includes("giá") || cleanMsg.includes("plan") || cleanMsg.includes("price") || cleanMsg.includes("membership") || cleanMsg.includes("cost")) {
          if (clientLanguage === "EN") {
            simulatedReply += "FIT GYM currently offers 4 highly popular membership options to fit your lifestyle:\n\n" +
              "1. **BASIC PASS (500,000 VND / Month)**: Standard gym floor access, sauna & lockers included.\n" +
              "2. **STANDARD 6M (2,500,000 VND / 6 Months)**: Standard access + 2 complementary PT assessment sessions.\n" +
              "3. **PREMIUM 12M (4,500,000 VND / 12 Months)**: Access + 5 personal trainer sessions + dedicated private locker.\n" +
              "4. **VIP ELITE MEM (12,000,000 VND / Year)**: Premium unlimited access, 1-on-1 private trainer throughout!\n\n" +
              "Simply switch to the **PLANS** page on the top slide navigation bar to review in detail!";
          } else if (clientLanguage === "ZH") {
            simulatedReply += "FIT GYM 当前为您量身打造成员资格服务，现提供 4 大至臻特选卡包方案：\n\n" +
              "1. **单月基础卡 (500,000 盾 / 月)**: 自主健身，尊享淋浴汗蒸与免费电子柜。\n" +
              "2. **半年标配卡 (2,500,000 盾 / 6 个月)**: 畅爽通训，免费赠送 2 节 1 对 1 专业私教评估课。\n" +
              "3. **全年尊贵专属卡 (4,500,000 盾 / 12 个月)**: 专属私人收纳柜 + 全程附赠 5 节高级私教授课。\n" +
              "4. **VIP ELITE 领袖会籍 (12,000,000 盾 / 年)**: 全天候不限时畅行，配备 1V1 专属教练伴练！\n\n" +
              "您可以直接滑动顶部导航切换至‘会员方案’查看更多细则！";
          } else {
            simulatedReply += "Hiện FIT GYM đang cung cấp 4 sự lựa chọn tuyệt vời phù hợp với mọi nhu cầu:\n\n" +
              "1. **GÓI CƠ BẢN (500.000đ/Tháng)**: Tập tự do, xông hơi & locker free.\n" +
              "2. **GÓI TIÊU CHUẨN 6T (2.500.000đ/6 Tháng)**: Tặng kèm 2 buổi huấn luyện PT.\n" +
              "3. **GÓI CAO CẤP 12T (4.500.000đ/12 Tháng)**: Tặng 5 buổi PT + tủ đồ cá nhân riêng.\n" +
              "4. **HỘI VIÊN VIP ELITE (12.000.000đ/12 Tháng)**: Có PT riêng 1:1 suốt hành trình!\n\n" +
              "Hãy chuyển sang tab **GÓI TẬP** ở thanh điều hướng để xem chi tiết nhé!";
          }
        } else {
          if (clientLanguage === "EN") {
            simulatedReply += "That's an amazing fitness question! To achieve your dream body structure, remember to integrate:\n\n" +
              "- **Consistent Training**: Weight-lifting at least 3-4 times a week, tracking with progressive overload.\n" +
              "- **Optimized Nutrition**: Consume enough protein daily (approx. 1.5g to 2g per kg of body weight).\n" +
              "- **Proper Recovery**: Rest 7-8 hours deep sleep each night and do static stretches after workouts.\n\n" +
              "Would you like me to construct a tailored workout division suited for your height and weight goals?";
          } else if (clientLanguage === "ZH") {
            simulatedReply += "这是一个非常好的健身话题！要想彻底雕刻精美线条，请关注并践行以下三大基石：\n\n" +
              "- **周期性抗阻训练**: 每周至少举铁 3-4 次，循序渐进挑战负荷（Progressive Overload）。\n" +
              "- **高蛋白饮食管理**: 每日精细补足 1.5 - 2 克每公斤体重的优质蛋白质（Protein）。\n" +
              "- **深度恢复促进**: 每日生层睡眠 7-8 小时，每次课后严格拉伸以松弛肌肉结缔组织。\n\n" +
              "您需要我结合您具体的体重和身高数据，为您定制周计划贴士表吗?";
          } else {
            simulatedReply += "Đó là một câu hỏi rất hay! Để có được vóc dáng săn chắc nhất, bạn cần kết hợp giữa:\n\n" +
              "- **Chế độ tập luyện**: Ít nhất 3-4 buổi/tuần, tăng dần độ nặng tạ (Progressive Overload).\n" +
              "- **Dinh dưỡng hợp lý**: Đảm bảo nạp đủ lượng Protein (1.5g - 2g trên mỗi kg thể trọng).\n" +
              "- **Phục hồi**: Ngủ đủ 7-8 tiếng mỗi đêm và giãn cơ sau mỗi buổi tập.\n\n" +
              "Bạn có muốn tôi lên lịch tập chi tiết phù hợp với cân nặng và chiều cao hiện tại của bạn không?";
          }
        }
        
        // Add a slight latency to simulate AI thinking
        await new Promise((resolve) => setTimeout(resolve, 600));
        return res.json({ reply: simulatedReply });
      }
    } catch (err: any) {
      console.error("Error in /api/gym-coach:", err);
      return res.status(500).json({ error: err.message || "Internal server error." });
    }
  });

  // Handle client-side routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
