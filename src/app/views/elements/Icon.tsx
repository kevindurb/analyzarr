import querystring from 'node:querystring';
import type { FC } from 'hono/jsx';

const iconNames = [
  'add',
  'check',
  'delete',
  'download',
  'edit',
  'link_off',
  'movie',
  'save',
  'scan',
  'storage',
  'troubleshoot',
  'tv',
] as const;
type IconName = (typeof iconNames)[number];

type Props = {
  name: IconName;
};

const styles = {
  'font-size': 'inherit',
  'line-height': 'inherit',
};

export const Icon: FC<Props> = ({ name }) => (
  <i style={styles} class='material-symbols-outlined'>
    {name}
  </i>
);

const iconQueryString = querystring.stringify({
  family: 'Material Symbols Outlined',
  icon_names: iconNames.join(','),
  display: 'block',
});

const ICON_BASE_URL = `https://fonts.googleapis.com/icon?&${iconQueryString}`;

export const IconStylesheetLink: FC = () => <link href={ICON_BASE_URL} rel='stylesheet' />;
