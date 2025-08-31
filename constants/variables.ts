export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
export const API_URL = "https://api.safefoods.com.bd/api"; // process.env.API_URL;

//categories
export const PROTEINS = "proteins";
export const DAIRY = "dairy";
export const MEAT = "meat";
export const EGG = "egg";
export const CHICKEN = "chicken";
export const FISH = "fish";
export const FRUITS = "fruits";
export const VEGETABLES = "vegetables";
export const OIL = "oil";
export const HONEY = "honey";

// discount types
export const DISCOUNT_TYPE_PERCENTAGE = "percentage";
export const DISCOUNT_TYPE_FIXED = "fixed";

// order statuses
export const ORDER_STATUS_PENDING = "pending";
export const ORDER_STATUS_PROCESSING = "processing";
export const ORDER_STATUS_DELIVERED = "delivered";

//payment methods
export const PAYMENT_METHOD_CASH_ON_DELIVERY = "cash on delivery";
export const PAYMENT_METHOD_BKASH = "bkash";
export const PAYMENT_METHOD_NAGAD = "nagad";
export const PAYMENT_METHOD_CARD = "card";

export const WHATSAPP_PHONE_NUMBER = "+8801332945561";
