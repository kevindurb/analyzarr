import clx from 'classnames';
import type { FC, PropsWithChildren } from 'hono/jsx';

type Props = {
  type: 'success' | 'info' | 'warning' | 'error';
};

export const Notification: FC<PropsWithChildren<Props>> = ({ type, children }) => (
  <div
    class={clx('notification', 'animate__animated', 'animate__fadeOutRight', 'animate__delay-5s', {
      'is-info': type === 'info',
      'is-success': type === 'success',
      'is-warning': type === 'warning',
      'is-danger': type === 'error',
    })}
  >
    {children}
  </div>
);
