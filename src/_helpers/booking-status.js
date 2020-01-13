export function getStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'confirmed':
      return 'green';
    case 'checked_in':
      return 'blue';
    case 'cancelled':
      return 'red';
    default:
      return 'grey';
  }
}

export function statusDisplay(status) {
  let statuses = status.split('_');
  statuses = statuses.map((status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  });
  return statuses.join(' ');
}