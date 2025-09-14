export type Product = {
  id: string;
  variantProductId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  orderId: string;
  quantity: string;
  price: string;
  media: any[];
};

export type OrderHistory = {
  id: string;
  status: string;
  changedBy: string;
  createdAt: string;
};

export type Address = {
  id: string;
  flatNo: string;
  floorNo: string;
  addressLine: string;
  name: string;
  phoneNo: string;
  deliveryNotes: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type Order = {
  id: string;
  userId: string;
  subTotal: number;
  discount: number;
  couponId: string | null;
  afterDiscountTotal: number;
  deliveryCharge: number;
  deliveryZoneId: string;
  total: number;
  preferredDeliveryDateAndTime: string;
  paymentMethodId: string;
  paymentMethodTitle: string;
  transactionNo: string | null;
  transactionPhoneNo: string | null;
  transactionDate: string | null;
  address: Address;
  paymentStatus: string;
  orderStatus: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  productList: Product[];
  orderHistory: OrderHistory[];
};

export type Pagination = {
  offset: number;
  limit: number;
  total: number;
  currentCount: number;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data: Order[];
  pagination: Pagination;
  _links: {
    self: { href: string };
    next: string | null;
    previous: string | null;
    collection: { href: string };
  };
};

export type OrderDetail = {
  date: string;
  timeline: { status: string; time: string; description: string }[];
  items: {
    name: string;
    quantity: number;
    price: number;
    media: { id: string; url: string };
  }[];
  shipping: { name: string; address: string; phone: string };
  payment: {
    method: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    paymentStatus: string;
  };
};
