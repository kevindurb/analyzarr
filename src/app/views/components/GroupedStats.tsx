import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';

type DataItem = {
  key: string | null;
  value: bigint | null;
};

type Props = {
  heading: string | Element;
  data: DataItem[];
  columns: [string, string];
  renderKey: FC<{ item: DataItem }>;
};

const getSize = (a: bigint | null, b: bigint | null) =>
  Number(((a ?? 0n) * 10000n) / (b ?? 0n)) / 10000;

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
            <tr>
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
