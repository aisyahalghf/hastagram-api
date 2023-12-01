export interface CreateTransferDto {
  recipient: string;
  nominal: number;
  description?: string;
}
