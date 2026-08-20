import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

export function ConfirmDialog({ open, title = 'Tasdiqlang', message, confirmLabel = 'O‘chirish', loading, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Bekor qilish</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
