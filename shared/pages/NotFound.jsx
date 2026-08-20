import { Link } from 'react-router-dom';
import { Button } from '@shared/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-semibold text-slate-300">404</p>
      <p className="text-slate-600">Sahifa topilmadi</p>
      <Link to="/"><Button>Bosh sahifaga</Button></Link>
    </div>
  );
}
