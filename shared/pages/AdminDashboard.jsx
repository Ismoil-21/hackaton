import { RequestsView } from '@shared/components/RequestsView';

export default function AdminDashboard() {
  return (
    <RequestsView
      scope="all"
      showOwner
      subtitle="Barcha foydalanuvchilar yozuvlari"
    />
  );
}
