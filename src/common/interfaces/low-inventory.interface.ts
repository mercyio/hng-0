export interface ILowInventoryEmailTemplate {
  merchantName: string;
  productName: string;
  currentStock: number;
  threshold: number;
}
