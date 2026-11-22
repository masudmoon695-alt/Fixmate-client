import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, STATUS_STYLES, APPROVAL_STATUS_LABELS, APPROVAL_STATUSES } from '@/lib/constants';

export function StatusBadge({ status }) {
  const styles =
    STATUS_STYLES[status] ||
    (APPROVAL_STATUSES.includes(status) ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800');
  const label = STATUS_LABELS[status] || APPROVAL_STATUS_LABELS[status] || status;

  return <Badge className={styles}>{label}</Badge>;
}
