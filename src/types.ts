export interface UserSession {
  fullName: string;
  phoneNumber: string;
  password?: string;
  address?: string;
  gender?: string;
  birthDate?: string;
  memberCode: string; // e.g. #0013
  memberClass: string; // e.g. CLASS_PLATINUM
  isRegistered: boolean; // default false, turns true after completing sign-up
  isLoggedIn: boolean; // default false
  workoutsCount: number;
}

export type AppScreen =
  | "LOGIN"
  | "REGISTER_STEP_1"
  | "REGISTER_STEP_2"
  | "REGISTER_STEP_3"
  | "HOME"
  | "PRICING"
  | "CHAT_AI"
  | "SUPPORT_LIST"
  | "SUPPORT_CHAT"
  | "PROFILE"
  | "PAYMENT_HISTORY"
  | "SECURITY";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface GymPackage {
  id: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  durationLabel: string;
  durationLabelEn?: string;
  durationLabelZh?: string;
  priceValue: string;
  originalPrice?: string;
  description: string;
  descriptionEn?: string;
  descriptionZh?: string;
  features: string[];
  featuresEn?: string[];
  featuresZh?: string[];
  gradient: string;
}

export interface SupportContact {
  id: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  roleLabel: string;
  roleLabelEn?: string;
  roleLabelZh?: string;
  avatarChar: string;
  bio: string;
  bioEn?: string;
  bioZh?: string;
  initialMessage: string;
  initialMessageEn?: string;
  initialMessageZh?: string;
  category: "pt" | "support";
  isOnline: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: "welcome" | "auth" | "promo" | "workout" | "billing" | "message";
}

export interface PaymentTransaction {
  id: string;
  packageName: string;
  priceValue: string;
  timestamp: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  method: string;
  expiryDate?: string;
}

