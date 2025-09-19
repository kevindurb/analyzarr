import clx from 'classnames';
import type { FC, PropsWithChildren } from 'hono/jsx';

type Props = {
  href?: string;
  type?: 'primary' | 'info';
};

export const Fab: FC<PropsWithChildren<Props>> = ({ children, href, type }) => {
  const classes = clx(
    'is-fixed',
    'is-bottom-right',
    'm-5',
    'button',
    'is-medium',
    'is-rounded',
    'is-size-3',
    {
      'is-primary': type === 'primary' || !type,
      'is-info': type === 'info',
    },
  );
  if (href) {
    return (
      <a href={href} class={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type='submit' class={classes}>
      {children}
    </button>
  );
};
