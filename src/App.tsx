/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Dumbbell,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  User,
  Lock,
  CheckCircle,
  Check,
  LogOut,
  X,
  Send,
  Search,
  Sparkles,
  Phone,
  MessageSquare,
  Clock,
  CreditCard,
  LockKeyhole,
  Info,
  Bell,
  Settings,
  Shield,
  Smartphone,
  ExternalLink,
  HelpCircle,
  FileText,
  Pencil,
  MapPin,
  Calendar,
  History,
  ChevronDown,
  ChevronUp,
  Star,
  Globe
} from "lucide-react";
import { UserSession, AppScreen, Message, GymPackage, SupportContact, AppNotification, PaymentTransaction } from "./types";
import { GYM_PACKAGES, SUPPORT_CONTACTS } from "./data";

export default function App() {
  // Mobile device system-level mimics
  const [systetime, setSystetime] = useState("22:30");
  const [language, setLanguage] = useState<"VI" | "EN" | "ZH">(() => {
    try {
      const saved = localStorage.getItem("fitgym_language") as "VI" | "EN" | "ZH" | null;
      if (saved && ["VI", "EN", "ZH"].includes(saved)) {
        return saved;
      }
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith("vi")) return "VI";
      if (navLang.startsWith("zh")) return "ZH";
    } catch (e) {}
    return "EN";
  });
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("fitgym_language", language);
    } catch (e) {}
  }, [language]);
  
  // App navigation & status
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("LOGIN");
  const [lastScreen, setLastScreen] = useState<AppScreen>("LOGIN"); // for back buttons
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Dynamic user session persistence
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem("fitgym_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return { ...parsed, isLoggedIn: false };
        }
      }
    } catch (e) {
      console.warn("Failed to parse fitgym_session", e);
    }
    return {
      fullName: "NAM",
      phoneNumber: "0012312312",
      password: "",
      address: "123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh",
      gender: "Nam",
      birthDate: "1995-10-15",
      memberCode: "#0013",
      memberClass: "Hội viên CLASS_PLATINUM",
      isRegistered: false,
      isLoggedIn: false,
      workoutsCount: 0,
    };
  });

  // Keep list of registered users to allow logging back into any registered account
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, { fullName: string; password?: string; address?: string; gender?: string; birthDate?: string }>>(() => {
    try {
      const saved = localStorage.getItem("fitgym_registered_users");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load registered users", e);
    }
    return {
      "0012312312": { fullName: "NAM", password: "123456", address: "123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh", gender: "Nam", birthDate: "1995-10-15" }
    };
  });

  // Persist session changes
  useEffect(() => {
    try {
      localStorage.setItem("fitgym_session", JSON.stringify(session));
    } catch (e) {
      console.warn("Failed to save session", e);
    }
  }, [session]);

  // Persist registered users
  useEffect(() => {
    try {
      localStorage.setItem("fitgym_registered_users", JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn("Failed to save registered users", e);
    }
  }, [registeredUsers]);

  // Dynamic App Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem("fitgym_notifications");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load notifications", e);
    }
    return [
      {
        id: "msg-tiep_tan-init",
        title: "Tin nhắn từ Tiếp Tân Vy Vy",
        body: "Chào bạn! Mình là Vy Vy, phục vụ trực tổng đài lễ tân FIT GYM. Rất vui được kết nối hỗ trợ bạn!",
        time: "Vừa xong",
        isRead: false,
        type: "message",
      },
      {
        id: "msg-huan_luyen-init",
        title: "Tin nhắn từ PT Nam Khanh",
        body: "Hello, mình là PT Nam Khanh. Mình sẽ tư vấn chi tiết về giáo án tập luyện và ăn kiêng nhé!",
        time: "5 phút trước",
        isRead: false,
        type: "message",
      },
      {
        id: "1",
        title: "Chào mừng hội viên mới!",
        body: "Cảm ơn bạn đã lựa chọn FIT GYM. Hãy trải nghiệm tập luyện hoặc tham khảo các gói tập cực hot nhé!",
        time: "10 phút trước",
        isRead: false,
        type: "welcome",
      },
      {
        id: "2",
        title: "Mã QR Check-in đã sẵn sàng",
        body: "Thẻ số hội viên ảo đã được kích hoạt. Bạn có thể sử dụng mã QR tại Trang chủ để quét qua cổng tự động.",
        time: "1 giờ trước",
        isRead: false,
        type: "auth",
      },
      {
        id: "3",
        title: "Quà tặng 20% gói Combo PT 1-1",
        body: "Ưu đãi đặc quyền giảm 20% khi đăng ký PT kèm đo chỉ số InBody miễn phí. Nhắn tin hỗ trợ ở tab Chat để đăng ký.",
        time: "1 ngày trước",
        isRead: true,
        type: "promo",
      }
    ];
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<"notif" | "message">("notif");

  // Persist notifications change
  useEffect(() => {
    try {
      localStorage.setItem("fitgym_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Failed to save notifications", e);
    }
  }, [notifications]);

  // Selected subscription package status
  const [activePackage, setActivePackage] = useState<GymPackage | null>(null);

  // Forms state
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regOTP, setRegOTP] = useState<string[]>(["", "", "", ""]);
  const [regPass, setRegPass] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  
  // Simulated alert notification states (OTP SMS bubble)
  const [showOTPBubble, setShowOTPBubble] = useState(false);
  const [bubbleCountdown, setBubbleCountdown] = useState(10);
  
  // HLV AI Chat state
  const [aiChatMessages, setAiChatMessages] = useState<Message[]>([
    {
      id: "ai-init",
      role: "assistant",
      content: "Chào anh/chị nam! Tôi là Huấn luyện viên thể hình ảo của FIT GYM. Hãy hỏi tôi về lộ trình tập, chế độ ăn kiêng, tăng cơ, giảm cân hoặc thông tin gói tập.",
      timestamp: "Bây giờ",
    },
  ]);
  const [aiInputMessage, setAiInputMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // Support list & chat view state
  const [activeSupportContact, setActiveSupportContact] = useState<SupportContact>(SUPPORT_CONTACTS[0]);
  const [supportCategoryFilter, setSupportCategoryFilter] = useState<"all" | "pt" | "support">("all");
  const [supportSearchQuery, setSupportSearchQuery] = useState("");
  const [supportActiveSubTab, setSupportActiveSubTab] = useState<"directory" | "incoming">("directory");
  
  // Message history map for support agents
  const [supportAgentChats, setSupportAgentChats] = useState<Record<string, Message[]>>({
    tiep_tan: [
      {
        id: "msg-init-tt",
        role: "assistant",
        content: SUPPORT_CONTACTS[0].initialMessage,
        timestamp: "Vừa xong",
      }
    ],
    huan_luyen: [
      {
        id: "msg-init-hl",
        role: "assistant",
        content: SUPPORT_CONTACTS[1].initialMessage,
        timestamp: "Vừa xong",
      }
    ],
    support_technical: [
      {
        id: "msg-init-tech",
        role: "assistant",
        content: SUPPORT_CONTACTS[2].initialMessage,
        timestamp: "Hôm qua",
      }
    ]
  });
  const [supportInputMessage, setSupportInputMessage] = useState("");
  const [supportReplyPending, setSupportReplyPending] = useState(false);

  // UI state for showing custom active modal actions the simulator performs
  const [checkoutModalPackage, setCheckoutModalPackage] = useState<GymPackage | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("Chuyển khoản QR");

  // Draggable HLV AI Floating Action Button position inside device area
  const [fabOffset, setFabOffset] = useState({ x: 0, y: 0 });
  const [isDraggingFab, setIsDraggingFab] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const currentOffsetStart = useRef({ x: 0, y: 0 });
  const didDragMoved = useRef(false);

  // Global event tracker for absolute dragging inside phone container bounds
  useEffect(() => {
    if (!isDraggingFab) return;

    const handleGlobalMove = (clientX: number, clientY: number) => {
      const deltaX = clientX - dragStartPos.current.x;
      const deltaY = clientY - dragStartPos.current.y;
      
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        didDragMoved.current = true;
      }
      
      // Clamp coordinates to stay visible on the phone frame (typically width ~385px, height ~795px)
      // Floating button starts at absolute bottom-24, right-14
      // We clamp X between -280 (far left) and 20 (far right)
      // We clamp Y between -620 (top of screen) and 60 (bottom of screen)
      const clampedX = Math.max(-280, Math.min(20, currentOffsetStart.current.x + deltaX));
      const clampedY = Math.max(-620, Math.min(60, currentOffsetStart.current.y + deltaY));
      
      setFabOffset({
        x: clampedX,
        y: clampedY
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      handleGlobalMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      handleGlobalMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onMouseUp = () => {
      setIsDraggingFab(false);
    };

    const onTouchEnd = () => {
      setIsDraggingFab(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDraggingFab]);

  // Payment Transaction History state
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem("fitgym_payment_history2");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load payment history", e);
    }
    return [
      {
        id: "TX-9824",
        packageName: "GÓI CƠ BẢN",
        priceValue: "500.000đ",
        timestamp: "15/05/2026 09:15",
        status: "SUCCESS",
        method: "Ví MoMo",
        expiryDate: "15/06/2026"
      },
      {
        id: "TX-1205",
        packageName: "GÓI TIÊU CHUẨN 6T",
        priceValue: "2.500.000đ",
        timestamp: "01/06/2026 18:30",
        status: "SUCCESS",
        method: "Chuyển khoản QR",
        expiryDate: "01/12/2026"
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("fitgym_payment_history2", JSON.stringify(paymentHistory));
    } catch (e) {
      console.warn("Failed to save payment history", e);
    }
  }, [paymentHistory]);

  // Profile edit states
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editBirthDate, setEditBirthDate] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showProfilePass, setShowProfilePass] = useState(false);

  // Security screen states
  const [secOldPassword, setSecOldPassword] = useState("");
  const [secNewPassword, setSecNewPassword] = useState("");
  const [secConfirmPassword, setSecConfirmPassword] = useState("");
  const [showSecOldPassword, setShowSecOldPassword] = useState(false);
  const [showSecNewPassword, setShowSecNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Collapsible toggle states for Change Password & Service Rating & Security Tab
  const [securityActiveTab, setSecurityActiveTab] = useState<"PASSWORD" | "RATING" | "LANGUAGE">("PASSWORD");
  const [isChangePasswordExpanded, setIsChangePasswordExpanded] = useState(true);
  const [isServiceRatingExpanded, setIsServiceRatingExpanded] = useState(true);
  const [serviceRating, setServiceRating] = useState(5);
  const [serviceCategory, setServiceCategory] = useState("PT");
  const [serviceFeedbackText, setServiceFeedbackText] = useState("");
  const [isSubmittingServiceFeedback, setIsSubmittingServiceFeedback] = useState(false);
  
  const [serviceReviews, setServiceReviews] = useState<Array<{
    id: string;
    phoneNumber: string;
    rating: number;
    category: string;
    text: string;
    date: string;
  }>>(() => {
    const saved = localStorage.getItem("fitgym_service_reviews");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: "rev_1", phoneNumber: "091****899", rating: 5, category: "PT", text: "Huấn luyện viên rất nhiệt tình và kèm chu đáo tuyệt vời!", date: "15/06/2026" },
      { id: "rev_2", phoneNumber: "001****312", rating: 4, category: "GYM", text: "Trang thiết bị hiện đại, phòng tập rất sạch sẽ rộng rãi.", date: "12/06/2026" }
    ];
  });

  const handleSubmittingServiceFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFeedbackText.trim()) {
      showToast(language === "VI" ? "Vui lòng nhập nội dung đánh giá!" : "Please write down your feedback!");
      return;
    }
    setIsSubmittingServiceFeedback(true);
    setTimeout(() => {
      const maskPhone = (phone: string) => {
        if (!phone) return "****";
        if (phone.length <= 6) return phone.substring(0, 3) + "***";
        return phone.substring(0, 3) + "***" + phone.substring(phone.length - 3);
      };

      const dateObj = new Date();
      const customDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

      const newReview = {
        id: "rev_" + Date.now(),
        phoneNumber: maskPhone(session.phoneNumber || "09x-xxxx-xxx"),
        rating: serviceRating,
        category: serviceCategory,
        text: serviceFeedbackText,
        date: customDate
      };

      const updated = [newReview, ...serviceReviews];
      setServiceReviews(updated);
      localStorage.setItem("fitgym_service_reviews", JSON.stringify(updated));

      setIsSubmittingServiceFeedback(false);
      setServiceFeedbackText("");
      setServiceRating(5);
      showToast(language === "VI" ? "Cảm ơn bạn đã gửi đánh giá dịch vụ!" : "Thank you for submitting your feedback!");
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secOldPassword) {
      showToast(language === "VI" ? "Vui lòng nhập mật khẩu hiện tại!" : "Please enter your current password!");
      return;
    }
    if (secOldPassword !== session.password) {
      showToast(language === "VI" ? "Mật khẩu hiện tại không chính xác!" : "Incorrect current password!");
      return;
    }
    if (!secNewPassword) {
      showToast(language === "VI" ? "Vui lòng nhập mật khẩu mới!" : "Please enter a new password!");
      return;
    }
    if (secNewPassword.length < 6) {
      showToast(language === "VI" ? "Mật khẩu mới tối thiểu 6 ký tự!" : "New password must be at least 6 characters!");
      return;
    }
    if (secNewPassword !== secConfirmPassword) {
      showToast(language === "VI" ? "Mật khẩu xác nhận không trùng khớp!" : "Confirm password does not match!");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      // update session
      setSession((prev) => ({
        ...prev,
        password: secNewPassword
      }));

      // update registered users
      setRegisteredUsers((prev) => {
        if (prev[session.phoneNumber]) {
          return {
            ...prev,
            [session.phoneNumber]: {
              ...prev[session.phoneNumber],
              password: secNewPassword
            }
          };
        }
        return prev;
      });

      setIsUpdatingPassword(false);
      setSecOldPassword("");
      setSecNewPassword("");
      setSecConfirmPassword("");
      showToast(language === "VI" ? "Đổi mật khẩu thành công!" : "Password updated successfully!");
      setCurrentScreen("HOME");
    }, 1000);
  };

  useEffect(() => {
    setEditName(session.fullName || "");
    setEditPassword(session.password || "");
    setEditAddress(session.address || "123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh");
    setEditGender(session.gender || "Nam");
    setEditBirthDate(session.birthDate || "1995-10-15");
  }, [session.fullName, session.password, session.address, session.gender, session.birthDate]);

  // Flat list of all incoming messages from staff/support
  const incomingMessages = Object.entries(supportAgentChats).flatMap(([agentId, messages]) => {
    const contact = SUPPORT_CONTACTS.find((c) => c.id === agentId);
    if (!contact) return [];
    
    return (messages as Message[])
      .filter((msg) => msg.role === "assistant")
      .map((msg) => ({
        ...msg,
        agent: contact,
      }));
  });

  const getMessageTimeFactor = (id: string) => {
    if (id.startsWith("reply-")) return parseInt(id.replace("reply-", ""), 10) || 0;
    if (id.startsWith("user-support-")) return parseInt(id.replace("user-support-", ""), 10) || 0;
    return 1; // Initial messages
  };

  const sortedIncomingMessages = [...incomingMessages].sort((a, b) => {
    return getMessageTimeFactor(b.id) - getMessageTimeFactor(a.id);
  });

  // Refs for auto scroll in chats
  const aiChatEndRef = useRef<HTMLDivElement>(null);
  const supportChatEndRef = useRef<HTMLDivElement>(null);

  // Auto clock update inside physical shell
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      setSystetime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Show Toast messaging helper
  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Scroll to bottom in chats
  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatMessages, loadingAI]);

  useEffect(() => {
    supportChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportAgentChats, supportReplyPending]);

  // Handle triggered OTP countdown trigger
  useEffect(() => {
    let interval: any;
    if (showOTPBubble && bubbleCountdown > 0) {
      interval = setInterval(() => {
        setBubbleCountdown((prev) => prev - 1);
      }, 1000);
    } else if (bubbleCountdown === 0) {
      setShowOTPBubble(false);
    }
    return () => clearInterval(interval);
  }, [showOTPBubble, bubbleCountdown]);

  // Dismiss OTP SMS message immediately if user leaves REGISTER_STEP_2 screen
  useEffect(() => {
    if (currentScreen !== "REGISTER_STEP_2") {
      setShowOTPBubble(false);
    }
  }, [currentScreen]);

  // Simulated auto responses from Support Staff
  const promptSupportStaffReply = (agentId: string, userText: string) => {
    setSupportReplyPending(true);
    setTimeout(() => {
      let replyText = "Cảm ơn anh/chị đã gửi tin nhắn. Em ghi nhận ý kiến và sẽ phản hồi chi tiết cho anh/chị ngay ạ!";
      const userLower = userText.toLowerCase();

      if (agentId === "tiep_tan") {
        if (userLower.includes("gói") || userLower.includes("dk") || userLower.includes("đăng ký")) {
          replyText = "Dạ, để đăng ký gói tập nhanh nhất, anh/chị có thể chọn gói tập ngay trên tab GÓI TẬP ở màn hình này, hoặc đến ngay quầy lễ tân để em hỗ trợ quẹt thẻ kích hoạt tức thì ạ. Đang có chương trình ưu đãi giảm giá tốt đó anh/chị nhé!";
        } else if (userLower.includes("hoàn tiền") || userLower.includes("hủy")) {
          replyText = "Dạ, đối với quy trình hoàn tiền hoặc xin bảo lưu thẻ tập, anh/chị vui lòng mang theo CMND/CCCD bản gốc đến quầy lễ tân chi nhánh chính để quản lý bên em xác nhận tờ khai và duyệt hồ sơ trong vòng 1-3 ngày làm việc ạ.";
        } else if (userLower.includes("giờ") || userLower.includes("mở cửa")) {
          replyText = "Chào anh/chị, FIT GYM mở cửa hoạt động liên tục các ngày trong tuần từ 05:00 sáng đến 22:00 đêm ạ. Chúc anh/chị có một buổi tập luyện hiệu quả!";
        }
      } else if (agentId === "huan_luyen") {
        if (userLower.includes("ngực") || userLower.includes("bài tập")) {
          replyText = "Tập ngực muốn dày và rộng thì ưu tiên đẩy tạ Incline Dumbbell trước nhé bạn ơi. Chú ý khóa bả vai lại để tránh chấn thương khớp vai nha. Chiều qua phòng tập gặp mình, mình chỉ trực tiếp posture cho!";
        } else if (userLower.includes("giảm cân") || userLower.includes("béo") || userLower.includes("mỡ")) {
          replyText = "Chào bạn! Quy tắc cốt lõi là thâm hụt calo (Caloric Deficit). Bạn nên kết hợp tập tạ (khối lượng lớn) cùng 20-30 phút Cardio ở nhịp tim Zone 2 cuối buổi để đốt mỡ hiệu quả nhất.";
        } else if (userLower.includes("protein") || userLower.includes("ăn gì")) {
          replyText = "Bạn nên bổ sung tối thiểu 1.5g Protein mỗi kg trọng lượng cơ thể. Nhóm thực phẩm khuyên dùng gồm: ức gà bỏ da, lòng trắng trứng, thịt bò nạc, cá thu/cá hồi hoặc bột Whey tăng cơ!";
        }
      } else if (agentId === "support_technical") {
        replyText = "Hệ thống Checkin phòng tập vừa được nâng cấp bảo mật. Nếu thẻ số của bạn bị khóa QR, vui lòng chọn mua gói tập bất kỳ trên tab để hệ thống tự động kích hoạt mã QR mở khóa nhé bạn!";
      }

      const agentReply: Message = {
        id: `reply-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: "Vừa xong",
      };

      setSupportAgentChats((prev) => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), agentReply],
      }));
      
      // Auto-trigger a system notification for the incoming message
      const agentObj = SUPPORT_CONTACTS.find((c) => c.id === agentId);
      const agentName = agentObj ? agentObj.name : (language === "VI" ? "Nhân viên hỗ trợ" : "Support Staff");
      
      const newMsgNotif: AppNotification = {
        id: `msg-${agentId}-${Date.now()}`,
        title: language === "VI" ? `Tin nhắn mới từ ${agentName}` : `New message from ${agentName}`,
        body: replyText,
        time: language === "VI" ? "Vừa xong" : "Just now",
        isRead: false,
        type: "message"
      };
      setNotifications((prev) => [newMsgNotif, ...prev]);

      setSupportReplyPending(false);
    }, 1500);
  };

  // Actions handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) {
      showToast(language === "VI" ? "Vui lòng nhập Số điện thoại!" : "Please enter Phone number!");
      return;
    }
    if (!loginPass) {
      showToast(language === "VI" ? "Vui lòng nhập Mật khẩu!" : "Please enter Password!");
      return;
    }

    // Check if the number is registered in our local mock database
    const registeredUser = registeredUsers[loginPhone];

    if (registeredUser) {
      // Must check correct password for registered accounts
      if (registeredUser.password === loginPass) {
        setSession((prev) => ({
          ...prev,
          phoneNumber: loginPhone,
          fullName: registeredUser.fullName,
          password: registeredUser.password,
          isRegistered: true,
          isLoggedIn: true,
        }));
        setCurrentScreen("HOME");
        showToast(language === "VI" ? "Đăng nhập thành công!" : "Login successfully!");
      } else {
        showToast(
          language === "VI"
            ? "Mật khẩu cho tài khoản này chưa chính xác!"
            : "Incorrect password for this account!"
        );
      }
    } else if (loginPhone === "demo") {
      setSession((prev) => ({
        ...prev,
        phoneNumber: "0012312312",
        fullName: "KHÁCH QUEN",
        isRegistered: true,
        isLoggedIn: true,
      }));
      setCurrentScreen("HOME");
      showToast(language === "VI" ? "Đăng nhập thành công với tài khoản Demo!" : "Demo login successfully!");
    } else if (loginPhone.length >= 4) {
      // General bypass/guest flow for other numbers
      setSession((prev) => ({
        ...prev,
        phoneNumber: loginPhone,
        fullName: "KHÁCH VÃNG LAI",
        isLoggedIn: true,
      }));
      setCurrentScreen("HOME");
      showToast(language === "VI" ? "Đăng nhập thành công (Khách vãng lai)!" : "Logged in successfully as Guest!");
    } else {
      showToast(
        language === "VI"
          ? "Số điện thoại hoặc Mật khẩu chưa chính xác! (Nhập 'demo' để vào nhanh)"
          : "Incorrect Phone or Password! (Enter 'demo' to skip)"
      );
    }
  };

  const handleRegisterStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast(language === "VI" ? "Vui lòng nhập Họ và Tên!" : "Please enter Full Name!");
      return;
    }
    if (!regPhone || regPhone.length < 8) {
      showToast(language === "VI" ? "Số điện thoại đăng ký không hợp lệ!" : "Invalid Phone Number!");
      return;
    }

    // Save temporal info
    setSession((prev) => ({
      ...prev,
      fullName: regName.toUpperCase(),
      phoneNumber: regPhone,
    }));

    // Trigger fake SMS drop down banner
    setShowOTPBubble(true);
    setBubbleCountdown(12);

    // Go to next step
    setCurrentScreen("REGISTER_STEP_2");
    showToast(language === "VI" ? "Đã gửi mã đăng ký OTP!" : "OTP registration code sent!");
  };

  const handleOTPAutoFill = () => {
    setRegOTP(["1", "3", "2", "9"]);
    setShowOTPBubble(false);
    showToast(language === "VI" ? "Đã tự động điền mã OTP: 1329!" : "Autofilled OTP: 1329!");
  };

  const handleOTPSingleInput = (val: string, index: number) => {
    if (/^[0-9]$/.test(val) || val === "") {
      const newOTP = [...regOTP];
      newOTP[index] = val;
      setRegOTP(newOTP);
      
      // Auto focus next input
      if (val !== "" && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOTPSubmit = () => {
    const fullOtpString = regOTP.join("");
    if (fullOtpString === "1329" || fullOtpString.length === 4) {
      setCurrentScreen("REGISTER_STEP_3");
      showToast(language === "VI" ? "Xác thực OTP thành công!" : "OTP Verified successfully!");
    } else {
      showToast(language === "VI" ? "Mã xác thực không đúng! Hãy nhập 1329 hoặc bấm vào thông báo." : "Incorrect OTP! Try 1329.");
    }
  };

  const handleRegisterStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPass.length < 6) {
      showToast(language === "VI" ? "Mật khẩu tối thiểu 6 ký tự!" : "Password must be at least 6 characters!");
      return;
    }
    if (regPass !== regConfirmPass) {
      showToast(language === "VI" ? "Mật khẩu xác nhận không khớp!" : "Confirm password doesn't match!");
      return;
    }

    // Complete registration
    setSession((prev) => ({
      ...prev,
      password: regPass,
      isRegistered: true,
      isLoggedIn: true,
    }));

    // Save to registeredUsers list
    setRegisteredUsers((prev) => ({
      ...prev,
      [regPhone]: { fullName: regName.toUpperCase(), password: regPass }
    }));

    // Add specific custom notification for newly registered member
    const newWelcomeNotif: AppNotification = {
      id: Date.now().toString(),
      title: language === "VI" ? `Chào mừng ${regName.toUpperCase()}!` : `Welcome ${regName.toUpperCase()}!`,
      body: language === "VI"
        ? `Tài khoản với SĐT ${regPhone} đã đăng ký thành công. Chúc bạn có những giờ phút tập luyện hứng khởi tại FIT GYM!`
        : `Your account with phone number ${regPhone} is active. Enjoy your workouts at FIT GYM!`,
      time: language === "VI" ? "Vừa xong" : "Just now",
      isRead: false,
      type: "welcome"
    };
    setNotifications((prev) => [newWelcomeNotif, ...prev]);

    setCurrentScreen("HOME");
    showToast(language === "VI" ? "Thiết lập mật khẩu thành công! Chào mừng hội viên mới!" : "Password set successfully! Welcome!");
  };

  // Sign out helper
  const handleLogoutAction = () => {
    setSession((prev) => ({ ...prev, isLoggedIn: false }));
    setIsDropdownOpen(false);
    setIsNotificationsOpen(false);
    setShowLogoutConfirm(false);
    setCurrentScreen("LOGIN");
    setLoginPhone("");
    setLoginPass("");
    showToast(language === "VI" ? "Đã đăng xuất tài khoản!" : "Sign out successfully!");
  };

  // Save profile changes helper
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast(language === "VI" ? "Họ và tên không được để trống!" : "Full name cannot be empty!");
      return;
    }
    if (!editAddress.trim()) {
      showToast(language === "VI" ? "Địa chỉ không được để trống!" : "Address cannot be empty!");
      return;
    }
    if (!editGender.trim()) {
      showToast(language === "VI" ? "Vui lòng chọn giới tính!" : "Please select your gender!");
      return;
    }
    if (!editBirthDate.trim()) {
      showToast(language === "VI" ? "Ngày sinh không được để trống!" : "Birth date cannot be empty!");
      return;
    }
    if (editPassword && editPassword.length < 6) {
      showToast(language === "VI" ? "Mật khẩu tối thiểu phải từ 6 ký tự!" : "Password must be at least 6 characters!");
      return;
    }

    setIsSavingProfile(true);
    setTimeout(() => {
      setSession(prev => {
        const updated = {
          ...prev,
          fullName: editName.trim(),
          password: editPassword,
          address: editAddress.trim(),
          gender: editGender.trim(),
          birthDate: editBirthDate.trim(),
        };
        // Also update registered users list
        setRegisteredUsers(regPrev => {
          if (regPrev[prev.phoneNumber]) {
            return {
              ...regPrev,
              [prev.phoneNumber]: {
                ...regPrev[prev.phoneNumber],
                fullName: editName.trim().toUpperCase(),
                password: editPassword || regPrev[prev.phoneNumber]?.password,
                address: editAddress.trim(),
                gender: editGender.trim(),
                birthDate: editBirthDate.trim(),
              }
            };
          }
          return regPrev;
        });
        return updated;
      });
      setIsSavingProfile(false);
      setIsEditingProfile(false);
      showToast(language === "VI" ? "Cập nhật hồ sơ cá nhân thành công!" : "Profile updated successfully!");
    }, 600);
  };

  // Increment workout sessions counter
  const incrementWorkouts = () => {
    setSession(prev => {
      const newVal = (prev.workoutsCount || 0) + 1;
      showToast(language === "VI" ? `Tuyệt vời! Ghi nhận buổi tập thành công: ${newVal}` : `Great! Workout session recorded: ${newVal}`);
      return {
        ...prev,
        workoutsCount: newVal
      };
    });
  };

  // Notification action handlers
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast(language === "VI" ? "Đã đọc tất cả thông báo!" : "Marked all as read!");
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast(language === "VI" ? "Đã xóa toàn bộ thông báo!" : "Cleared all notifications!");
  };

  const handleNotificationClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.type === "message") {
      const parts = n.id.split("-");
      if (parts.length >= 3) {
        const agentId = parts[1];
        const contactObj = SUPPORT_CONTACTS.find((c) => c.id === agentId);
        if (contactObj) {
          setActiveSupportContact(contactObj);
          setCurrentScreen("SUPPORT_CHAT");
          setIsNotificationsOpen(false);
          return;
        }
      }
      // Fallback to Support incoming messages list
      setCurrentScreen("SUPPORT_LIST");
      setSupportActiveSubTab("incoming");
      setIsNotificationsOpen(false);
    }
  };

  // API Call to chatbot endpoint
  const sendAIMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInputMessage.trim()) return;

    const userMessageText = aiInputMessage;
    setAiInputMessage("");

    // Append user message immediately
    const userMsgObj: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessageText,
      timestamp: "Bây giờ",
    };
    setAiChatMessages((prev) => [...prev, userMsgObj]);
    setLoadingAI(true);

    try {
      const response = await fetch("/api/gym-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessageText,
          // Exclude first message, just send others
          history: aiChatMessages.slice(1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      
      const responseMsgObj: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Tôi không nghe rõ lắm, bạn có thể giải thích thêm không?",
        timestamp: "Vừa xong",
      };
      setAiChatMessages((prev) => [...prev, responseMsgObj]);
    } catch (err) {
      console.error(err);
      // Fallback response inside client directly
      setTimeout(() => {
        const errorReplyObj: Message = {
          id: `ai-error-${Date.now()}`,
          role: "assistant",
          content: "Để cải thiện cơ bắp nhanh nhất, hãy kết hợp các bài Bench Press và Protein dinh dưỡng đầy đủ bạn nhé. Rất tiếc, AI Coach tạm thời bị gián đoạn mạng, hãy thử lại sau!",
          timestamp: "Hệ thống",
        };
        setAiChatMessages((prev) => [...prev, errorReplyObj]);
      }, 700);
    } finally {
      setLoadingAI(false);
    }
  };

  // Send support agent message
  const sendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInputMessage.trim()) return;

    const typedMsg = supportInputMessage;
    setSupportInputMessage("");

    const newMsg: Message = {
      id: `user-support-${Date.now()}`,
      role: "user",
      content: typedMsg,
      timestamp: "Bây giờ",
    };

    const agentId = activeSupportContact.id;
    setSupportAgentChats((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), newMsg],
    }));

    promptSupportStaffReply(agentId, typedMsg);
  };

  // Confirm check out simulator package
  const handleConfirmPurchase = () => {
    if (checkoutModalPackage) {
      setActivePackage(checkoutModalPackage);
      setCheckoutModalPackage(null);
      showToast(
        language === "VI"
          ? `Mô phỏng: Đã kích hoạt ${checkoutModalPackage.name}!`
          : `Simulated: Activated ${checkoutModalPackage.name}!`
      );
      
      // Add a notification for package subscription
      const newNotif: AppNotification = {
        id: Date.now().toString(),
        title: language === "VI" ? "Kích hoạt gói tập mới!" : language === "ZH" ? "新健身方案已激活！" : "New package activated!",
        body: language === "VI"
          ? `Bạn đã thanh toán thành công gói ${checkoutModalPackage.name}. Mã QR Check-in ở Trang Chủ đã sẵn sàng mở khóa!`
          : language === "ZH"
          ? `您已成功购买 ${checkoutModalPackage.name}。您的签到二维码已在首页生成！`
          : `You have successfully purchased ${checkoutModalPackage.name}. Your Check-in QR code is ready on Home screen!`,
        time: language === "VI" ? "Vừa xong" : language === "ZH" ? "刚刚" : "Just now",
        isRead: false,
        type: "billing"
      };
      setNotifications((prev) => [newNotif, ...prev]);

      // Calculate expiration date based on package duration
      let monthsToAdd = 1;
      const pkgId = checkoutModalPackage.id;
      const pkgName = checkoutModalPackage.name.toLowerCase();
      const pkgDur = checkoutModalPackage.durationLabel.toLowerCase();
      if (pkgId.includes("12") || pkgName.includes("12") || pkgDur.includes("12")) {
        monthsToAdd = 12;
      } else if (pkgId.includes("6") || pkgName.includes("6") || pkgDur.includes("6")) {
        monthsToAdd = 6;
      } else if (pkgId.includes("3") || pkgName.includes("3") || pkgDur.includes("3")) {
        monthsToAdd = 3;
      }
      const expDateObj = new Date();
      expDateObj.setMonth(expDateObj.getMonth() + monthsToAdd);
      const calculatedExpiry = expDateObj.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      // Add corresponding payment transaction history row
      const newTx: PaymentTransaction = {
        id: "TX-" + Math.floor(1000 + Math.random() * 9000),
        packageName: checkoutModalPackage.name.toUpperCase(),
        priceValue: checkoutModalPackage.priceValue,
        timestamp: new Date().toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }) + " " + new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        status: "SUCCESS",
        method: selectedPaymentMethod,
        expiryDate: calculatedExpiry
      };
      setPaymentHistory((prev) => [newTx, ...prev]);

      // Automatically navigate home
      setCurrentScreen("HOME");
    }
  };

  const t = (vi: string, en: string, zh: string) => {
    if (language === "VI") return vi;
    if (language === "ZH") return zh;
    return en;
  };

  const getPkgName = (p: any) => {
    if (!p) return "";
    if (language === "EN" && p.nameEn) return p.nameEn;
    if (language === "ZH" && p.nameZh) return p.nameZh;
    return p.name;
  };

  const getPkgDuration = (p: any) => {
    if (!p) return "";
    if (language === "EN" && p.durationLabelEn) return p.durationLabelEn;
    if (language === "ZH" && p.durationLabelZh) return p.durationLabelZh;
    return p.durationLabel;
  };

  const getPkgDesc = (p: any) => {
    if (!p) return "";
    if (language === "EN" && p.descriptionEn) return p.descriptionEn;
    if (language === "ZH" && p.descriptionZh) return p.descriptionZh;
    return p.description;
  };

  const getPkgFeatures = (p: any) => {
    if (!p) return [];
    if (language === "EN" && p.featuresEn) return p.featuresEn;
    if (language === "ZH" && p.featuresZh) return p.featuresZh;
    return p.features;
  };

  const getContactName = (c: any) => {
    if (!c) return "";
    if (language === "EN" && c.nameEn) return c.nameEn;
    if (language === "ZH" && c.nameZh) return c.nameZh;
    return c.name;
  };

  const getContactRole = (c: any) => {
    if (!c) return "";
    if (language === "EN" && c.roleLabelEn) return c.roleLabelEn;
    if (language === "ZH" && c.roleLabelZh) return c.roleLabelZh;
    return c.roleLabel;
  };

  const getContactBio = (c: any) => {
    if (!c) return "";
    if (language === "EN" && c.bioEn) return c.bioEn;
    if (language === "ZH" && c.bioZh) return c.bioZh;
    return c.bio;
  };

  const getContactInitial = (c: any) => {
    if (!c) return "";
    if (language === "EN" && c.initialMessageEn) return c.initialMessageEn;
    if (language === "ZH" && c.initialMessageZh) return c.initialMessageZh;
    return c.initialMessage;
  };

  const getTranslatedTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    if (timestamp === "Bây giờ") {
      return t("Bây giờ", "Now", "现在");
    }
    if (timestamp === "Vừa xong") {
      return t("Vừa xong", "Just now", "刚才");
    }
    if (timestamp === "Hôm qua") {
      return t("Hôm qua", "Yesterday", "昨天");
    }
    return timestamp;
  };

  const getTranslatedMessageContent = (msg: any) => {
    if (!msg) return "";
    if (msg.id === "ai-init") {
      return t(
        `Chào anh/chị ${session.fullName || "hội viên"}! Tôi là Huấn luyện viên thể hình ảo của FIT GYM. Hãy hỏi tôi về lộ trình tập, chế độ ăn kiêng, tăng cơ, giảm cân hoặc thông tin gói tập.`,
        `Hello ${session.fullName || "member"}! I am your virtual FIT GYM AI Coach. Ask me about workouts, diets, bulking, weight loss, or membership plan details.`,
        `您好，尊贵的${session.fullName || "会员"}！我是您的 FIT GYM 智能 AI 私人教练。请随时向我咨询健美锻炼计划、营养膳食配餐或各类会员卡包资费。`
      );
    }
    if (msg.id === "msg-init-tt") {
      const contact = SUPPORT_CONTACTS.find((c) => c.id === "tiep_tan");
      return contact ? getContactInitial(contact) : msg.content;
    }
    if (msg.id === "msg-init-hl") {
      const contact = SUPPORT_CONTACTS.find((c) => c.id === "huan_luyen");
      return contact ? getContactInitial(contact) : msg.content;
    }
    if (msg.id === "msg-init-tech") {
      const contact = SUPPORT_CONTACTS.find((c) => c.id === "support_technical");
      return contact ? getContactInitial(contact) : msg.content;
    }
    return msg.content;
  };

  const renderLanguageDropdown = () => {
    return (
      <select
        value={language}
        onChange={(e) => {
          const nextLang = e.target.value as "VI" | "EN" | "ZH";
          setLanguage(nextLang);
          showToast(
            nextLang === "VI"
              ? "Đã chuyển sang tiếng Việt!"
              : nextLang === "ZH"
              ? "已切换至中文！"
              : "Switched language to English!"
          );
        }}
        className="bg-[#121214] border border-zinc-800 hover:border-[#D2FF00] text-zinc-300 hover:text-white px-2 py-0.5 rounded text-[9.5px] font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D2FF00]/40 transition duration-150 shadow-sm"
      >
        <option value="VI" className="bg-[#121214] text-white">Tiếng Việt</option>
        <option value="EN" className="bg-[#121214] text-white">English</option>
        <option value="ZH" className="bg-[#121214] text-white">中文</option>
      </select>
    );
  };

  const isLoggedScreen = session.isLoggedIn && !["LOGIN", "REGISTER_STEP_1", "REGISTER_STEP_2", "REGISTER_STEP_3"].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#3C4A50] text-slate-200 font-sans overflow-x-hidden relative selection:bg-[#D2FF00] selection:text-black">
      {/* Centered device layout */}
      <div className="min-h-screen w-full relative z-10 flex flex-col items-center justify-center py-6 px-4">
        {/* Centered phone wrapper */}
        <div className="flex justify-center items-center py-4 relative">
            
            {/* Phone Outer Shell Chassis */}
            <div id="phone-shell-chassis" className="relative shrink-0 w-[385px] h-[795px] bg-slate-950 rounded-[55px] border-[10px] border-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.5)] p-2.5 flex flex-col ring-[12px] ring-slate-900/40">
              
              {/* Phone Physical Volume Keys & Locks */}
              <div className="absolute -left-[10px] top-[140px] w-[5px] h-[45px] bg-slate-800 rounded-l" />
              <div className="absolute -left-[10px] top-[195px] w-[5px] h-[45px] bg-slate-800 rounded-l" />
              <div className="absolute -right-[10px] top-[170px] w-[5px] h-[65px] bg-slate-800 rounded-r" />
  
              {/* Screenglass Overlay */}
              <div className="w-full h-full bg-[#050505] rounded-[45px] relative flex flex-col overflow-hidden text-zinc-300 select-none">
                
                {/* 1. Phone Top Status Bar (Wifi, Clock, Cellular metrics, Notch island) */}
                <div className="w-full h-[44px] shrink-0 bg-slate-950 flex items-center justify-between px-7 relative z-50 border-b border-slate-900/40">
                  {/* Local Updating Clock */}
                  <span className="font-mono text-[13px] font-bold text-slate-200 tracking-widest">{systetime}</span>
                  
                  {/* Capsule Shaped Notch Dynamic Island */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[100px] h-[25px] bg-slate-900 rounded-full flex items-center justify-between px-3 pr-2.5 border border-slate-800/40">
                    {/* Small camera dot and sensor light mimicking modern device */}
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)] animate-pulse" />
                  </div>
  
                  {/* Right hand network / battery icons */}
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="text-[10px] font-extrabold tracking-tighter text-[#D2FF00]">5G</span>
                    {/* Simulated solid battery bar in green screen metric outline */}
                    <div className="w-6 h-[11px] border border-slate-700 rounded-sm p-[1px] flex">
                      <div className="h-full w-4/5 rounded-2xs bg-green-400" />
                    </div>
                  </div>
                </div>

                {/* APP BAR TOP NAVIGATION (For logged-in view only) - Positioned statically under status bar, outside of the scrollable container */}
                {isLoggedScreen && (
                  <div id="phone-inner-header" className="h-[55px] shrink-0 bg-black/90 backdrop-blur-md flex items-center justify-between px-5 z-[45] pt-1 border-b border-zinc-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    
                    {/* Left logo bar */}
                    <div className="flex items-center gap-1.5">
                      <Dumbbell className="text-[#D2FF00] size-4 rotate-45" />
                      <span className="font-display italic text-lg tracking-wider text-white font-extrabold select-none">
                        FIT<span className="text-[#D2FF00]">.GYM APP</span>
                      </span>
                    </div>

                    {/* Right settings/bell & user avatar drop toggler */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            setIsDropdownOpen(false);
                          }}
                          className="p-1 -m-1 focus:outline-none focus:ring-0 cursor-pointer text-zinc-400 hover:text-white relative bg-transparent border-0 transition"
                        >
                          <Bell className="size-4" />
                          {notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#D2FF00] text-black text-[7.5px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-[0_0_6px_rgba(210,255,0,0.6)] z-10">
                              {notifications.filter(n => !n.isRead).length}
                            </span>
                          )}
                        </button>

                      </div>

                      {/* Avatar Button */}
                      <div className="relative">
                        <button
                           id="avatar-button"
                           onClick={() => {
                             setIsDropdownOpen(!isDropdownOpen);
                             setIsNotificationsOpen(false);
                           }}
                           className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#D2FF00] font-bold text-xs flex items-center justify-center duration-150 cursor-pointer shadow-[0_0_8px_rgba(210,255,0,0.1)]"
                        >
                          {session.fullName ? session.fullName[0] : "N"}
                        </button>

                        {/* Profile dropdown matches image 10 precisely */}
                        {isDropdownOpen && (
                          <div className="absolute right-0 top-9 w-[190px] bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl z-[900] p-1.5 backdrop-blur-lg animate-fade-in">
                            
                            {/* Header profile title */}
                            <div className="p-2 border-b border-slate-800/60 mb-1">
                              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                                {t("Hội viên PLATINUM", "PLATINUM MEMBER", "白金会员")}
                              </p>
                              <p className="text-xs text-white uppercase font-bold truncate mt-1">{session.fullName || "NAM"}</p>
                            </div>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setLastScreen(currentScreen);
                                setCurrentScreen("PROFILE");
                              }}
                              className="w-full text-left p-2 hover:bg-slate-800/80 rounded-xl text-slate-350 hover:text-white text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                            >
                              <User className="size-3.5 text-slate-450" />
                              <span>{t("Hồ sơ cá nhân", "Personal profile", "个人基本信息")}</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setLastScreen(currentScreen);
                                setCurrentScreen("PAYMENT_HISTORY");
                              }}
                              className="w-full text-left p-2 hover:bg-slate-800/80 rounded-xl text-slate-350 hover:text-white text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                            >
                              <History className="size-3.5 text-slate-450" />
                              <span>{t("Lịch sử thanh toán", "Payment history", "账单与支付历史")}</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setLastScreen(currentScreen);
                                setCurrentScreen("SECURITY");
                              }}
                              className="w-full text-left p-2 hover:bg-slate-800/80 rounded-xl text-slate-350 hover:text-white text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                            >
                              <Shield className="size-3.5 text-slate-450" />
                              <span>{t("Cài đặt bảo mật", "Security settings", "账号安全设置")}</span>
                            </button>

                            <hr className="border-slate-800/50 my-1" />

                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setShowLogoutConfirm(true);
                              }}
                              className="w-full text-left p-2 hover:bg-red-950/40 rounded-xl text-red-500 hover:text-red-400 text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                            >
                              <LogOut className="size-3.5" />
                              <span>{t("Đăng xuất cổng", "Sign out", "退出登陆")}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications dropdown list - Pinned globally to the chassis screen (doesn't scroll/float when cuộn lên) */}
                {isLoggedScreen && isNotificationsOpen && (
                  <div className="absolute left-3.5 right-3.5 top-[99px] bg-slate-900/98 border border-slate-800 rounded-3xl shadow-[0_15px_45px_0_rgba(0,0,0,0.9)] z-[150] p-3.5 backdrop-blur-xl animate-fade-in flex flex-col gap-3 text-left">
                    {/* Header title */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Bell className="size-3.5 text-[#D2FF00]" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                          {language === "VI" ? "THÔNG BÁO & TIN NHẮN" : "NOTIFICATIONS & CHAT"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {notificationTab === "notif" && notifications.some(n => n.type !== "message" && !n.isRead) && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            type="button"
                            className="text-[9px] text-[#D2FF00] hover:underline font-medium cursor-pointer bg-transparent border-0"
                          >
                            {language === "VI" ? "Đọc tất cả" : "Read all"}
                          </button>
                        )}
                        {notificationTab === "message" && notifications.some(n => n.type === "message" && !n.isRead) && (
                          <button
                            onClick={() => {
                              notifications.filter(n => n.type === "message").forEach(n => markNotificationAsRead(n.id));
                              showToast(language === "VI" ? "Đã đọc tất cả tin nhắn" : "Marked all messages as read");
                            }}
                            type="button"
                            className="text-[9px] text-[#D2FF00] hover:underline font-medium cursor-pointer bg-transparent border-0"
                          >
                            {language === "VI" ? "Đọc tất cả" : "Read all"}
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            type="button"
                            className="text-[9px] text-zinc-500 hover:text-rose-450 hover:underline font-medium cursor-pointer bg-transparent border-0"
                          >
                            {language === "VI" ? "Xóa hết" : "Clear all"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Integrated Tab switcher inside notifications */}
                    <div className="flex bg-zinc-950 p-[3px] rounded-xl border border-zinc-900/80 shrink-0 select-none">
                      <button
                        onClick={() => setNotificationTab("notif")}
                        type="button"
                        className={`flex-1 py-1.5 rounded-lg font-mono text-[9px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition cursor-pointer border-0 ${
                          notificationTab === "notif" ? "bg-[#D2FF00] text-black" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Bell className="size-3" />
                        <span>{language === "VI" ? "Thông báo chung" : "System Notifs"}</span>
                        {notifications.filter(n => n.type !== "message" && !n.isRead).length > 0 && (
                          <span className={`px-1 rounded text-[7.5px] font-sans font-extrabold ${notificationTab === "notif" ? "bg-black text-white" : "bg-[#D2FF00] text-black animate-pulse"}`}>
                            {notifications.filter(n => n.type !== "message" && !n.isRead).length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setNotificationTab("message")}
                        type="button"
                        className={`flex-1 py-1.5 rounded-lg font-mono text-[9px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition cursor-pointer border-0 ${
                          notificationTab === "message" ? "bg-[#D2FF00] text-black" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <MessageSquare className="size-3" />
                        <span>{language === "VI" ? "Tin nhắn đến" : "Support Inbox"}</span>
                        {notifications.filter(n => n.type === "message" && !n.isRead).length > 0 && (
                          <span className={`px-1 rounded text-[7.5px] font-sans font-extrabold ${notificationTab === "message" ? "bg-black text-white" : "bg-[#D2FF00] text-black animate-pulse"}`}>
                            {notifications.filter(n => n.type === "message" && !n.isRead).length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Notifications / Messages list display area */}
                    <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2 pr-0.5 custom-scrollbar">
                      {notificationTab === "notif" && (
                        notifications.filter(n => n.type !== "message").length === 0 ? (
                          <div className="text-center py-8 text-zinc-500 text-[10px] font-sans">
                            {language === "VI" ? "Không có thông báo hệ thống nào" : "No system notifications"}
                          </div>
                        ) : (
                          notifications.filter(n => n.type !== "message").map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-2 rounded-xl border transition-all duration-150 relative cursor-pointer group text-left ${
                                n.isRead
                                  ? "bg-slate-950/40 border-slate-905/60 hover:bg-slate-900/50"
                                  : "bg-gradient-to-br from-slate-900 to-slate-850 border-zinc-800/80 shadow-sm"
                              }`}
                            >
                              {!n.isRead && (
                                <span className="absolute top-2.5 right-2 w-1.5 h-1.5 rounded-full bg-[#D2FF00] shadow-[0_0_5px_rgba(210,255,0,0.8)]" />
                              )}
                              <button
                                onClick={(e) => deleteNotification(n.id, e)}
                                className="absolute bottom-2 right-2 p-1 text-zinc-650 hover:text-white rounded-lg duration-105 opacity-0 group-hover:opacity-100 bg-zinc-950/60 border border-zinc-800 cursor-pointer"
                                title={language === "VI" ? "Xóa thông báo" : "Delete notification"}
                              >
                                <X className="size-2.5" />
                              </button>

                              <div className="flex gap-2 items-start pr-4">
                                <div className="mt-0.5 shrink-0 w-5 h-5 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-900">
                                  {n.type === "welcome" && <Sparkles className="size-3 text-[#D2FF00]" />}
                                  {n.type === "auth" && <Shield className="size-3 text-sky-450" />}
                                  {n.type === "promo" && <Info className="size-3 text-amber-450" />}
                                  {n.type === "workout" && <Dumbbell className="size-3 text-[#D2FF00]" />}
                                  {n.type === "billing" && <CreditCard className="size-3 text-emerald-450" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[10px] truncate leading-tight ${n.isRead ? "text-zinc-400 font-medium" : "text-white font-bold"}`}>
                                    {n.title}
                                  </p>
                                  <p className="text-[9px] text-zinc-500 line-clamp-2 mt-0.5 leading-normal">
                                    {n.body}
                                  </p>
                                  <p className="text-[8px] text-zinc-600 font-mono mt-1">
                                    {n.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )
                      )}

                      {notificationTab === "message" && (
                        notifications.filter(n => n.type === "message").length === 0 ? (
                          <div className="text-center py-8 text-zinc-500 text-[10px] font-sans">
                            {language === "VI" ? "Không có tin nhắn mới nào" : "No new support messages"}
                          </div>
                        ) : (
                          notifications.filter(n => n.type === "message").map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-2.5 rounded-xl border transition-all duration-150 relative cursor-pointer group text-left ${
                                n.isRead
                                  ? "bg-slate-950/40 border-slate-905/60 hover:bg-slate-900/50"
                                  : "bg-gradient-to-br from-slate-900 to-slate-850 border-[#D2FF00]/15 shadow-sm hover:border-[#D2FF00]/30"
                              }`}
                            >
                              {!n.isRead && (
                                <span className="absolute top-3.5 right-2 w-1.5 h-1.5 rounded-full bg-[#D2FF00] shadow-[0_0_5px_rgba(210,255,0,0.8)]" />
                              )}
                              <button
                                onClick={(e) => deleteNotification(n.id, e)}
                                className="absolute bottom-2 right-2 p-1 text-zinc-650 hover:text-white rounded-lg duration-105 opacity-0 group-hover:opacity-100 bg-zinc-950/60 border border-zinc-800 cursor-pointer"
                                title={language === "VI" ? "Xóa" : "Delete"}
                              >
                                <X className="size-2.5" />
                              </button>
                              <div className="flex gap-2.5 items-start pr-4">
                                <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800 overflow-hidden relative">
                                  <MessageSquare className="size-3 text-[#D2FF00]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className={`text-[10px] truncate leading-tight ${n.isRead ? "text-zinc-400 font-medium" : "text-white font-black"}`}>
                                      {n.title}
                                    </p>
                                    <span className="text-[7px] text-[#D2FF00] border border-[#D2FF00]/20 bg-[#D2FF00]/5 px-1 rounded uppercase font-black tracking-widest shrink-0">HỖ TRỢ</span>
                                  </div>
                                  <p className="text-[9.5px] text-zinc-300 line-clamp-2 mt-1 leading-normal italic">
                                    "{n.body}"
                                  </p>
                                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-900/40">
                                    <span className="text-[8px] text-zinc-600 font-mono">
                                      {n.time}
                                    </span>
                                    <span className="text-[8.5px] text-[#D2FF00] group-hover:underline font-mono font-black tracking-wide uppercase flex items-center gap-0.5">
                                      {language === "VI" ? "TRẢ LỜI NGAY" : "REPLY NOW"} →
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Simulated Toast floating bubble inside phone screen */}
                {toastMessage && (
                  <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[85%] bg-[#0f1115] border border-[#D2FF00]/30 rounded-xl p-2 px-3 shadow-lg z-[999] flex items-center gap-2 animate-fade-in">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D2FF00] shadow-[0_0_8px_rgba(210,255,0,0.8)]" />
                    <p className="text-[11px] font-semibold font-sans text-slate-100">{toastMessage}</p>
                  </div>
                )}

                {/* Simulating SMS Alert drop down bubble in Step 2 */}
                {showOTPBubble && (
                  <div 
                    onClick={handleOTPAutoFill}
                    className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[90%] bg-black/95 hover:bg-zinc-950 border border-zinc-800 shadow-[0_10px_35px_rgba(0,0,0,0.95)] rounded-2xl p-3.5 z-[1000] cursor-pointer animate-fade-in border-l-4 border-l-[#D2FF00]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#D2FF00]/10 flex items-center justify-center border border-[#D2FF00]/35">
                          <MessageSquare className="text-[#D2FF00] size-3" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-widest">{language === "VI" ? "TIN NHẮN (SMS)" : "MESSAGE (SMS)"}</span>
                      </div>
                      <span className="text-[9px] text-[#D2FF00] font-mono font-bold animate-pulse">{language === "VI" ? "BÂY GIỜ" : "NOW"}</span>
                    </div>
                    <p className="text-[11px] font-sans text-zinc-200 mt-1.5 leading-relaxed">
                      {language === "VI" ? (
                        <span>Mã OTP kích hoạt dịch vụ FITGYM của bạn là: <strong className="text-[#D2FF00] text-sm select-all font-black">1329</strong>. Không tiết lộ cho bất kỳ ai.</span>
                      ) : (
                        <span>Your FITGYM OTP code is: <strong className="text-[#D2FF00] text-sm select-all font-black">1329</strong>. Do not share it.</span>
                      )}
                    </p>
                    <div className="mt-2 text-center py-1.5 bg-[#D2FF00] hover:bg-[#c6ef00] transition rounded-xl text-black text-[10px] font-bold font-mono tracking-wider shadow-[0_2px_10px_rgba(210,255,0,0.2)]">
                      {language === "VI" ? `[ CHẠM ĐỂ TỰ ĐIỀN OTP ] (${bubbleCountdown}s)` : `[ TOUCH TO AUTO-FILL OTP ] (${bubbleCountdown}s)`}
                    </div>
                  </div>
                )}

                {/* 2. Main Phone Body Viewer Screens */}
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative bg-slate-950 pb-5">

                  {/* ---------------- SCREEN 1: LOGIN ---------------- */}
                  {currentScreen === "LOGIN" && (
                    <div className="flex-1 flex flex-col justify-start px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      {/* Dark radial gradient to maintain readability is applied */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top labels */}
                      <div className="flex justify-between items-center mt-3 relative z-10 w-full">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          LOGIN USER
                        </span>

                        {/* Elegant unified language toggle button */}
                        {renderLanguageDropdown()}
                      </div>

                      {/* Dumbbell Icon container + slanted brand title */}
                      <div className="flex flex-col items-center justify-center mt-12 mb-6 relative z-10">
                        {/* Box outline neon icon with yellow-green glow */}
                        <div className="p-3 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-3">
                          <Dumbbell className="text-[#D2FF00] size-7 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-4xl tracking-tight font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[10px] text-zinc-400 tracking-[0.25em] font-mono mt-1 font-bold">
                          {t("CỔNG HỘI VIÊN", "MEMBER PORTAL", "会员门户")}
                        </span>
                      </div>

                      {/* Login fields */}
                      <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10">
                        {/* Phone Number Field */}
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <input
                              type="text"
                              value={loginPhone}
                              onChange={(e) => setLoginPhone(e.target.value)}
                              placeholder={t("SỐ ĐIỆN THOẠI", "PHONE NUMBER", "电话号码")}
                              className="w-full pl-4 pr-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono tracking-wider focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <input
                              type={showLoginPass ? "text" : "password"}
                              value={loginPass}
                              onChange={(e) => setLoginPass(e.target.value)}
                              placeholder={t("MẬT KHẨU", "PASSWORD", "密码")}
                              className="w-full pl-4 pr-11 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono tracking-wider focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPass(!showLoginPass)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                              {showLoginPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm button - Solid lime-green highlight matching image precisely */}
                        <button
                          type="submit"
                          className="w-full mt-2 py-3.5 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-xl rounded-2xl flex items-center justify-center uppercase tracking-wide transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(210,255,0,0.25)]"
                        >
                          {t("XÁC NHẬN", "CONFIRM", "确认登录")}
                        </button>
                      </form>

                      {/* Back-links placed directly under the form buttons as requested */}
                      <div className="flex flex-col items-center gap-3.5 mt-5 pb-4 relative z-10 w-full text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setLastScreen("LOGIN");
                            setCurrentScreen("REGISTER_STEP_1");
                          }}
                          className="text-[10px] text-zinc-300 font-sans tracking-wide hover:text-white transition"
                        >
                          {t("CHƯA CÓ TÀI KHOẢN?", "DON'T HAVE ACCOUNT?", "还没有账户吗？")}{" "}
                          <span className="text-[#D2FF00] underline uppercase font-bold hover:text-white ml-1 font-mono">
                            {t("ĐĂNG KÝ NGAY", "REGISTER NOW", "立即注册")}
                          </span>
                        </button>

                        <div className="w-full border-t border-zinc-900" />

                        <div className="w-full flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              showToast(
                                language === "VI"
                                    ? "Gợi ý: Hãy nhập 'demo' vào ô Số điện thoại để vượt qua bảo mật!"
                                    : language === "ZH"
                                    ? "提示：在电话号码栏输入 'demo' 即可绕过登录！"
                                    : "Hint: Enter 'demo' in Phone Number field to bypass login!"
                              );
                            }}
                            className="text-[10px] text-[#D2FF00] font-sans font-extrabold tracking-tight uppercase hover:underline transition"
                          >
                            {t("QUÊN MẬT KHẨU?", "FORGOT PASSWORD?", "忘记密码？")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 2: SIGN UP STEP 1 ---------------- */}
                  {currentScreen === "REGISTER_STEP_1" && (
                    <div className="flex-1 flex flex-col justify-between px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top tags */}
                      <div className="flex justify-between items-center mt-3 relative z-10 w-full">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          REGISTER USER // OTP
                        </span>

                        {/* Elegant unified language toggle button */}
                        {renderLanguageDropdown()}
                      </div>

                      {/* Brand Dumbbell header */}
                      <div className="flex flex-col items-center justify-center pt-5 pb-3 relative z-10">
                        <div className="p-2.5 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-2">
                          <Dumbbell className="text-[#D2FF00] size-5.5 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-2xl tracking-normal font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest mt-0.5 font-bold">
                          {language === "VI" ? "ĐĂNG KÝ HỘI VIÊN // OTP" : "SIGN UP MEMBER // OTP"}
                        </span>
                      </div>

                      {/* Step Indicator */}
                      <div className="bg-black/60 p-3.5 rounded-2xl border border-zinc-850 flex flex-col gap-2 relative z-10 shadow-[inner_0_1px_3px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-center">
                          {/* Progress dots */}
                          <div className="flex gap-1.55">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00] shadow-[0_0_8px_rgba(210,255,0,0.5)]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                          </div>
                          <span className="text-[10px] text-[#D2FF00] font-mono tracking-widest uppercase font-extrabold">
                            {language === "VI" ? "BƯỚC 1 / 3" : "STEP 1 / 3"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                          {language === "VI"
                            ? "Điền Số điện thoại & Họ tên hội viên để kích hoạt gửi mã OTP mô phỏng."
                            : "Enter Phone number & Member Name to simulate receipt of active OTP code."}
                        </p>
                      </div>

                      {/* Inputs Fields */}
                      <form onSubmit={handleRegisterStep1Submit} className="flex flex-col gap-3 mt-4 relative z-10">
                        
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[9px] text-zinc-400 font-mono tracking-wide font-bold">
                            {language === "VI" ? "HỌ VÀ TÊN HỘI VIÊN" : "MEMBER FULL NAME"}
                          </span>
                          <input
                            type="text"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="VD: NGUYỄN VĂN A"
                            className="w-full px-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono text-center uppercase focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[9px] text-zinc-400 font-mono tracking-wide font-bold">
                            {language === "VI" ? "SỐ ĐIỆN THOẠI ĐĂNG KÝ" : "REGISTERED PHONE NUMBER"}
                          </span>
                          <input
                            type="text"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="Nhập 10 chữ số (VD: 0987654321)"
                            className="w-full px-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono text-center focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                          />
                        </div>

                        {/* Submit Next Button - Lime-green accent */}
                        <button
                          type="submit"
                          className="w-full mt-2 py-3.5 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-sm rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wide transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer shadow-[0_4px_15px_rgba(210,255,0,0.2)]"
                        >
                          <span>{language === "VI" ? "TIẾP TỤC & NHẬN OTP" : "CONTINUE & GET OTP"}</span>
                          <ChevronRight className="size-4 text-black stroke-[3px]" />
                        </button>
                      </form>

                      {/* Back bottom signin toggler */}
                      <div className="flex flex-col items-center mt-5 pb-3 relative z-10">
                        <button
                          onClick={() => setCurrentScreen("LOGIN")}
                          type="button"
                          className="text-[10px] text-zinc-300 font-sans tracking-wide uppercase hover:text-white transition"
                        >
                          {language === "VI" ? "ĐÃ CÓ TÀI KHOẢN?" : "HAD REGISTERED?"}{" "}
                          <span className="text-[#D2FF00] underline font-bold hover:text-white ml-1 font-mono">
                            {language === "VI" ? "ĐĂNG NHẬP" : "LOG IN"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 3: SIGN UP STEP 2 ---------------- */}
                  {currentScreen === "REGISTER_STEP_2" && (
                    <div className="flex-1 flex flex-col justify-between px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top indicator */}
                      <div className="flex justify-between items-center mt-3 relative z-10 w-full">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          REGISTER USER // OTP
                        </span>

                        {/* Elegant unified language toggle button */}
                        {renderLanguageDropdown()}
                      </div>

                      {/* Brand dumbbells */}
                      <div className="flex flex-col items-center justify-center pt-3 pb-2 relative z-10">
                        <div className="p-2 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-1">
                          <Dumbbell className="text-[#D2FF00] size-5 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-xl font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest mt-0.5 font-bold">
                          {language === "VI" ? "ĐĂNG KÝ HỘI VIÊN // OTP" : "SIGN UP MEMBER // OTP"}
                        </span>
                      </div>

                      {/* Progress bar info */}
                      <div className="bg-black/60 p-3 rounded-2xl border border-zinc-850 flex flex-col gap-1.5 relative z-10 shadow-[inner_0_1px_3px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                          </div>
                          <span className="text-[10px] text-[#D2FF00] font-mono uppercase font-bold">
                            {language === "VI" ? "BƯỚC 2 / 3" : "STEP 2 / 3"}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-350 leading-snug font-sans">
                          {language === "VI" ? (
                            <span>
                              Mã xác thực OTP đã được kích hoạt đến số{" "}
                              <strong className="text-[#D2FF00] tracking-wider select-all">
                                {session.phoneNumber || "0012312312"}
                              </strong>
                              . Vui lòng kiểm tra tin nhắn.
                            </span>
                          ) : (
                            <span>
                              OTP code simulated active and sent to{" "}
                              <strong className="text-[#D2FF00]">{session.phoneNumber || "0012312312"}</strong>.
                            </span>
                          )}
                        </p>
                      </div>

                      {/* OTP Inputs View */}
                      <div className="my-auto py-3 text-center relative z-10">
                        <span className="text-[10px] text-zinc-400 font-mono tracking-widest block mb-2 font-bold">
                          {language === "VI" ? "MÃ OTP (4 CHỮ SỐ)" : "OTP CODE (4 DIGITS)"}
                        </span>

                        {/* Four boxes */}
                        <div className="flex justify-center gap-3">
                          {regOTP.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-input-${index}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOTPSingleInput(e.target.value, index)}
                              placeholder="-"
                              className="w-12 h-12 bg-black/50 hover:bg-black/70 text-center text-white border border-zinc-800 focus:border-[#D2FF00] rounded-2xl focus:outline-none text-xl font-bold font-mono transition shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Back + Proceed buttons side-by-side matching style */}
                      <div className="flex gap-3 mt-2 relative z-10">
                        <button
                          onClick={() => setCurrentScreen("REGISTER_STEP_1")}
                          className="flex-1 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-display font-black text-sm uppercase rounded-2xl duration-150 cursor-pointer"
                        >
                          {language === "VI" ? "QUAY LẠI" : "BACK"}
                        </button>

                        <button
                          onClick={handleOTPSubmit}
                          className="flex-1 py-3 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-sm uppercase rounded-2xl transition-all duration-150 cursor-pointer shadow-[0_4px_15px_rgba(210,255,0,0.2)]"
                        >
                          {language === "VI" ? "XÁC THỰC" : "VERIFY"}
                        </button>
                      </div>

                      {/* Resend bottom trigger */}
                      <div className="flex flex-col items-center gap-4 mt-4 pb-3 relative z-10">
                        <button
                          onClick={() => {
                            setBubbleCountdown(10);
                            setShowOTPBubble(true);
                            showToast(language === "VI" ? "Đã gửi lại mã OTP!" : "Resent OTP code!");
                          }}
                          className="text-[10px] text-zinc-400 hover:text-[#D2FF00] underline font-mono tracking-wide uppercase font-bold"
                        >
                          {language === "VI" ? "GỬI LẠI MÃ MỚI" : "RESEND CODE"}
                        </button>

                        <button
                          onClick={() => setCurrentScreen("LOGIN")}
                          className="text-[10px] text-zinc-300 font-sans tracking-wide uppercase hover:text-white transition"
                        >
                          {language === "VI" ? "ĐÃ CÓ TÀI KHOẢN?" : "HAD ACCOUNT?"}{" "}
                          <span className="text-[#D2FF00] underline font-bold ml-1 font-mono">
                            {language === "VI" ? "ĐĂNG NHẬP" : "LOG IN"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 4: SIGN UP STEP 3 ---------------- */}
                  {currentScreen === "REGISTER_STEP_3" && (
                    <div className="flex-1 flex flex-col justify-between px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top title bar */}
                      <div className="flex justify-between items-center mt-3 relative z-10 w-full">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          REGISTER USER // OTP
                        </span>

                        {/* Elegant unified language toggle button */}
                        {renderLanguageDropdown()}
                      </div>

                      {/* Dumbbell logo */}
                      <div className="flex flex-col items-center justify-center pt-3 pb-2 relative z-10">
                        <div className="p-2 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-1">
                          <Dumbbell className="text-[#D2FF00] size-5 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-xl font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest mt-0.5 font-bold">
                          {language === "VI" ? "ĐĂNG KÝ HỘI VIÊN // OTP" : "SIGN UP MEMBER // OTP"}
                        </span>
                      </div>

                      {/* Progress Bar 3/3 */}
                      <div className="bg-black/60 p-3 rounded-2xl border border-zinc-850 flex flex-col gap-1.5 relative z-10 shadow-[inner_0_1px_3px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                          </div>
                          <span className="text-[10px] text-[#D2FF00] font-mono uppercase font-bold">
                            {language === "VI" ? "BƯỚC 3 / 3" : "STEP 3 / 3"}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-350 leading-snug font-sans">
                          {language === "VI"
                            ? "Kích hoạt thành công số điện thoại. Hãy tạo mật khẩu đăng nhập (tối thiểu 6 ký tự)."
                            : "Phone verified. Create your login security password (min 6 characters)."}
                        </p>
                      </div>

                      {/* Form set password */}
                      <form onSubmit={handleRegisterStep3Submit} className="flex flex-col gap-3 mt-4 text-left relative z-10">
                        {/* Title 1 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-zinc-400 font-mono uppercase font-bold">
                            {language === "VI" ? "TẠO MẬT KHẨU" : "CREATE PASSWORD"}
                          </span>
                          <div className="relative">
                            <input
                              type={showRegPass ? "text" : "password"}
                              value={regPass}
                              onChange={(e) => setRegPass(e.target.value)}
                              placeholder="••••••"
                              className="w-full pl-4 pr-11 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-center text-white focus:outline-none placeholder-zinc-650 font-mono transition shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPass(!showRegPass)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                              {showRegPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Title 2 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-zinc-400 font-mono uppercase font-bold">
                            {language === "VI" ? "XÁC NHẬN MẬT KHẨU" : "CONFIRM PASSWORD"}
                          </span>
                          <input
                            type="password"
                            value={regConfirmPass}
                            onChange={(e) => setRegConfirmPass(e.target.value)}
                            placeholder="••••••"
                            className="w-full px-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-center text-white focus:outline-none placeholder-zinc-650 font-mono transition shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                          />
                        </div>

                        {/* Actions buttons */}
                        <div className="flex gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => setCurrentScreen("REGISTER_STEP_2")}
                            className="flex-1 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-display font-black text-sm uppercase rounded-2xl duration-150 cursor-pointer text-center"
                          >
                            {language === "VI" ? "QUAY LẠI" : "BACK"}
                          </button>

                          <button
                            type="submit"
                            className="flex-1 py-3 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-sm uppercase rounded-2xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer text-center shadow-[0_4px_15px_rgba(210,255,0,0.2)]"
                          >
                            <span>{language === "VI" ? "HOÀN TẤT" : "COMPLETE"}</span>
                            <CheckCircle className="size-4 text-black stroke-[3px]" />
                          </button>
                        </div>
                      </form>

                      {/* Login footer link */}
                      <div className="flex flex-col items-center mt-5 pb-3 relative z-10">
                        <button
                          onClick={() => setCurrentScreen("LOGIN")}
                          type="button"
                          className="text-[10px] text-zinc-300 font-sans tracking-wide uppercase hover:text-white transition"
                        >
                          {language === "VI" ? "ĐÃ CÓ TÀI KHOẢN?" : "HAD ACCOUNT?"}{" "}
                          <span className="text-[#D2FF00] underline font-bold ml-1 font-mono">
                            {language === "VI" ? "ĐĂNG NHẬP" : "LOG IN"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 5: APP HOME (TRANG CHỦ) ---------------- */}
                  {currentScreen === "HOME" && (
                    <div className="flex-1 flex flex-col px-5 pt-3 h-full animate-fade-in text-left">
                      
                      {/* Top dynamic user info header */}
                      <div className="mb-4">
                        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                          {t("HỘI VIÊN CLASS_PLATINUM", "CLASS_PLATINUM MEMBER", "白金专享会员")}
                        </span>
                        <h3 className="font-display italic text-3xl font-extrabold uppercase leading-none mt-1 tracking-tight text-white">
                          {t("XIN CHÀO, ", "WELCOME, ", "欢迎, ")}<span className="text-[#D2FF00]">{session.fullName || "NAM"}</span>!
                        </h3>
                      </div>

                      {/* FITGYM PASS - Locked or Unlocked Card Container */}
                      <div className="relative mb-5 p-5 rounded-3xl bg-gradient-to-br from-black to-zinc-950 border border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden min-h-[195px] flex flex-col justify-between">
                        
                        {/* Absolute carbon fiber decorative grids in canvas background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(210,255,0,0.04),transparent)] pointer-events-none" />
                        
                        {/* Card Upper Info Line */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono block uppercase">{t("THẺ SỐ HỘI VIÊN", "DIGITAL MEMBER CARD", "电子会员卡")}</span>
                            <span className="font-display italic text-xl font-extrabold text-[#D2FF00] tracking-wide">
                              FITGYM_PASS
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-400">#0013</span>
                        </div>

                        {/* Interactive Lock/Unlock State */}
                        {!activePackage ? (
                          <div className="flex flex-col items-center justify-center my-4 py-2 border border-dashed border-zinc-800 rounded-2xl bg-black/45">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-855 flex items-center justify-center mb-1">
                              <Lock className="text-zinc-555 size-4" />
                            </div>
                            <span className="text-xs text-white font-mono uppercase tracking-wide">
                              {t("QR CHECK-IN BỊ KHÓA", "QR CHECK-IN LOCKED", "签到二维码已锁定")}
                            </span>
                            <span className="text-[9px] text-zinc-400 mt-0.5">
                              {t("VUI LÒNG ĐĂNG KÝ HỘI VIÊN GÓI TẬP", "PLEASE REGISTER A MEMBERSHIP PACKAGE", "请购买会员方案")}
                            </span>
                          </div>
                        ) : (
                          // Fully Active, Neon Yellow Glow Live QR Code Simulator
                          <div className="flex items-center gap-4 my-2.5 p-2 px-3 border border-[#D2FF00]/30 rounded-2xl bg-[#D2FF00]/5 shadow-[inset_0_0_12px_rgba(210,255,0,0.05)]">
                            {/* Spinning neon matrix square simulation */}
                            <div className="shrink-0 w-[60px] h-[60px] bg-white rounded-lg p-1 animate-pulse relative">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FITGYM-MEMBER-0013-${activePackage.id}&color=d2ff00&bgcolor=ffffff`}
                                alt="QR Code"
                                className="w-full h-full object-contain filter invert"
                              />
                            </div>
                            <div className="text-left">
                              <span className="px-2 py-0.5 text-[8px] font-mono tracking-widest text-[#D2FF00] bg-zinc-900 rounded uppercase font-black">
                                {t("TRẠNG THÁI: HOẠT ĐỘNG", "STATUS: ACTIVE", "状态：使用中")}
                              </span>
                              <p className="text-[11px] font-bold text-white mt-1 uppercase line-clamp-1">
                                {getPkgName(activePackage)}
                              </p>
                              <p className="text-[9px] text-slate-400 font-mono">{t("Quẹt QR tại cổng kiểm soát", "Scan QR at check-in counter", "在打卡处扫码签到")}</p>
                            </div>
                          </div>
                        )}

                        {/* Card bottom details */}
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500 font-mono uppercase">FITGYM CLUB</span>
                          {activePackage ? (
                            <span className="text-[#D2FF00] font-mono font-bold uppercase">{activePackage.durationLabel} ACCESS</span>
                          ) : (
                            <button
                              onClick={() => setCurrentScreen("PRICING")}
                              type="button"
                              className="text-[#D2FF00] underline hover:text-white font-mono uppercase font-bold"
                            >
                              {t("Kích hoạt ngay »", "Activate now »", "选择套餐以激活卡片 »")}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* GÓI DỊCH VỤ KÍCH HOẠT widget */}
                      {!activePackage ? (
                        <div className="mb-5 p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-left flex items-start gap-3.5 relative">
                          <div className="shrink-0 w-8 h-8 rounded-2xl bg-black flex items-center justify-center border border-zinc-800">
                            <Sparkles className="text-zinc-500 size-4" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-zinc-500 font-mono tracking-wide uppercase">{t("GÓI DỊCH VỤ KÍCH HOẠT", "ACTIVATED PACKAGE", "已激活服务方案")}</span>
                              <span className="text-[9px] text-amber-500 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">{t("CHƯA ĐĂNG KÝ", "UNREGISTERED", "未购买")}</span>
                            </div>
                            <h4 className="font-display italic text-lg font-bold text-white uppercase mt-1 leading-tight tracking-wide">
                              {t("BẠN CHƯA ĐĂNG KÝ HỘI VIÊN.", "MEMBERSHIP NOT ACTIVE YET.", "您尚未开通会员。")}
                            </h4>
                            <p className="text-[10px] text-zinc-400 leading-snug mt-1.5 font-sans">
                              {t("Vui lòng đến quầy để đăng ký gói tập hoặc ", "Please visit the front desk to register, or ", "请到前台办理卡片，或者")}<strong onClick={() => setCurrentScreen("PRICING")} className="text-[#D2FF00] underline cursor-pointer">{t("chọn gói tập online tại đây", "select an online package here", "在此处线上选购")}</strong>{t(" để kích hoạt thẻ.", " to activate your card immediately.", " 来激活您的会员卡。")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-5 p-4 rounded-3xl bg-[#D2FF00]/5 border border-[#D2FF00]/20 text-left flex items-start gap-3.5 relative shadow-[0_4px_16px_rgba(210,255,0,0.03)]">
                          <div className="shrink-0 w-8 h-8 rounded-2xl bg-[#D2FF00]/10 flex items-center justify-center border border-[#D2FF00]/30 animate-pulse">
                            <Sparkles className="text-[#D2FF00] size-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-zinc-405 font-mono tracking-wide uppercase">{t("GÓI DỊCH VỤ KÍCH HOẠT", "ACTIVATED PACKAGE", "已激活服务方案")}</span>
                              <span className="text-[9px] text-black font-mono font-bold bg-[#D2FF00] px-1.5 py-0.5 rounded uppercase">{t("HẠN TỚI 2027", "EXPIRY 2027", "有效期至2027")}</span>
                            </div>
                            <h4 className="font-display italic text-lg font-extrabold text-[#D2FF00] uppercase mt-1 tracking-wide">
                              {getPkgName(activePackage)}
                            </h4>
                            <p className="text-[10px] text-slate-400 leading-snug mt-1 font-sans">
                              {t(
                                `Đầy đủ đặc quyền: ${getPkgDesc(activePackage)}. Khóa Locker & xông hơi miễn phí hằng ngày.`,
                                `Full benefits: ${getPkgDesc(activePackage)}. Free Locker & Sauna room access daily.`,
                                `特权：${getPkgDesc(activePackage)}。包含免费储物柜及桑拿房每日使用资格。`
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* LỊCH SỬ VÀO PHÒNG TẬP matching image 5 precisely */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">
                            {t("LỊCH SỬ VÀO PHÒNG TẬP", "GYM ENTRY HISTORY", "进馆打卡记录")}
                          </span>
                          <span className="text-[10px] text-[#D2FF00] font-mono">
                            {t("Tổng 0 buổi tập", "Total 0 sessions", "累计打卡 0 次")}
                          </span>
                        </div>

                        {/* Empty state dotted wireframe box */}
                        <div className="border border-dashed border-slate-800 rounded-3xl p-5 text-center flex flex-col items-center justify-center py-7 bg-slate-900/10">
                          <Clock className="text-slate-600 size-5 mb-1.5" />
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                            {t("CHƯA CÓ LỊCH SỬ CHECK-IN HÔM NAY.", "NO CHECK-IN HISTORY TODAY.", "今日内无签到记录。")}
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ---------------- SCREEN 6: PRICING (GÓI TẬP) ---------------- */}
                  {currentScreen === "PRICING" && (
                    <div className="flex-1 flex flex-col px-5 pt-3 h-full animate-fade-in text-left">
                      
                      {/* Sub head upper intro */}
                      <div className="mb-4">
                        <span className="text-[10px] font-mono tracking-widest text-[#D2FF00] uppercase font-bold leading-none">
                          {t("CHỌN LỰA GÓI PHÙ HỢP CỰC DỄ", "EASY TO FIND THE PERFECT PLAN", "轻松选购专属包月包年套餐")}
                        </span>
                        <h3 className="font-display italic text-2xl font-extrabold text-white uppercase leading-none mt-1 tracking-wider">
                          {t("BẢNG GIÁ DỊCH VỤ GYM", "GYM RATES & MEMBERSHIP", "健身房尊贵服务套餐表")}
                        </h3>
                      </div>

                      {/* Display pricing packages scrolling feed */}
                      <div className="flex flex-col gap-4">
                        {GYM_PACKAGES.map((pkg) => (
                          <div
                            key={pkg.id}
                            className={`p-4 rounded-3xl bg-zinc-900/60 border ${activePackage?.id === pkg.id ? "border-[#D2FF00] shadow-[0_0_15px_rgba(210,255,0,0.15)]" : "border-zinc-800"} flex flex-col justify-between relative overflow-hidden`}
                          >
                            
                            {/* Active badge */}
                            {activePackage?.id === pkg.id && (
                              <span className="absolute top-0 right-0 bg-[#D2FF00] text-black font-mono font-black text-[9px] px-3 py-1 rounded-bl-xl uppercase">
                                {t("ĐANG SỬ DỤNG", "ACTIVE PLAN", "在用方案")}
                              </span>
                            )}

                            <div>
                              {/* Title line */}
                              <div className="flex justify-between items-start">
                                <span className="bg-zinc-850 text-[#D2FF00] text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold border border-zinc-700/50">
                                  {getPkgDuration(pkg)}
                                </span>
                                <div className="text-right">
                                  <span className="text-base font-mono font-bold text-[#D2FF00] block">{pkg.priceValue}</span>
                                  <span className="text-[7px] text-zinc-500 font-mono tracking-wider block uppercase">{t("TRỌN GÓI", "PACKAGE VALUE", "专享包干")}</span>
                                </div>
                              </div>

                              {/* Big slant heading */}
                              <h4 className="font-display italic text-lg font-extrabold text-white uppercase mt-1 leading-none tracking-wide">
                                {getPkgName(pkg)}
                              </h4>

                              <p className="text-[10px] text-zinc-400 mt-2 font-sans leading-snug">
                                {getPkgDesc(pkg)}
                              </p>

                              {/* Bullet specifications */}
                              <div className="mt-3.5 pt-3.5 border-t border-zinc-850 flex flex-wrap gap-x-4 gap-y-1.5">
                                {getPkgFeatures(pkg).map((feat, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-1.5 text-[9px] text-zinc-300 font-mono uppercase">
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#D2FF00]/10 border border-[#D2FF00]/20 flex items-center justify-center shrink-0">
                                      <Check className="text-[#D2FF00] size-2.5" />
                                    </div>
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Sticky Neon styled button */}
                            <button
                              onClick={() => {
                                setCheckoutModalPackage(pkg);
                              }}
                              className={`w-full mt-4 py-2 bg-gradient-to-r ${activePackage?.id === pkg.id ? "from-zinc-900 to-zinc-950 border-zinc-800 text-zinc-500" : "from-[#D2FF00] to-[#c6ef00] bg-[#D2FF00] hover:bg-[#c6ef00] text-black border-transparent"} font-mono font-bold text-[9px] tracking-wide rounded-xl border transition duration-150 uppercase cursor-pointer text-center`}
                            >
                              {activePackage?.id === pkg.id 
                                ? t("BẠN ĐANG DÙNG GÓI NÀY - HẤP DẪN", "CURRENT ACTIVE PLAN", "您正在使用该订购计划") 
                                : t("CHỌN GÓI NÀY ĐỂ KÍCH HOẠT MÔ PHỎNG", "SELECT AND SIMULATE ACTIVATION", "选择该套餐进行模拟体验")}
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* ---------------- SCREEN 7: CHAT BOT AI (HLV AI) ---------------- */}
                  {currentScreen === "CHAT_AI" && (
                    <div className="flex-1 flex flex-col justify-between h-full animate-fade-in relative px-4">
                      
                      {/* Top bar header info */}
                      <div className="flex items-center gap-2 mb-3 mt-1 pb-2 border-b border-zinc-900 text-left">
                        {/* Go back menu icon */}
                        <button
                          onClick={() => setCurrentScreen("HOME")}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg duration-150"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-[#D2FF00] block leading-none font-bold">
                            {t("TRỢ LÝ SỨC KHỎE VÀ TẬP LUYỆN", "HEALTH & TRAINING ASSISTANT", "智能健康与健身教练助手")}
                          </span>
                          <h4 className="font-display italic text-lg font-extrabold text-white uppercase leading-none mt-0.5">
                            {t("CHATBOT HLV AI", "AI COACH CHATBOT", "AI 智能健身私教")}
                          </h4>
                        </div>
                      </div>

                      {/* Chat messages feed container */}
                      <div className="flex-1 overflow-y-auto space-y-3 px-1.5 pb-2 text-left max-h-[460px] min-h-[300px]">
                        {aiChatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} w-full anim-fade-in`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              {msg.role === "assistant" && (
                                <span className="bg-[#D2FF00]/10 border border-[#D2FF00]/30 text-[#D2FF00] font-mono text-[7px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  GYMMASTER BOT AI
                                </span>
                              )}
                              <span className="text-[7px] text-zinc-500 font-mono">{getTranslatedTimestamp(msg.timestamp)}</span>
                            </div>

                            <div
                              className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed whitespace-pre-wrap ${
                                msg.role === "user"
                                  ? "bg-[#D2FF00] text-black font-semibold font-sans rounded-tr-none shadow-[0_4px_15px_rgba(210,255,0,0.18)]"
                                  : "bg-zinc-900 text-zinc-200 border border-zinc-800/80 rounded-tl-none font-sans"
                              }`}
                            >
                              {getTranslatedMessageContent(msg)}
                            </div>
                          </div>
                        ))}

                        {/* Loading pulse thinking state */}
                        {loadingAI && (
                          <div className="flex flex-col items-start w-full">
                            <span className="bg-[#D2FF00]/10 border border-[#D2FF00]/30 text-[#D2FF00] font-mono text-[7px] font-extrabold px-1.5 py-0.5 rounded uppercase mb-1">
                              GYMMASTER BOT AI
                            </span>
                            <div className="bg-zinc-900 text-zinc-300 border border-zinc-805 rounded-2xl rounded-tl-none p-3 px-4 text-xs font-mono animate-pulse flex items-center gap-2">
                              {/* spinning neon loader circle */}
                              <div className="w-2 h-2 rounded-full bg-[#D2FF00] animate-ping" />
                              <span>{t("Được cung cấp bởi Gemini AI...", "Powered by Gemini AI...", "由 Gemini AI 提供支持...")}</span>
                            </div>
                          </div>
                        )}

                        <div ref={aiChatEndRef} />
                      </div>

                      {/* AI Quick helper tags */}
                      <div className="my-2 py-2 border-t border-b border-zinc-900/40 flex items-center gap-2 overflow-x-auto select-none no-scrollbar shrink-0">
                        <span className="text-[7px] text-zinc-550 font-mono shrink-0 uppercase">{t("GỢI Ý NHANH:", "QUICK SUGGESTIONS:", "智能建议:")}</span>
                        {[
                          { 
                            text: t("LỊCH TẬP NGỰC TĂNG CƠ", "CHEST WORKOUT ROUTINE", "胸部增肌锻炼"), 
                            msg: t("Lên dùm tôi lịch tập ngực tăng cơ độ dày tốt nhất", "Plan the best chest hypertrophy workout for thickness", "帮我规划最有效的胸部肥大、增厚训练流程") 
                          },
                          { 
                            text: t("THỰC ĐƠN GIẢM MỠ BỤNG", "BELLY FAT LOSS DIET", "减肚腩食谱"), 
                            msg: t("Cho tôi thực đơn ăn uống giảm mỡ bụng trong vòng 1 tuần", "Give me a belly fat loss meal plan for 1 week", "给我一份为期一星期的减肚腩膳食计划") 
                          },
                          { 
                            text: t("TƯ VẤN GÓI TẬP", "MEMBERSHIP PLAN ADVICE", "咨询订阅方案"), 
                            msg: t("Gói tập FitGym nào tốt nhất cho sinh viên hoặc người bắt đầu?", "Which FitGym package is best for students or beginners?", "哪个 FitGym 订阅方案最适合学生或入门新手？") 
                          },
                        ].map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setAiInputMessage(tag.msg);
                              showToast(language === "VI" ? "Bấm vào nút gửi để hỏi AI!" : language === "ZH" ? "点击发送按钮询问AI！" : "Click the send button to query AI!");
                            }}
                            className="shrink-0 p-1 px-2 border border-zinc-800 rounded bg-zinc-900 hover:border-[#D2FF00] hover:text-[#D2FF00] text-[8px] font-mono text-zinc-300 transition duration-150 uppercase font-black"
                          >
                            {tag.text}
                          </button>
                        ))}
                      </div>

                      {/* Chat text input box matches image 7 */}
                      <form onSubmit={sendAIMessage} className="flex gap-2 bg-transparent shrink-0">
                        <input
                          type="text"
                          value={aiInputMessage}
                          onChange={(e) => setAiInputMessage(e.target.value)}
                          placeholder={t("Hỏi AI về bài tập, chế độ dinh dưỡng...", "Ask AI about workouts, nutrition diet plans...", "向 AI 询问健美锻炼、营养膳食食谱...")}
                          className="flex-1 bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-[#D2FF00] text-xs text-white placeholder-zinc-550 py-3.5 pl-4 pr-3 rounded-xl font-mono"
                        />
                        <button
                          type="submit"
                          disabled={loadingAI}
                          className="w-11 h-11 shrink-0 bg-[#D2FF00] hover:bg-[#c6ef00] text-black rounded-xl flex items-center justify-center duration-150 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_4px_10px_rgba(210,255,0,0.25)]"
                        >
                          <Send className="size-4 text-black" />
                        </button>
                      </form>

                    </div>
                  )}

                  {/* ---------------- SCREEN 8: CHAT SUPPORT TEAM LIST (HỖ TRỢ CHAT) ---------------- */}
                  {currentScreen === "SUPPORT_LIST" && (
                    <div className="flex-1 flex flex-col px-5 pt-0 h-full animate-fade-in text-left">
                      
                      {/* Sticky Header block for SUPPORT_LIST - keeps header fixed when scrolling list items */}
                      <div className="sticky top-0 bg-slate-950 pt-3.5 pb-2.5 z-30 shrink-0 flex flex-col">
                        {/* Search & filters head */}
                        <div className="mb-4">
                          <h3 className="font-display italic text-2xl font-extrabold text-white uppercase leading-none tracking-wider mb-1.5">
                            {t("MESSENGER HỖ TRỢ CHAT", "MESSENGER CHAT SUPPORT", "联系客服及私教")}
                          </h3>
                          <span className="text-[10px] font-mono tracking-widest text-[#D2FF00] uppercase font-bold leading-none block">
                            {t("TỔNG ĐÀI HỖ TRỢ TRỰC TUYẾN 24/7", "ONLINE TELECOM SUPPORT 24/7", "24/7 线上人工客服热线")}
                          </span>
                        </div>
 
                        {/* Core support directory search input bar */}
                        <div className="relative mb-3.5">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                          <input
                            type="text"
                            value={supportSearchQuery}
                            onChange={(e) => setSupportSearchQuery(e.target.value)}
                            placeholder={t("Tìm nhân viên hỗ trợ hoặc PT...", "Search support agent or PT...", "搜索客服人员或专属私教...")}
                            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:outline-none text-xs text-white placeholder-zinc-550 font-mono"
                          />
                        </div>
 
                        {/* Sub-tabs / Switcher buttons bar */}
                        <div className="flex gap-2 bg-zinc-950/60 p-1 rounded-xl border border-zinc-900/60">
                          <button
                            onClick={() => setSupportActiveSubTab("directory")}
                            type="button"
                            className={`flex-1 py-1.8 px-2 rounded-lg font-mono text-[9px] font-black tracking-wider transition duration-150 uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                              supportActiveSubTab === "directory"
                                ? "bg-[#D2FF00] text-black font-extrabold shadow-[0_2px_8px_rgba(210,255,0,0.15)]"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            <User className="size-3" />
                            <span>{t("DANH BẠ", "DIRECTORY", "通讯录")}</span>
                          </button>
 
                          <button
                            onClick={() => setSupportActiveSubTab("incoming")}
                            type="button"
                            className={`flex-1 py-1.8 px-2 rounded-lg font-mono text-[9px] font-black tracking-wider transition duration-150 uppercase flex items-center justify-center gap-1.5 cursor-pointer relative ${
                              supportActiveSubTab === "incoming"
                                ? "bg-[#D2FF00] text-black font-extrabold shadow-[0_2px_8px_rgba(210,255,0,0.15)]"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            <MessageSquare className="size-3" />
                            <span>{t("TIN NHẮN ĐẾN", "INCOMING MESSAGES", "收件箱")}</span>
                            {sortedIncomingMessages.length > 0 && (
                              <span className="bg-rose-500 text-white font-sans text-[7.5px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg shrink-0 leading-none">
                                {sortedIncomingMessages.length}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Sub-tab 1: Directory list view */}
                      {supportActiveSubTab === "directory" && (
                        <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-0.5 custom-scrollbar pb-8">
                          {/* Filter Chips tags matches image 8 */}
                          <div className="flex gap-2 mb-1.5 overflow-x-auto no-scrollbar pb-1 shrink-0">
                            {[
                              { id: "all", label: t("TẤT CẢ", "ALL", "全部") },
                              { id: "pt", label: t("HLV THỂ HÌNH (PT)", "FITNESS PT", "体育私教 (PT)") },
                              { id: "support", label: t("LỄ TÂN / SUPPORT", "RECEPTION / SUPPORT", "前台服务人员") },
                            ].map((chip) => (
                              <button
                                key={chip.id}
                                onClick={() => setSupportCategoryFilter(chip.id as any)}
                                type="button"
                                className={`shrink-0 py-1.5 px-3 font-mono font-black text-[8px] rounded-lg tracking-wider transition duration-150 uppercase cursor-pointer ${
                                  supportCategoryFilter === chip.id
                                    ? "bg-[#D2FF00] text-black font-extrabold shadow-[0_2px_8px_rgba(210,255,0,0.2)]"
                                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                                }`}
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>

                          {/* DỘI THOẠI ĐANG CHAT (Recent active chats list) */}
                          <div className="mb-1 shrink-0">
                            <span className="text-[8px] text-zinc-550 font-mono uppercase tracking-wider block mb-1.5">{t("HỘI THOẠI GẦN ĐÂY", "RECENT DISCUSSIONS", "最近会话")}</span>
                            <div className="border border-dashed border-zinc-800 rounded-2xl p-3.5 text-center justify-center py-4 bg-zinc-900/10">
                              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-normal">
                                {t(
                                  "Chưa có cuộc trò chuyện nào trước đó. Chọn HLV hoặc kỹ thuật viên ở mục danh bạ phía dưới để khởi tạo chat ngay!",
                                  "No previous active conversations. Choose a fitness trainer or reception agent below to start chatting!",
                                  "无历史聊天记录。请点击下方选择一名称职的私教或前台人员开始互动咨询！"
                                )}
                              </p>
                            </div>
                          </div>
 
                          {/* ONLINE CONTACT DIRECTORY CARDS matches images 8 precisely */}
                          <div className="flex flex-col gap-3.5 mt-4">
                            <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block leading-none">
                              {t("DANH BẠ TRỰC TUYẾN", "ONLINE DIRECTORY", "在线客服人员")} ({SUPPORT_CONTACTS.filter(c => c.isOnline).length})
                            </span>
                            
                            {SUPPORT_CONTACTS.filter((contact) => {
                              const matchesCat =
                                supportCategoryFilter === "all" || contact.category === supportCategoryFilter;
                              const matchesQuery =
                                contact.name.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                                getContactRole(contact).toLowerCase().includes(supportSearchQuery.toLowerCase());
                              return matchesCat && matchesQuery;
                            }).map((contact) => (
                              <div
                                key={contact.id}
                                className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-3xl flex flex-col gap-3.5 relative shadow text-left select-none"
                              >
                                {/* Profile core row */}
                                <div className="flex items-start gap-3">
                                  {/* Avatar circle with online green pulsing indicator */}
                                  <div className="shrink-0 relative">
                                    <div className="w-10 h-10 rounded-full bg-zinc-850 border border-zinc-700 text-white font-bold text-center flex items-center justify-center font-sans text-base bg-gradient-to-tr from-zinc-850 to-zinc-900">
                                      {contact.avatarChar}
                                    </div>
                                    {contact.isOnline && (
                                      <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full bg-green-500 border-[2px] border-zinc-900 shadow-[0_0_8px_rgba(34,197,94,0.7)] animate-pulse" />
                                    )}
                                  </div>
 
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <span className="bg-zinc-800 text-[#D2FF00] border border-zinc-700/50 text-[8px] font-mono px-1.5 py-0.2 rounded uppercase font-bold">
                                        {getContactRole(contact)}
                                      </span>
                                    </div>
                                    <h4 className="font-display italic text-lg font-extrabold text-white uppercase leading-tight mt-1">
                                      {getContactName(contact)}
                                    </h4>
                                    <span className="text-[8px] text-zinc-550 font-mono block uppercase">
                                      {contact.id === "tiep_tan" ? t("Lễ tân ca sáng", "Morning receptionist", "早班前台小姐姐") : contact.id === "huan_luyen" ? t("PT Chuyên nghiệp", "Senior Pro PT", "专业资深私人教练") : t("Kỹ thuật viên", "Technical Support", "后台技术运维")}
                                    </span>
                                  </div>
                                </div>
 
                                {/* BIO descriptive window */}
                                <div className="p-3 bg-black/40 border border-zinc-850/60 rounded-2xl text-[10px] text-zinc-300 font-sans leading-relaxed">
                                  {getContactBio(contact)}
                                </div>
 
                                {/* CALL DIRECT vs TEXT MESSAGE actions row matches image 8 */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                  <button
                                    onClick={() => {
                                      showToast(
                                        language === "VI"
                                          ? `Đang thực hiện cuộc gọi viễn thông trực tiếp đến: ${getContactName(contact)}`
                                          : language === "ZH"
                                          ? `正在呼叫：${getContactName(contact)}`
                                          : `Initiating direct telecom call to: ${getContactName(contact)}`
                                      );
                                    }}
                                    type="button"
                                    className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono font-black text-[9px] tracking-wide border border-zinc-700/50 rounded-xl flex items-center justify-center gap-1.5 transition duration-155 uppercase cursor-pointer"
                                  >
                                    <Phone className="size-3" />
                                    <span>{t("GỌI TRỰC TIẾP", "DIRECT CALL", "直拔通话")}</span>
                                  </button>
 
                                  <button
                                    onClick={() => {
                                      setActiveSupportContact(contact);
                                      setCurrentScreen("SUPPORT_CHAT");
                                    }}
                                    type="button"
                                    className="py-2.5 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-mono font-black text-[9px] tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition duration-155 uppercase cursor-pointer shadow-[0_2px_10px_rgba(210,255,0,0.15)]"
                                  >
                                    <MessageSquare className="size-3 text-black" />
                                    <span>{t("NHẮN TIN", "CHAT NOW", "咨询聊天")}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-tab 2: Incoming messages list view */}
                      {supportActiveSubTab === "incoming" && (
                        <div className="flex-1 flex flex-col gap-3.5 mt-1 overflow-y-auto pr-0.5 custom-scrollbar pb-8">
                          <div className="flex items-center justify-between pb-1 shrink-0">
                            <span className="text-[8.5px] text-zinc-550 font-mono uppercase tracking-wider block">{t("Hộp thư hỗ trợ", "Support Inbox", "客服收件箱")} ({sortedIncomingMessages.length})</span>
                            <span className="text-[7.5px] text-[#D2FF00] font-mono uppercase tracking-widest font-black">{t("Trực tuyến 24/7", "Online 24/7", "24/7 全天候在线")}</span>
                          </div>

                          {sortedIncomingMessages.length === 0 ? (
                            <div className="border border-dashed border-zinc-800 rounded-2xl p-6 text-center py-10 bg-zinc-900/10">
                              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">
                                {t(
                                  "Không có tin nhắn nào từ nhân viên hỗ trợ. Hãy gửi tin nhắn trước cho họ ở tab danh bạ!",
                                  "No messages from support staff yet. Use the directory to initiate a chat!",
                                  "收件箱内无任何客服留言。您可以前往通讯录，主动向您的PT教练或前台客服发送信息！"
                                )}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {sortedIncomingMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  onClick={() => {
                                    setActiveSupportContact(msg.agent);
                                    setCurrentScreen("SUPPORT_CHAT");
                                  }}
                                  className="bg-zinc-900/35 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-[#D2FF00]/40 p-3.5 rounded-2xl flex flex-col gap-2.5 transition duration-155 cursor-pointer relative group shadow-sm text-left select-none animate-fade-in"
                                >
                                  {/* Top header row */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-zinc-850 border border-zinc-700/65 text-white font-bold text-center flex items-center justify-center font-sans text-[10px]">
                                        {msg.agent.avatarChar}
                                      </div>
                                      <div>
                                        <h5 className="font-display italic text-[11px] font-black text-white uppercase tracking-wide leading-none">
                                          {getContactName(msg.agent)}
                                        </h5>
                                        <span className="text-[7.5px] text-[#D2FF00] font-mono uppercase block mt-0.5 font-bold">
                                          {getContactRole(msg.agent)}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-[7.5px] text-zinc-550 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                                      {getTranslatedTimestamp(msg.timestamp)}
                                    </span>
                                  </div>

                                  {/* Message brief body */}
                                  <p className="text-[10.5px] text-zinc-300 font-sans leading-relaxed pl-2.5 italic border-l-2 border-zinc-700 group-hover:border-[#D2FF00]/65 transition-all">
                                    "{getTranslatedMessageContent(msg)}"
                                  </p>

                                  <div className="flex justify-end pt-0.5">
                                    <div className="text-[8px] font-mono font-black text-[#D2FF00] tracking-wider uppercase flex items-center gap-1 group-hover:translate-x-1 duration-155 transition-all">
                                      <span>{t("TRẢ LỜI NGAY", "REPLY NOW", "立即回复")}</span>
                                      <ChevronRight className="size-3" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                  {currentScreen === "SUPPORT_CHAT" && (
                    <div className="flex-1 flex flex-col justify-between h-full animate-fade-in relative px-5 pt-3">
                      
                      {/* Top Header Contact details with phone call option */}
                      <div className="flex items-center justify-between mb-3 mt-1 pb-2 border-b border-zinc-800 pr-1 text-left shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentScreen("SUPPORT_LIST")}
                            className="p-1 -ml-1 text-slate-400 hover:text-white hover:bg-zinc-900 rounded-lg duration-155 cursor-pointer border-0 bg-transparent"
                          >
                            <ChevronLeft className="size-4" />
                          </button>

                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-zinc-850 text-white font-bold text-center flex items-center justify-center font-sans text-xs">
                              {activeSupportContact.avatarChar}
                            </div>
                            {activeSupportContact.isOnline && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-zinc-900 shadow" />
                            )}
                          </div>

                          <div>
                            <h4 className="font-display italic text-base font-extrabold text-white uppercase leading-none">
                              {getContactName(activeSupportContact)}
                            </h4>
                            <span className="text-[7.5px] text-zinc-550 font-mono block uppercase mt-0.5 font-bold">
                              {getContactRole(activeSupportContact)}
                            </span>
                          </div>
                        </div>

                        {/* Direct dial instant icon button */}
                        <button
                          onClick={() => {
                            showToast(
                              language === "VI"
                                ? `Kết nối hotline: ${getContactName(activeSupportContact)}`
                                : language === "ZH"
                                ? `接通专线电话：${getContactName(activeSupportContact)}`
                                : `Calling hotline: ${getContactName(activeSupportContact)}`
                            );
                          }}
                          type="button"
                          className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-[#D2FF00] flex items-center justify-center border border-zinc-800 duration-155 cursor-pointer"
                        >
                          <Phone className="size-3.5" />
                        </button>
                      </div>

                      {/* Chat Messages Feed of this Support assistant */}
                      <div className="flex-1 overflow-y-auto space-y-3 px-1.5 pb-2 text-left max-h-[460px] min-h-[300px]">
                        {(supportAgentChats[activeSupportContact.id] || []).map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} w-full anim-fade-in`}
                          >
                            <span className="text-[7px] text-zinc-550 font-mono mb-1">{getTranslatedTimestamp(msg.timestamp)}</span>

                            <div
                              className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed whitespace-pre-wrap ${
                                msg.role === "user"
                                  ? "bg-[#D2FF00] text-black font-semibold font-sans rounded-tr-none shadow-[0_4px_15px_rgba(210,255,0,0.18)]"
                                  : "bg-zinc-900 text-zinc-200 border border-zinc-800/80 rounded-tl-none font-sans"
                              }`}
                            >
                              {getTranslatedMessageContent(msg)}
                            </div>
                          </div>
                        ))}

                        {/* Simulated typing agent feedback pending indicator */}
                        {supportReplyPending && (
                          <div className="flex flex-col items-start w-full">
                            <span className="text-[7px] text-zinc-550 font-mono mb-1">{t("Đang soạn tin nhắn...", "Drafting reply...", "正在输入回复...")}</span>
                            <div className="bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-2xl rounded-tl-none p-3 px-4 text-[10px] font-mono animate-pulse">
                              <span>
                                {t(
                                  `${getContactName(activeSupportContact)} đang gõ phản hồi...`,
                                  `${getContactName(activeSupportContact)} is typing a reply...`,
                                  `${getContactName(activeSupportContact)} 正在编写回复...`
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div ref={supportChatEndRef} />
                      </div>

                      {/* Chat text input box matches image 9 */}
                      <form onSubmit={sendSupportMessage} className="flex gap-2 bg-transparent shrink-0">
                        <input
                          type="text"
                          value={supportInputMessage}
                          onChange={(e) => setSupportInputMessage(e.target.value)}
                          placeholder={t("Nhập nội dung cần trao đổi...", "Type your message here...", "输入您想要沟通的具体内容...")}
                          className="flex-1 bg-zinc-900 border border-zinc-800 focus:outline-[#D2FF00] focus:border-[#D2FF00] text-xs text-white placeholder-zinc-550 py-3 pl-4 pr-3 rounded-xl font-sans"
                        />
                        <button
                          type="submit"
                          disabled={supportReplyPending}
                          className="w-10 h-10 shrink-0 bg-[#D2FF00] hover:bg-[#c6ef00] text-black rounded-xl flex items-center justify-center duration-150 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_4px_10px_rgba(210,255,0,0.15)]"
                        >
                          <Send className="size-3.5 text-black" />
                        </button>
                      </form>

                    </div>
                  )}

                  {/* ---------------- SCREEN 9: PERSONAL PROFILE (HỒ SƠ CÁ NHÂN) ---------------- */}
                  {currentScreen === "PROFILE" && (
                    <div className="flex-1 flex flex-col justify-start px-6 pt-1 h-full animate-fade-in relative text-left">
                      
                      {/* Return button, heading, and edit profile toggle */}
                      <div className="flex items-center justify-between mb-4 mt-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentScreen(lastScreen || "HOME");
                              setIsEditingProfile(false);
                            }}
                            className="p-1 -ml-1 text-slate-400 hover:text-white hover:bg-zinc-900 rounded-lg duration-150 cursor-pointer border-0 bg-transparent flex items-center justify-center"
                          >
                            <ChevronLeft className="size-5" />
                          </button>
                          <h3 className="font-display italic text-xl font-extrabold text-white uppercase leading-none tracking-wider">
                            {language === "VI" ? "HỒ SƠ CÁ NHÂN" : "PERSONAL PROFILE"}
                          </h3>
                        </div>


                      </div>

                      {!isEditingProfile ? (
                        <>
                          {/* Main Profile Info Card with Họ và tên, SĐT, Địa chỉ */}
                          <div className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4.5 mb-5 shadow-2xl relative overflow-hidden backdrop-blur-md shrink-0">
                            {/* Glow accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D2FF00]/10 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="flex items-center gap-4.5 relative z-10 mb-5">
                              {/* Avatar block with initials */}
                              <div className="w-14 h-14 rounded-full bg-black border-[2.5px] border-[#D2FF00] flex items-center justify-center font-display italic text-xl font-black text-[#D2FF00] shadow-[0_0_15px_rgba(210,255,0,0.25)] select-none shrink-0">
                                {session.fullName ? session.fullName[0].toUpperCase() : "N"}
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Full Name */}
                                <h4 className="text-white text-base font-bold font-sans uppercase tracking-tight truncate leading-tight">
                                  {session.fullName || "NAM"}
                                </h4>
                                {/* Member Code with code indicator */}
                                <div className="text-[10px] font-mono text-[#D2FF00] uppercase tracking-widest font-bold mt-1.5 flex items-center gap-1.5 flex-wrap">
                                  <span>MEMBER:</span>
                                  <span className="bg-[#D2FF00]/15 text-[#D2FF00] px-2 py-0.5 rounded text-[9px] font-black">
                                    {session.memberCode || "#0013"}
                                  </span>
                                </div>
                                {/* Member level badge style matches image 10 */}
                                <div className="text-[10px] font-mono text-slate-450 mt-1 uppercase flex items-center gap-1 font-bold">
                                  <Shield className="size-3 text-amber-500 fill-amber-500/20" />
                                  <span>{session.memberClass ? session.memberClass.replace("Hội viên ", "") : "PLATINUM VIP"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Profile Information List containing Name, Phone, Gender, Birth Date, and Address */}
                            <div className="space-y-3.5 relative z-10 border-t border-zinc-800/60 pt-4.5">
                              <div className="flex justify-between items-start gap-4">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-extrabold whitespace-nowrap pt-0.5">
                                  {language === "VI" ? "HỌ VÀ TÊN:" : "FULL NAME:"}
                                </span>
                                <span className="text-xs text-white font-semibold text-right">
                                  {session.fullName || "NAM"}
                                </span>
                              </div>

                              <div className="flex justify-between items-start gap-4">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-extrabold whitespace-nowrap pt-0.5">
                                  {language === "VI" ? "SỐ ĐIỆN THOẠI:" : "PHONE NUMBER:"}
                                </span>
                                <span className="text-xs text-white font-mono font-medium text-right bg-zinc-950/40 px-2 py-0.5 rounded">
                                  {session.phoneNumber || "N/A"}
                                </span>
                              </div>

                              <div className="flex justify-between items-start gap-4">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-extrabold whitespace-nowrap pt-0.5">
                                  {language === "VI" ? "GIỚI TÍNH:" : "GENDER:"}
                                </span>
                                <span className="text-xs text-white font-semibold text-right">
                                  {session.gender || (language === "VI" ? "Nam" : "Male")}
                                </span>
                              </div>

                              <div className="flex justify-between items-start gap-4">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-extrabold whitespace-nowrap pt-0.5">
                                  {language === "VI" ? "NGÀY SINH:" : "DATE OF BIRTH:"}
                                </span>
                                <span className="text-xs text-white font-mono font-medium text-right">
                                  {session.birthDate ? session.birthDate.split('-').reverse().join('/') : "15/10/1995"}
                                </span>
                              </div>

                              <div className="flex justify-between items-start gap-4">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-extrabold whitespace-nowrap pt-0.5">
                                  {language === "VI" ? "ĐỊA CHỈ:" : "ADDRESS:"}
                                </span>
                                <span className="text-xs text-zinc-300 font-sans text-right max-w-[185px] break-words leading-relaxed">
                                  {session.address || (language === "VI" ? "Chưa cập nhật" : "Not updated")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col justify-end mb-4">
                            {/* Edit Profile Info Button instead of Logout Button */}
                            <button
                              onClick={() => {
                                setIsEditingProfile(true);
                              }}
                              type="button"
                              className="w-full py-3 bg-[#D2FF00] hover:bg-[#c6ef00] text-black rounded-xl transition duration-150 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer leading-none shadow-[0_4px_16px_rgba(210,255,0,0.18)]"
                            >
                              <Pencil className="size-3.5 text-black" />
                              <span>{language === "VI" ? "CHỈNH SỬA THÔNG TIN" : "EDIT PROFILE INFO"}</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Editing fields container form */}
                          <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col justify-between">
                            
                            <div className="space-y-4">
                              
                              {/* Heading section */}
                              <div className="flex items-center gap-1.5 pb-1 border-b border-zinc-900">
                                <span className="w-1 h-3.5 bg-[#D2FF00] rounded-full" />
                                <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-black">
                                  {language === "VI" ? "HỒ SƠ ĐANG CHỈNH SỬA" : "EDIT PROFILE DATA"}
                                </h4>
                              </div>

                              {/* 1. Full Name input field */}
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">
                                  {language === "VI" ? "HỌ VÀ TÊN" : "FULL NAME"}
                                </label>
                                <div className="relative">
                                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder={language === "VI" ? "Nhập họ và tên..." : "Enter full name..."}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:outline-none text-xs text-white placeholder-zinc-650 font-sans font-medium"
                                  />
                                </div>
                              </div>

                              {/* 2. Phone Number display (read-only primary key identifier) */}
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono tracking-widest text-[#D2FF00] uppercase font-bold block flex items-center gap-1">
                                  <span>{language === "VI" ? "SỐ ĐIỆN THOẠI HỘI VIÊN" : "MEMBER PHONE NUMBER"}</span>
                                  <LockKeyhole className="size-2.5 text-[#D2FF00]" />
                                </label>
                                <div className="relative">
                                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                                  <input
                                    type="text"
                                    value={session.phoneNumber || ""}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-900 rounded-xl text-xs text-zinc-500 font-mono cursor-not-allowed select-text font-semibold"
                                  />
                                </div>
                                <span className="text-[8px] text-zinc-550 font-mono block italic leading-snug">
                                  * {language === "VI" ? "Số điện thoại đăng ký là cố định và không thay đổi." : "Registration phone number is fixed and locked."}
                                </span>
                              </div>

                              {/* 3. Gender select field */}
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">
                                  {language === "VI" ? "GIỚI TÍNH" : "GENDER"}
                                </label>
                                <div className="relative">
                                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                                  <select
                                    value={editGender}
                                    onChange={(e) => setEditGender(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:outline-none text-xs text-white placeholder-zinc-650 font-sans font-medium appearance-none cursor-pointer"
                                  >
                                    <option value="Nam">{language === "VI" ? "Nam" : "Male"}</option>
                                    <option value="Nữ">{language === "VI" ? "Nữ" : "Female"}</option>
                                    <option value="Khác">{language === "VI" ? "Khác" : "Other"}</option>
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[8px]">
                                    ▼
                                  </div>
                                </div>
                              </div>

                              {/* 4. Birth Date input field */}
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">
                                  {language === "VI" ? "NGÀY SINH" : "DATE OF BIRTH"}
                                </label>
                                <div className="relative">
                                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                                  <input
                                    type="date"
                                    value={editBirthDate}
                                    onChange={(e) => setEditBirthDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:outline-none text-xs text-white placeholder-zinc-650 font-sans font-medium [color-scheme:dark]"
                                  />
                                </div>
                              </div>

                              {/* 5. Address input field */}
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">
                                  {language === "VI" ? "ĐỊA CHỈ" : "ADDRESS"}
                                </label>
                                <div className="relative">
                                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                                  <input
                                    type="text"
                                    value={editAddress}
                                    onChange={(e) => setEditAddress(e.target.value)}
                                    placeholder={language === "VI" ? "Nhập địa chỉ nhà..." : "Enter address..."}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:outline-none text-xs text-white placeholder-zinc-650 font-sans font-medium"
                                  />
                                </div>
                              </div>

                            </div>

                            {/* Save/Cancel triggers */}
                            <div className="mt-6 mb-4 space-y-2.5 shrink-0">
                              <button
                                type="submit"
                                disabled={isSavingProfile}
                                className="w-full bg-[#D2FF00] hover:bg-[#c6ef50] text-black font-mono text-[10px] font-extrabold py-3 rounded-xl transition duration-150 active:scale-98 disabled:opacity-50 cursor-pointer shadow-[0_4px_16px_rgba(210,255,0,0.18)] tracking-wider uppercase flex items-center justify-center gap-1.5 border-0"
                              >
                                {isSavingProfile ? (
                                  <>
                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin inline-block mr-1.5" />
                                    <span>{language === "VI" ? "ĐANG LƯU THAY ĐỔI..." : "SAVING CHANGES..."}</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="size-4 text-black inline" />
                                    <span className="ml-1.5">{language === "VI" ? "LƯU THAY ĐỔI" : "SAVE UPDATE"}</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="w-full py-2.5 bg-zinc-900/50 hover:bg-zinc-800 text-slate-400 hover:text-white rounded-xl transition duration-150 font-mono text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer leading-none border border-zinc-800"
                              >
                                {language === "VI" ? "HỦY BỎ" : "CANCEL"}
                              </button>
                            </div>
                          </form>
                        </>
                      )}

                    </div>
                  )}

                  {/* ---------------- SCREEN 10: PAYMENT HISTORY (LỊCH SỬ THANH TOÁN) ---------------- */}
                  {currentScreen === "PAYMENT_HISTORY" && (
                    <div className="flex-1 flex flex-col justify-start px-6 pt-1 h-full animate-fade-in text-left">
                      
                      {/* Heading with return back action */}
                      <div className="flex items-center justify-between mb-4 mt-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentScreen(lastScreen || "HOME");
                            }}
                            className="p-1 -ml-1 text-slate-400 hover:text-white hover:bg-zinc-900 rounded-lg duration-150 cursor-pointer border-0 bg-transparent flex items-center justify-center"
                          >
                            <ChevronLeft className="size-5" />
                          </button>
                          <h3 className="font-display italic text-xl font-extrabold text-white uppercase leading-none tracking-wider">
                            {language === "VI" ? "LỊCH SỬ THANH TOÁN" : "PAYMENT HISTORY"}
                          </h3>
                        </div>
                      </div>

                      {/* Header overview statistic card */}
                      <div className="w-full bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4.5 mb-4 shadow-xl relative overflow-hidden backdrop-blur-md shrink-0">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#D2FF00]/5 rounded-full blur-xl pointer-events-none" />
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold block mb-1">
                          {language === "VI" ? "TỔNG SỐ GIAO DỊCH" : "TOTAL TRANSACTIONS"}
                        </span>
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-3xl font-display font-black text-[#D2FF00]">
                            {paymentHistory.length}
                          </span>
                          <span className="text-xs text-zinc-400 font-sans font-medium">
                            {language === "VI" ? "đã hoàn tất" : "completed"}
                          </span>
                        </div>
                      </div>

                      {/* List of transactions */}
                      <div className="flex-1 overflow-y-auto pr-1 pb-6 space-y-3 custom-scrollbar">
                        {paymentHistory.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl px-4">
                            <History className="size-10 text-zinc-650 mb-3 animate-pulse" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                              {language === "VI" ? "Chưa có giao dịch" : "No transactions"}
                            </p>
                            <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px] leading-relaxed">
                              {language === "VI"
                                ? "Các thanh toán đăng ký gói tập thành công sẽ được kích hoạt hiển thị tại đây."
                                : "Your successfully registered package payments will be displayed here."}
                            </p>
                          </div>
                        ) : (
                          paymentHistory.map((tx) => (
                            <div
                              key={tx.id}
                              className="w-full bg-zinc-900/55 border border-zinc-850 rounded-2xl p-4 transition-all duration-150 hover:border-zinc-750 shadow-xl relative overflow-hidden flex flex-col space-y-3 animate-fade-in"
                            >
                              {/* Card Header: TX ID, Status, and Total Price */}
                              <div className="flex justify-between items-center bg-zinc-950/40 px-3 py-2 rounded-xl border border-zinc-850/60">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider bg-zinc-900 px-2 py-0.5 rounded border border-zinc-805">
                                    {tx.id}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase tracking-widest ${
                                      tx.status === "SUCCESS"
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                                        : tx.status === "FAILED"
                                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                                    }`}
                                  >
                                    {language === "VI" ? "THÀNH CÔNG" : language === "ZH" ? "成功" : "SUCCESS"}
                                  </span>
                                </div>
                                <span className="font-mono text-xs font-black text-[#D2FF00]">
                                  {tx.priceValue}
                                </span>
                              </div>

                              {/* Card Body: Structured Rows */}
                              <div className="space-y-2 bg-zinc-950/20 p-2.5 rounded-xl border border-zinc-900">
                                {/* 1. Gói tập */}
                                <div className="flex items-center justify-between text-[11px] py-1 border-b border-zinc-900/50">
                                  <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                                    <Dumbbell className="size-3.5 text-slate-500 shrink-0" />
                                    <span>{language === "VI" ? "Gói tập" : language === "ZH" ? "订购方案" : "Package"}</span>
                                  </div>
                                  <span className="font-mono text-[10px] font-black text-white uppercase tracking-wide">
                                    {tx.packageName}
                                  </span>
                                </div>

                                {/* 2. Hạn sử dụng */}
                                <div className="flex items-center justify-between text-[11px] py-1 border-b border-zinc-900/50">
                                  <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                                    <Calendar className="size-3.5 text-[#D2FF00] shrink-0" />
                                    <span>{language === "VI" ? "Hạn sử dụng" : language === "ZH" ? "有效到期" : "Expiration Date"}</span>
                                  </div>
                                  <span className="font-mono text-[10px] font-black text-[#D2FF00] tracking-wide bg-[#D2FF00]/5 px-2 py-0.5 rounded border border-[#D2FF00]/10">
                                    {tx.expiryDate || (language === "VI" ? "Chưa kích hoạt" : "Inactive")}
                                  </span>
                                </div>

                                {/* 3. Phương thức */}
                                <div className="flex items-center justify-between text-[11px] py-1 border-b border-zinc-900/50">
                                  <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                                    <CreditCard className="size-3.5 text-slate-500 shrink-0" />
                                    <span>{language === "VI" ? "Phương thức" : language === "ZH" ? "支付方式" : "Payment Method"}</span>
                                  </div>
                                  <span className="font-mono text-[10px] font-bold text-zinc-300">
                                    {tx.method}
                                  </span>
                                </div>

                                {/* 4. Ngày giao dịch */}
                                <div className="flex items-center justify-between text-[11px] py-1">
                                  <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                                    <Clock className="size-3.5 text-slate-500 shrink-0" />
                                    <span>{language === "VI" ? "Ngày giao dịch" : language === "ZH" ? "交易日期" : "Transaction Date"}</span>
                                  </div>
                                  <span className="font-mono text-[10px] text-zinc-400">
                                    {tx.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}

                  {/* ---------------- SCREEN 11: SECURITYSETTINGS (CÀI ĐẶT BẢO MẬT) ---------------- */}
                  {currentScreen === "SECURITY" && (
                    <div className="flex-1 flex flex-col justify-start px-6 pt-1 h-full animate-fade-in text-left">
                      
                      {/* Heading with return back action */}
                      <div className="flex items-center justify-between mb-4 mt-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentScreen(lastScreen || "HOME");
                            }}
                            className="p-1 -ml-1 text-slate-400 hover:text-white hover:bg-zinc-900 rounded-lg duration-150 cursor-pointer border-0 bg-transparent flex items-center justify-center"
                          >
                            <ChevronLeft className="size-5" />
                          </button>
                          <h3 className="font-display italic text-xl font-extrabold text-white uppercase leading-none tracking-wider">
                            {language === "VI" ? "CÀI ĐẶT BẢO MẬT" : "SECURITY SETTINGS"}
                          </h3>
                        </div>
                      </div>

                      {/* Horizontal Navigation Tabs */}
                      <div className="grid grid-cols-3 bg-zinc-950/70 p-1 rounded-xl border border-zinc-850/60 mb-4 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => setSecurityActiveTab("PASSWORD")}
                          className={`py-2 text-center rounded-lg font-mono text-[9px] uppercase font-black tracking-wider transition-all duration-155 cursor-pointer focus:outline-none outline-none ${
                            securityActiveTab === "PASSWORD"
                              ? "bg-[#D2FF00] text-black shadow-md font-black"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {language === "VI" ? "MẬT KHẨU" : "PASSWORD"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSecurityActiveTab("RATING")}
                          className={`py-2 text-center rounded-lg font-mono text-[9px] uppercase font-black tracking-wider transition-all duration-155 cursor-pointer focus:outline-none outline-none ${
                            securityActiveTab === "RATING"
                              ? "bg-[#D2FF00] text-black shadow-md font-black"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {language === "VI" ? "ĐÁNH GIÁ" : "RATING"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSecurityActiveTab("LANGUAGE")}
                          className={`py-2 text-center rounded-lg font-mono text-[9px] uppercase font-black tracking-wider transition-all duration-155 cursor-pointer focus:outline-none outline-none ${
                            securityActiveTab === "LANGUAGE"
                              ? "bg-[#D2FF00] text-black shadow-md font-black"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {language === "VI" ? "NGÔN NGỮ" : "LANGUAGE"}
                        </button>
                      </div>

                                     {/* TAB 1: CHANGE PASSWORD */}
                        {securityActiveTab === "PASSWORD" && (
                          <div className="w-full bg-zinc-900/55 border border-zinc-850 rounded-2xl p-4 shadow-xl backdrop-blur-md animate-fade-in">
                            <form onSubmit={handleUpdatePassword} className="space-y-3">
                              {/* 1. Old Password Field */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-extrabold block">
                                  {language === "VI" ? "MẬT KHẨU HIỆN TẠI" : "CURRENT PASSWORD"}
                                </label>
                                <div className="relative">
                                  <input
                                    type={showSecOldPassword ? "text" : "password"}
                                    value={secOldPassword}
                                    onChange={(e) => setSecOldPassword(e.target.value)}
                                    placeholder={language === "VI" ? "Nhập mật khẩu" : "Enter password"}
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:ring-0 focus:outline-none text-xs text-white placeholder-zinc-650 font-mono outline-none animate-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowSecOldPassword(!showSecOldPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition duration-150 cursor-pointer"
                                  >
                                    {showSecOldPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* 2. New Password Field */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-extrabold block">
                                  {language === "VI" ? "MẬT KHẨU MỚI (TỐI THIỂU 6 KÝ TỰ)" : "NEW PASSWORD (MIN 6 CHARS)"}
                                </label>
                                <div className="relative">
                                  <input
                                    type={showSecNewPassword ? "text" : "password"}
                                    value={secNewPassword}
                                    onChange={(e) => setSecNewPassword(e.target.value)}
                                    placeholder={language === "VI" ? "Nhập mật khẩu mới" : "Enter new password"}
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:ring-0 focus:outline-none text-xs text-white placeholder-zinc-650 font-mono outline-none animate-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowSecNewPassword(!showSecNewPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-555 hover:text-white transition duration-150 cursor-pointer"
                                  >
                                    {showSecNewPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* 3. Confirm New Password Field */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-extrabold block">
                                  {language === "VI" ? "XÁC NHẬN MẬT KHẨU MỚI" : "CONFIRM NEW PASSWORD"}
                                </label>
                                <div className="relative">
                                  <input
                                    type="password"
                                    value={secConfirmPassword}
                                    onChange={(e) => setSecConfirmPassword(e.target.value)}
                                    placeholder={language === "VI" ? "Xác nhận mật khẩu mới" : "Confirm new password"}
                                    className="w-full pl-3.5 pr-3.5 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:ring-0 focus:outline-none text-xs text-white placeholder-zinc-650 font-mono outline-none animate-none"
                                  />
                                </div>
                              </div>

                              {/* Submit Button */}
                              <button
                                type="submit"
                                disabled={isUpdatingPassword}
                                className="w-full bg-[#D2FF00] hover:bg-[#c6ef50] text-black font-mono text-[10px] font-extrabold py-3 rounded-xl transition duration-150 active:scale-98 disabled:opacity-50 cursor-pointer shadow-[0_4px_16px_rgba(210,255,0,0.18)] tracking-wider uppercase flex items-center justify-center gap-1.5 border-0 focus:outline-none focus:ring-0 outline-none mt-2"
                              >
                                {isUpdatingPassword ? (
                                  <>
                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin inline-block mr-1.5" />
                                    <span>{language === "VI" ? "ĐANG CẬP NHẬT..." : "SAVING CHANGES..."}</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="size-3.5 text-black inline" />
                                    <span className="ml-1.5 font-bold">{language === "VI" ? "CẬP NHẬT MẬT KHẨU" : "UPDATE PASSWORD"}</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </div>
                        )}


                        {/* TAB 2: SERVICE RATING */}
                        {securityActiveTab === "RATING" && (
                          <div className="w-full bg-zinc-900/55 border border-zinc-850 rounded-2xl p-4 shadow-xl backdrop-blur-md animate-fade-in space-y-3">
                            <form onSubmit={handleSubmittingServiceFeedback} className="space-y-3">
                              {/* 1. Star Rating Selector */}
                              <div className="grid grid-cols-2 gap-3 items-center bg-zinc-950/50 p-2 rounded-xl border border-zinc-850/60">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setServiceRating(star)}
                                      className="p-1 cursor-pointer border-0 bg-transparent flex items-center justify-center focus:outline-none focus:ring-0 outline-none"
                                    >
                                      <Star
                                        className={`size-4.5 ${
                                          star <= serviceRating
                                            ? "fill-[#D2FF00] text-[#D2FF00]"
                                            : "text-zinc-700"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <div className="font-mono text-[10px] font-black text-[#D2FF00] text-right uppercase">
                                  {serviceRating} / 5 {language === "VI" ? "Sao" : "Stars"}
                                </div>
                              </div>

                              {/* 2. Category selection */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-extrabold block">
                                  {language === "VI" ? "MỤC ĐÓNG GÓP Ý KIẾN" : "FEEDBACK CATEGORY"}
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { id: "PT", vi: "HLV (PT)", en: "PTs" },
                                    { id: "GYM", vi: "Thiết bị", en: "Gym Equipment" },
                                    { id: "SER", vi: "Dịch vụ CSKH", en: "Customer Support" },
                                    { id: "APP", vi: "Ứng dụng di động", en: "Mobile App" }
                                  ].map((cat) => (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      onClick={() => setServiceCategory(cat.id)}
                                      className={`py-2 px-1.5 rounded-lg border font-mono text-[9px] font-extrabold tracking-wider uppercase text-center cursor-pointer transition-all duration-155 focus:outline-none outline-none ${
                                        serviceCategory === cat.id
                                          ? "bg-[#D2FF00] border-[#D2FF00] text-black font-black"
                                          : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"
                                      }`}
                                    >
                                      {language === "VI" ? cat.vi : cat.en}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 3. Written Review Text Area */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-extrabold block">
                                  {language === "VI" ? "Ý KIẾN ĐÓNG GÓP & ĐÁNH GIÁ" : "YOUR WRITTEN FEEDBACK"} *
                                </label>
                                <textarea
                                  value={serviceFeedbackText}
                                  onChange={(e) => setServiceFeedbackText(e.target.value)}
                                  placeholder={
                                    language === "VI"
                                      ? "Chia sẻ trải nghiệm của bạn..."
                                      : "Share your workout experience..."
                                  }
                                  rows={2}
                                  className="w-full p-2.5 bg-zinc-950/50 border border-zinc-850 rounded-xl focus:border-[#D2FF00] focus:ring-0 focus:outline-none text-[11px] text-white placeholder-zinc-650 font-sans resize-none outline-none animate-none leading-relaxed"
                                />
                              </div>

                              {/* Submit Feedback button */}
                              <button
                                type="submit"
                                disabled={isSubmittingServiceFeedback}
                                className="w-full bg-[#D2FF00] hover:bg-[#c6ef50] text-black font-mono text-[10px] font-extrabold py-3.5 rounded-xl transition duration-150 active:scale-98 disabled:opacity-50 cursor-pointer shadow-[0_4px_16px_rgba(210,255,0,0.18)] tracking-wider uppercase flex items-center justify-center gap-1.5 border-0 focus:outline-none focus:ring-0 outline-none"
                              >
                                {isSubmittingServiceFeedback ? (
                                  <>
                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin inline-block mr-1.5" />
                                    <span>{language === "VI" ? "ĐANG GỬI..." : "SENDING..."}</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="size-3.5 text-black inline" />
                                    <span className="ml-1.5 font-bold">{language === "VI" ? "GỬI ĐÁNH GIÁ" : "SUBMIT FEEDBACK"}</span>
                                  </>
                                )}
                              </button>
                            </form>

                            {/* 4. Scrollable Live Feeds of Reviews */}
                            <div className="space-y-2 pt-3.5 border-t border-zinc-850">
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block mb-2">
                                {language === "VI" ? "LỊCH SỬ ĐÁNH GIÁ GẦN ĐÂY" : "RECENT EVALUATIONS"}
                              </span>
                              
                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-0.5 custom-scrollbar">
                                {serviceReviews.length === 0 ? (
                                  <div className="text-center py-6 text-zinc-650 font-mono text-[10px]">
                                    {language === "VI" ? "CHƯA CÓ ĐÁNH GIÁ NÀO" : "NO RATINGS SUBMITTED YET"}
                                  </div>
                                ) : (
                                  serviceReviews.map((rev) => (
                                    <div key={rev.id} className="p-3 bg-zinc-950 border border-zinc-850/60 rounded-xl space-y-2">
                                      <div className="flex justify-between items-center text-[10px]">
                                        <div className="font-mono text-zinc-405 font-bold flex items-center gap-1.5">
                                          <span>{rev.phoneNumber}</span>
                                          <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 border border-zinc-c rounded uppercase font-black text-[#D2FF00]">
                                            {rev.category}
                                          </span>
                                        </div>
                                        <span className="text-zinc-[450] font-mono text-[9px]">
                                          {rev.date}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((starIdx) => (
                                          <Star
                                            key={starIdx}
                                            className={`size-3 ${
                                              starIdx <= rev.rating
                                                ? "fill-[#D2FF00] text-[#D2FF00]"
                                                : "text-zinc-800"
                                            }`}
                                          />
                                        ))}
                                      </div>

                                      <p className="text-[11px] text-zinc-350 leading-relaxed font-sans font-medium">
                                        {rev.text}
                                      </p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 3: GLOBALLANGUAGE */}
                        {securityActiveTab === "LANGUAGE" && (
                          <div className="w-full bg-zinc-900/55 border border-zinc-850 rounded-2xl p-4 shadow-xl backdrop-blur-md animate-fade-in">
                            <div className="grid grid-cols-1 gap-2">
                              <button
                                type="button"
                                onClick={() => setLanguage("VI")}
                                className={`w-full py-3 px-3.5 rounded-xl border font-mono text-xs font-bold uppercase cursor-pointer flex items-center justify-between transition-all duration-155 focus:outline-none outline-none ${
                                  language === "VI"
                                    ? "bg-[#D2FF00] border-[#D2FF00] text-black shadow-[0_4px_16px_rgba(210,255,0,0.18)] font-black"
                                    : "bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-white"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <span className="text-sm">🇻🇳</span>
                                  <span>TIẾNG VIỆT</span>
                                </span>
                                {language === "VI" && <Check className="size-4 text-black font-black" />}
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setLanguage("EN")}
                                className={`w-full py-3 px-3.5 rounded-xl border font-mono text-xs font-bold uppercase cursor-pointer flex items-center justify-between transition-all duration-155 focus:outline-none outline-none ${
                                  language === "EN"
                                    ? "bg-[#D2FF00] border-[#D2FF00] text-black shadow-[0_4px_16px_rgba(210,255,0,0.18)] font-black"
                                    : "bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-white"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <span className="text-sm">🇺🇸</span>
                                  <span>ENGLISH</span>
                                </span>
                                {language === "EN" && <Check className="size-4 text-black font-black" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => setLanguage("ZH")}
                                className={`w-full py-3 px-3.5 rounded-xl border font-mono text-xs font-bold uppercase cursor-pointer flex items-center justify-between transition-all duration-155 focus:outline-none outline-none ${
                                  language === "ZH"
                                    ? "bg-[#D2FF00] border-[#D2FF00] text-black shadow-[0_4px_16px_rgba(210,255,0,0.18)] font-black"
                                    : "bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-white"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <span className="text-sm">🇨🇳</span>
                                  <span>中文 (CHINESE)</span>
                                </span>
                                {language === "ZH" && <Check className="size-4 text-black font-black" />}
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                </div>

                {/* 3. Bottom persistent tab bars styling index overlays on app screens */}
                {isLoggedScreen && (
                  <div className="h-[62px] shrink-0 bg-zinc-950 border-t border-zinc-900 grid grid-cols-4 px-1 py-1 gap-1 z-50">
                    {/* TRANG CHỦ TAB MATCHING IMAGE 5 */}
                    <button
                      onClick={() => {
                        setCurrentScreen("HOME");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "HOME" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="w-5 h-5 rounded overflow-hidden flex flex-wrap gap-[2px] p-[3px] border border-current/25">
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest uppercase font-black">{t("TRANG CHỦ", "HOME", "主页")}</span>
                    </button>

                    {/* GÓI TẬP TAB */}
                    <button
                      onClick={() => {
                        setCurrentScreen("PRICING");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "PRICING" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="p-0.5 border border-current/25 rounded-sm">
                        <CreditCard className="size-4 text-current" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest uppercase font-black">{t("GÓI TẬP", "PACKAGES", "方案")}</span>
                    </button>

                    {/* HLV AI TAB */}
                    <button
                      onClick={() => {
                        setCurrentScreen("CHAT_AI");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "CHAT_AI" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="p-0.5 border border-current/25 rounded-md">
                        <Sparkles className="size-4 text-current" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest uppercase font-black">{t("HLV AI", "AI COACH", "AI教练")}</span>
                    </button>

                    {/* NHÂN VIÊN HỖ TRỢ TAB */}
                    <button
                      onClick={() => {
                        setCurrentScreen("SUPPORT_LIST");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "SUPPORT_LIST" || currentScreen === "SUPPORT_CHAT" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="p-0.5 border border-current/40 rounded-full">
                        <User className="size-4 text-current" />
                      </div>
                      <span className="text-[7.5px] font-mono tracking-widest uppercase font-black leading-none text-center">{t("HỖ TRỢ", "SUPPORT", "客服")}</span>
                    </button>
                  </div>
                )}


                {/* IN-APP CONFIRMATION POPUP FOR LOGOUT */}
                {showLogoutConfirm && (
                  <div className="absolute inset-0 bg-black/93 backdrop-blur-md z-[999] flex flex-col justify-center items-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-950/50 border border-red-800/80 flex items-center justify-center mb-5 text-red-500 shadow-[0_4px_24px_rgba(239,68,68,0.18)]">
                      <LogOut className="size-8" />
                    </div>
                    
                    <h3 className="font-display italic text-lg font-black text-white uppercase tracking-wider leading-none mb-2">
                      {language === "VI" ? "XÁC NHẬN ĐĂNG XUẤT?" : "CONFIRM SIGN OUT?"}
                    </h3>
                    
                    <p className="text-zinc-400 text-xs mb-8 max-w-[270px] leading-relaxed font-sans">
                      {language === "VI" 
                        ? "Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng FIT GYM? Các dữ liệu tập luyện của bạn đã được đồng bộ an toàn."
                        : "Are you sure you want to sign out of the FIT GYM application? Your workout data is safely synchronized."}
                    </p>

                    <div className="w-full space-y-3">
                      <button
                        type="button"
                        onClick={handleLogoutAction}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer duration-155 border-0 focus:outline-none focus:ring-0 outline-none leading-none shadow-md transition-all active:scale-98"
                      >
                        {language === "VI" ? "XÁC NHẬN ĐĂNG XUẤT" : "CONFIRM SIGN OUT"}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer duration-155 border border-zinc-800 focus:outline-none focus:ring-0 outline-none leading-none transition-all active:scale-98"
                      >
                        {language === "VI" ? "HỦY BỎ" : "CANCEL"}
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL VIEW FOR PACKAGES INTERACTIVE CHECKOUT & TRIAL SELECTION INSIDE THE PHONE DEVICE */}
                {checkoutModalPackage && (
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-[80] flex items-center justify-center p-5 text-zinc-300">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full p-5 text-left relative animate-fade-in max-h-[85%] overflow-y-auto">
                      <button
                         onClick={() => setCheckoutModalPackage(null)}
                         type="button"
                         className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-900 p-2 rounded-xl duration-150 border border-zinc-800 cursor-pointer"
                      >
                        <X className="size-4" />
                      </button>

                      <span className="bg-zinc-900 text-[#D2FF00] border border-zinc-800 text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                        {t("BƯỚC THANH TOÁN (SIMULATOR)", "CHECKOUT STEP (SIMULATOR)", "激活步骤 (模拟交易)")}
                      </span>

                      <h3 className="font-display italic text-2xl font-extrabold text-white uppercase leading-none mt-2.5">
                        {t("KÍCH HOẠT HỘI VIÊN", "ACTIVATE MEMBERSHIP", "激活会员权益")}
                      </h3>
                      
                      {/* Package details preview */}
                      <div className="bg-zinc-900 p-4 border border-zinc-850 rounded-2xl mt-4">
                        <span className="text-[10px] text-zinc-500 font-mono">{t("GÓI CHỌN MUA:", "SELECTED PLAN:", "已选计划:")}</span>
                        <p className="font-display italic text-lg font-black text-[#D2FF00] uppercase mt-0.5">{getPkgName(checkoutModalPackage)}</p>
                        <p className="text-xl font-mono font-bold text-white mt-1.5">{checkoutModalPackage.priceValue}</p>
                        <p className="text-[10px] text-zinc-400 mt-2 font-sans italic">{getPkgDesc(checkoutModalPackage)}</p>
                      </div>

                      {/* CHỌN PHƯƠNG THỨC THANH TOÁN */}
                      <div className="mt-4">
                        <span className="text-[10px] text-zinc-500 font-mono block mb-2 uppercase tracking-wider font-bold">
                          {language === "VI" ? "PHƯƠNG THỨC THANH TOÁN:" : "PAYMENT METHOD:"}
                        </span>
                        
                        <div className="space-y-2">
                          {/* MoMo Option */}
                          <div
                            onClick={() => setSelectedPaymentMethod("Ví MoMo")}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-155 cursor-pointer ${
                              selectedPaymentMethod === "Ví MoMo"
                                ? "bg-pink-950/20 border-pink-500/80 text-white"
                                : "bg-zinc-900/60 border-zinc-850 hover:bg-zinc-850 text-zinc-400"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`size-3 rounded-full flex items-center justify-center border ${
                                selectedPaymentMethod === "Ví MoMo" ? "border-pink-500 bg-pink-500" : "border-zinc-700 bg-transparent"
                              }`}>
                                {selectedPaymentMethod === "Ví MoMo" && <div className="size-1 bg-white rounded-full" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-[#A50064] text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded leading-none">
                                  MOMO
                                </span>
                                <span className="text-[11px] font-medium font-sans">
                                  {language === "VI" ? "Ví điện tử MoMo" : "MoMo E-Wallet"}
                                </span>
                              </div>
                            </div>
                            <Smartphone className="size-3.5 opacity-60" />
                          </div>

                          {/* ZaloPay Option */}
                          <div
                            onClick={() => setSelectedPaymentMethod("Ví ZaloPay")}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-155 cursor-pointer ${
                              selectedPaymentMethod === "Ví ZaloPay"
                                ? "bg-blue-950/20 border-blue-500/80 text-white"
                                : "bg-zinc-900/60 border-zinc-850 hover:bg-zinc-850 text-zinc-400"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`size-3 rounded-full flex items-center justify-center border ${
                                selectedPaymentMethod === "Ví ZaloPay" ? "border-blue-500 bg-blue-500" : "border-zinc-700 bg-transparent"
                              }`}>
                                {selectedPaymentMethod === "Ví ZaloPay" && <div className="size-1 bg-white rounded-full" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-[#0084FF] text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded leading-none">
                                  ZALOPAY
                                </span>
                                <span className="text-[11px] font-medium font-sans">
                                  {language === "VI" ? "Ví điện tử ZaloPay" : "ZaloPay E-Wallet"}
                                </span>
                              </div>
                            </div>
                            <Smartphone className="size-3.5 opacity-60" />
                          </div>

                          {/* Bank Transfer Option */}
                          <div
                            onClick={() => setSelectedPaymentMethod("Ngân hàng (Internet Banking)")}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-155 cursor-pointer ${
                              selectedPaymentMethod === "Ngân hàng (Internet Banking)" || selectedPaymentMethod === "Chuyển khoản QR"
                                ? "bg-emerald-950/20 border-emerald-500/80 text-white"
                                : "bg-zinc-900/60 border-zinc-850 hover:bg-zinc-850 text-zinc-400"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`size-3 rounded-full flex items-center justify-center border ${
                                selectedPaymentMethod === "Ngân hàng (Internet Banking)" || selectedPaymentMethod === "Chuyển khoản QR" ? "border-emerald-500 bg-emerald-500" : "border-zinc-700 bg-transparent"
                              }`}>
                                {(selectedPaymentMethod === "Ngân hàng (Internet Banking)" || selectedPaymentMethod === "Chuyển khoản QR") && <div className="size-1 bg-white rounded-full" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-emerald-600 text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded leading-none">
                                  BANK
                                </span>
                                <span className="text-[11px] font-medium font-sans">
                                  {language === "VI" ? "Thanh toán bằng Ngân hàng" : "Bank Transfer / ATM"}
                                </span>
                              </div>
                            </div>
                            <CreditCard className="size-3.5 opacity-60" />
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed font-sans italic">
                        {t(
                          "* Đây là tính năng mô phỏng để người dùng nghiệm thu phần mềm cổng FIT GYM. Khi chọn phương thức thanh toán và bấm \"XÁC NHẬN\", hệ thống sẽ tự động gán gói và mở khóa mã QR check-in ở Trang Chủ ngay lập tức!",
                          "* This is a simulated checkout flow for demonstration purposes. Once you select a payment method and click \"CONFIRM\", the system will immediately activate your membership package and unlock the check-in QR code on the Home tab!",
                          "* 这是用于系统演示的模拟付款流程。选择付款方式并点击“确认”后，系统将立即为您激活会员方案并解锁主页的签到二维码！"
                        )}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <button
                          onClick={() => setCheckoutModalPackage(null)}
                          type="button"
                          className="py-3 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white rounded-xl text-[10px] font-bold uppercase transition duration-155 font-mono cursor-pointer text-center"
                        >
                          {t("HỦY BỎ", "CANCEL", "取消")}
                        </button>
                        
                        <button
                          onClick={handleConfirmPurchase}
                          type="button"
                          className="py-3 bg-[#D2FF00] hover:bg-[#c6ef00] text-black rounded-xl text-[10px] font-black uppercase transition duration-155 font-sans flex items-center justify-center gap-1 cursor-pointer shadow-[0_4px_15px_rgba(210,255,0,0.18)]"
                        >
                          <CheckCircle className="size-3.5 text-black" />
                          <span>{t("XÁC NHẬN", "CONFIRM", "确认")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                {/* Simulated physical Home Indicator line at bottom of phone */}
                <div className="w-full h-4 bg-zinc-950 shrink-0 flex items-center justify-center pb-1">
                  <div className="w-[120px] h-[4px] bg-zinc-800 rounded-full" />
                </div>

              </div>
            </div>
            
            {/* FLOATING ACTION BRAND BUTTON (Sparkles glow icon bottom-right) match image 5 */}
            {isLoggedScreen && (
              <button
                onClick={() => {
                  if (didDragMoved.current) {
                    // It was a drag, do not trigger click
                    return;
                  }
                  setCurrentScreen("CHAT_AI");
                  showToast(language === "VI" ? "Huấn luyện viên ảo AI Coach đã sẵn sàng!" : "Virtual AI Coach is fully ready!");
                }}
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  setIsDraggingFab(true);
                  didDragMoved.current = false;
                  dragStartPos.current = { x: e.clientX, y: e.clientY };
                  currentOffsetStart.current = { ...fabOffset };
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 0) return;
                  setIsDraggingFab(true);
                  didDragMoved.current = false;
                  const touch = e.touches[0];
                  dragStartPos.current = { x: touch.clientX, y: touch.clientY };
                  currentOffsetStart.current = { ...fabOffset };
                }}
                type="button"
                id="floating-glow-action-button"
                style={{
                  transform: `translate(${fabOffset.x}px, ${fabOffset.y}px)`,
                }}
                className={`absolute bottom-24 right-14 w-12 h-12 rounded-full bg-[#D2FF00] hover:bg-[#c6ef00] text-black border border-black/10 shadow-[0_0_20px_rgba(210,255,0,0.4)] hover:shadow-[0_0_30px_rgba(210,255,0,0.6)] flex items-center justify-center select-none font-bold z-[100] cursor-grab active:cursor-grabbing transition-transform duration-75 ${
                  isDraggingFab
                    ? "scale-110 ring-2 ring-white/50 shadow-[0_0_35px_rgba(210,255,0,0.85)]"
                    : (fabOffset.x === 0 && fabOffset.y === 0 ? "animate-bounce hover:scale-105" : "hover:scale-105")
                }`}
                title={language === "VI" ? "Nhấn giữ và kéo để di chuyển" : "Hold & drag to move around"}
              >
                <Sparkles className="size-[22px] text-black animate-pulse" />
              </button>
            )}

        </div>
      </div>
    </div>
  );
}
