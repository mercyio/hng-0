import { CacheHelperUtil } from 'src/common/utils/cache-helper.util';
import { IOrderCompletionTemplate } from '../../../../common/interfaces/email-templates.interface';
import { baseTemplate } from './base-template.mail';
import { ISettings } from 'src/common/interfaces/setting.interface';

export async function orderCompletionEmailTemplate(
  data: IOrderCompletionTemplate,
) {
  const appSettings = (await CacheHelperUtil.getAppSettings()) as ISettings;
  const productPageUrl = appSettings?.app?.urls?.productsPage;

  const content = `
    <p>Dear ${data.buyerName},</p>
    
    <p>We're delighted to confirm that your order #${
      data.orderNumber
    } has been successfully completed. Thank you for choosing our platform!</p>

    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <h3 style="color: #856404; margin-top: 0;">Discover More Amazing Products</h3>
      <p>We've noticed you have great taste in ${data.categories.join(
        ', ',
      )}! Our marketplace has many more exciting products waiting for you.</p>
      
      <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 15px;">
        <p style="margin: 0; font-weight: bold; color: #28a745;">💡 Did You Know?</p>
        <p style="margin: 10px 0 0 0;">
          Our sellers regularly add new products to their stores. Check back often to discover the latest additions!
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <a href="${productPageUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore More Products</a>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #666;">
        Your satisfaction is our priority. We look forward to serving you again soon!
      </p>
      <p style="color: #28a745; font-weight: bold; margin-top: 20px;">
        Happy Shopping! 🛍️
      </p>
    </div>
  `;

  return baseTemplate({
    title: 'Order Completion',
    content,
  });
}
