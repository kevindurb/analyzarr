import byteSize from 'byte-size';
import { css, keyframes } from 'hono/css';
import type { FC } from 'hono/jsx';
import type { HtmlEscapedString } from 'hono/utils/html';

type DataItem = {
  key: string | null;
  value: bigint | null;
};

type Element = HtmlEscapedString | Promise<HtmlEscapedString> | null;

type Props = {
  heading: string | Element;
  data: DataItem[];
  columns: [string, string];
  renderKey: FC<{ item: DataItem }>;
};

const PRECISION = 1e2;

const getSize = (a: bigint | null, b: bigint | null) =>
  Number(((a ?? 0n) * BigInt(PRECISION)) / (b ?? 0n)) / PRECISION;

const scaleInAnimation = keyframes`
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
`;

const rowStyles = css`
  & a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & td {
    --color: var(--bulma-grey);
    transform-origin: left;
    animation: ${scaleInAnimation};
    animation-duration: 1s;
    min-height: 2rem !important;
  }
`;

export const GroupedStats: FC<Props> = ({ heading, columns, data, renderKey }) => {
  const total = data.reduce((acc, { value }) => acc + (value ?? 0n), 0n);
  return (
    <table class='charts-css bar show-heading show-labels hide-data p-2 data-spacing-4'>
      <caption class='is-size-4 subtitle'>{heading}</caption>
      <thead>
        <tr>
          <th>{columns[0]}</th>
          <th>{columns[1]}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const { value } = item;
          return (
            <tr class={rowStyles}>
              <th scope='row'>{renderKey({ item })}</th>
              <td style={`--size: ${getSize(value, total)}`}>
                <span class='data'>{byteSize(Number(value)).toString()}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
