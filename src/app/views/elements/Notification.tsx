import { cx } from 'hono/css';
import type { FC, PropsWithChildren } from 'hono/jsx';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

type Props = {
  type: NotificationType;
};

const getTypeClass = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return 'is-info';
    case 'success':
      return 'is-success';
    case 'warning':
      return 'is-warning';
    case 'error':
      return 'is-danger';
    default:
      return '';
  }
};

export const Notification: FC<PropsWithChildren<Props>> = ({ type, children }) => (
  <div
    class={cx(
      'notification',
      'animate__animated',
      'animate__fadeOutRight',
      'animate__delay-5s',
      getTypeClass(type),
    )}
  >
    {children}
  </div>
);
