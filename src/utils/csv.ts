export class CvsError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'CvsError';
    this.code = code;
  }
}

export type CsvRow = Record<string, string>;

export class Csv {
  url?: string;
  source?: string;
  keys?: string[];
  rows?: CsvRow[];

  async fetch(url: string) {
    this.url = url;

    const rs = await fetch(url);
    if (rs.status >= 400) {
      if (this.source) {
        delete this.source;
      }
      throw new CvsError('FETCH_ERROR', `${rs.status}: ${rs.statusText}`);
    }
    this.source = await rs.text();
    return this;
  }

  parse() {
    if (!this.source) {
      throw new CvsError('PARSE_ERROR', 'Initial data is empty');
    }

    const lines = this.source.replace(/\*([^*]+)\*/, '$1').split(/[\r\n]+/);
    if (lines[0].startsWith('vpn_servers')) {
      lines.shift();
    }

    this.keys = lines[0].split(',');
    lines.shift();

    const parseLine = (line: string) => {
      if (line) {
        return line.split(',').reduce<CsvRow>((a, val, i) => {
          a[this.keys[i]] = val;
          return a;
        }, {});
      }
    };
    this.rows = lines.map(parseLine).filter((i) => !!i);
    return this;
  }
}
