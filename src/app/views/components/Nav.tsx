import clx from 'classnames';
import type { HonoRequest } from 'hono';
import type { FC } from 'hono/jsx';
import { Icon } from '../elements/Icon';

type Props = {
  req: HonoRequest;
};

export const Nav: FC<Props> = ({ req }) => (
  <nav class='navbar is-fixed-top is-dark'>
    <div class='navbar-brand'>
      <a class='navbar-item is-size-5 has-text-weight-bold has-text-primary' href='/'>
        <Icon name='troubleshoot' />
        Analyzarr
      </a>
    </div>

    <div class='navbar-menu'>
      <div class='navbar-start'>
        <a
          class={clx('navbar-item', { 'has-text-primary': req.path.startsWith('/libraries') })}
          href='/libraries'
        >
          Libraries
        </a>
      </div>
    </div>
  </nav>
);
