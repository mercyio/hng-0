import {
  IOrderInvoiceTemplate,
  IOrderNotificationSellerTemplate,
} from '../../../../common/interfaces/email-templates.interface';
import { baseTemplate } from './base-template.mail';
import { BaseHelper } from 'src/common/utils/helper/helper.util';

export function orderInvoiceEmailTemplate(data: IOrderInvoiceTemplate) {
  const isPickup = data.deliveryType === 'PICKUP';
  const content = `
    <h1>Order Confirmation</h1>
    <p>Dear ${data.buyerName},</p>
    <p>Thank you for your purchase. Your order has been successfully processed.</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #28a745;">
      <h3 style="margin-top: 0; color: #28a745;">Important</h3>
      <p>Your order confirmation code is: <strong style="font-size: 1.2em; letter-spacing: 2px;">${
        data.recipientCode
      }</strong></p>
      <p>Please provide this code to the merchant or delivery person when receiving your order. This helps ensure secure delivery of your items.</p>
    </div>

    <h2>Order Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Order Number</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.orderNumber
        }</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.orderDate}</td>
      </tr>
    </table>

    <h2>Items Ordered</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price Per Unit</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${data.items
          .map(
            (item) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.product.name
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.quantity
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              data.currencySymbol
            }${BaseHelper.changeToCurrency(item.product.pricePerPortion)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              data.currencySymbol
            }${BaseHelper.changeToCurrency(
              item.quantity * item.product.pricePerPortion,
            )}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>

    <h2>Order Summary</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Subtotal</th>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
          data.currencySymbol
        }${BaseHelper.changeToCurrency(data.subtotal)}</td>
      </tr>
      ${
        !isPickup
          ? `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Delivery Fee</th>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
          data.currencySymbol
        }${BaseHelper.changeToCurrency(data.deliveryFee)}</td>
      </tr>
      `
          : ''
      }
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Total Amount</th>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${
          data.currencySymbol
        }${BaseHelper.changeToCurrency(data.totalAmount)}</td>
      </tr>
    </table>

    <h2>${isPickup ? 'Pickup' : 'Delivery'} Information</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${
          isPickup ? 'Pickup Type' : 'Delivery Type'
        }</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.deliveryType
        }</td>
      </tr>
      ${
        isPickup
          ? `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Pickup Location</th>
        <td style="border: 1px solid #ddd; padding: 8px;">Merchant's Location</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Note</th>
        <td style="border: 1px solid #ddd; padding: 8px;">Please contact the merchant for specific pickup instructions.</td>
      </tr>
      `
          : `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Delivery Location</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.deliveryAxis?.name || 'N/A'
        }</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Delivery Address</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.deliveryAddress || 'N/A'
        }</td>
      </tr>
      `
      }
    </table>

    <p style="margin-top: 20px;">If you have any questions about your order, please don't hesitate to contact our customer service.</p>
    <p>Thank you for shopping with us!</p>
  `;

  return baseTemplate({
    title: 'Order Confirmation',
    content: content,
  });
}

export function orderNotificationSellerEmailTemplate(
  data: IOrderNotificationSellerTemplate,
) {
  const isPickup = data.deliveryType === 'PICKUP';
  const content = `
    <h1>New Order Notification</h1>
    <p>Dear ${data.sellerName},</p>
    <p>You have received a new order. Please find the details below:</p>
    
    <h2>Order Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Order Number</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.orderNumber
        }</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.orderDate}</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Buyer</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.buyerName}</td>
      </tr>
    </table>

    <h2>Items Ordered</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price Per Unit</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${data.items
          .map(
            (item) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.product.name
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.quantity
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              data.currencySymbol
            }${BaseHelper.changeToCurrency(item.product.pricePerPortion)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              data.currencySymbol
            }${BaseHelper.changeToCurrency(
              item.quantity * item.product.pricePerPortion,
            )}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>

    <h2>Order Summary</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Subtotal</th>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
          data.currencySymbol
        }${BaseHelper.changeToCurrency(data.subtotal)}</td>
      </tr>
      ${
        !isPickup
          ? `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Delivery Fee</th>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
          data.currencySymbol
        }${BaseHelper.changeToCurrency(data.deliveryFee)}</td>
      </tr>
      `
          : ''
      }
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Service Fee</th>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
          data.currencySymbol
        }${BaseHelper.changeToCurrency(data.shoppingFee)}</td>
      </tr> 
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Total Amount</th>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${
          data.currencySymbol
        }${BaseHelper.changeToCurrency(data.totalAmount)}</td>
      </tr>
    </table>

    <h2>${isPickup ? 'Pickup' : 'Delivery'} Information</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${
          isPickup ? 'Pickup Type' : 'Delivery Type'
        }</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.deliveryType
        }</td>
      </tr>
      ${
        isPickup
          ? `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Pickup Location</th>
        <td style="border: 1px solid #ddd; padding: 8px;">Your Store Location</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Action Required</th>
        <td style="border: 1px solid #ddd; padding: 8px;">Please prepare the order for pickup and contact the buyer with pickup instructions.</td>
      </tr>
      `
          : `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Delivery Location</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.deliveryAxis?.name || 'N/A'
        }</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Delivery Address</th>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          data.deliveryAddress || 'N/A'
        }</td>
      </tr>
      `
      }
    </table>

    <p style="margin-top: 20px;">Please process this order as soon as possible. If you have any questions or concerns, please contact our support team.</p>
    <p>Thank you for your prompt attention to this order.</p>
  `;

  return baseTemplate({
    title: 'New Order Notification',
    content: content,
  });
}
