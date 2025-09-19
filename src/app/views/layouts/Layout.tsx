import clx from 'classnames';
import type { Context } from 'hono';
import { html } from 'hono/html';
import type { FC, PropsWithChildren } from 'hono/jsx';
import type { AppEnv } from '@/app/types';
import { Nav } from '@/app/views/components/Nav';
import { IconStylesheetLink } from '../elements/Icon';
import { Notification } from '../elements/Notification';

type Props = PropsWithChildren & {
  c: Context<AppEnv>;
};

export const Layout: FC<Props> = ({ children, c }) => {
  const successNotification = c.get('session').get('success');
  const infoNotification = c.get('session').get('success');
  const warningNotification = c.get('session').get('warning');
  const errorNotification = c.get('session').get('error');

  return html`
    <!doctype html>
    ${(
      <html lang='en' data-bs-theme='dark'>
        <head>
          <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='color-scheme' content='light dark' />
          <IconStylesheetLink />
          <link
            rel='stylesheet'
            href='https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css'
          />
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
          />
          <link rel='stylesheet' href='/css/main.css' />
          <title>Analyzarr</title>
        </head>
        <body class='has-navbar-fixed-top'>
          <Nav req={c.req} />
          <main class='container my-4'>{children}</main>
          <div
            class={clx(
              'p-2',
              'z-40',
              'is-flex',
              'is-flex-direction-column',
              'is-fixed',
              'is-top-right',
            )}
          >
            {successNotification && (
              <Notification type='success'>{successNotification}</Notification>
            )}
            {infoNotification && <Notification type='info'>{infoNotification}</Notification>}
            {warningNotification && (
              <Notification type='warning'>{warningNotification}</Notification>
            )}
            {errorNotification && <Notification type='error'>{errorNotification}</Notification>}
          </div>
        </body>
      </html>
    )}
  `;
};
