/**
 * Tipos de controle de estoque
 * Consolidado de hooks/use-stock.ts
 */

export interface StockMedication {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  minStock: number;
}

export interface StockAlert {
  medicationId: string;
  medicationName: string;
  currentStock: number;
  minStock: number;
  severity: 'low' | 'out';
}

export interface UpdateStockData {
  stock: number;
  notes?: string;
}
