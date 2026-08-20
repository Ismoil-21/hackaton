import { RequestsView } from '@shared/components/RequestsView';
import { useAuth } from '@shared/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <RequestsView
      scope="mine"
      subtitle={`Salom, ${user?.name}. Bu yerda faqat sizning yozuvlaringiz.`}
    />
  );
}
