import { TransactionStatusEnum } from '../enums/transaction.enum';
import { WaitlistInterestEnum } from '../enums/waitlist.enum';

export interface IWelcomeEmailTemplate {
  name: string;
}

export interface IVerifyEmailTemplate {
  code: number;
}

export type ISendResetPasswordEmailTemplate = IVerifyEmailTemplate;

export interface IGenericOtpEmailTemplate {
  message: string;
  code: number;
  expirationTime: number;
}

export interface IOrderInvoiceTemplate {
  buyerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    product: {
      name: string;
      pricePerPortion: number;
    };
    quantity: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  shoppingFee: number;
  totalAmount: number;
  deliveryType: string;
  deliveryAxis: {
    name: string;
  };
  deliveryAddress: string;
  currencySymbol: string;
  recipientCode: string;
}

export interface IOrderNotificationSellerTemplate {
  sellerName: string;
  orderNumber: string;
  orderDate: string;
  buyerName: string;
  items: Array<{
    product: {
      name: string;
      pricePerPortion: number;
    };
    quantity: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  shoppingFee: number;
  deliveryType: string;
  deliveryAxis: {
    name: string;
  };
  deliveryAddress: string;
  currencySymbol: string;
}

export interface IOrderCompletionTemplate {
  buyerName: string;
  orderNumber: string;
  categories: string[];
}

export interface IWaitlistEmailTemplate {
  fullName: string;
  interest: WaitlistInterestEnum;
}

export interface IWithdrawalRequestUpdateTemplate {
  fullName: string;
  currencySymbol: string;
  date: string;
  amount: number;
  accountNumber: string;
  bankName: string;
  note: string;
  reference: string;
  status: TransactionStatusEnum;
}
