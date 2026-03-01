// lib/formatPrice.ts
export function formatPrice(amount: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
