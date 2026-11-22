export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(amount) {
  const value = Number(amount || 0);
  return `$${value.toFixed(2)}`;
}
