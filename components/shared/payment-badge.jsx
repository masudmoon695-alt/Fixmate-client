import { Badge } from '@/components/ui/badge';
import { PAYMENT_STATUS_LABELS } from '@/lib/constants';

export function PaymentBadge({ paymentStatus }) {
  const label = PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus;
  const styles =
    paymentStatus === 'paid'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border dark:border-emerald-900/30 border-emerald-100'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border dark:border-amber-900/30 border-amber-100';

  return <Badge className={styles}>{label}</Badge>;
}
