import { writable } from 'svelte/store';
import { getEmojiFlag } from '../../utils';

export interface VGateServer {
  host: string;
  ip: string;
  score: number;
  ping: number;
  speed: number;
  country: string;
  flag: string;
  sessions: number;
  uptime: number;
  users: number;
  traffic: number;
  logs: string;
  operator: string;
  message?: string;
  configBase64: string;
}

// const url = '/_data.json';
const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
  'http://www.vpngate.net/api/iphone/'
)}`;

interface UrlResponse {
  contents: string;
  url: string;
  content_type: string;
  content_length: null;
  http_code: number;
  response_time: number;
}

async function requestData(): Promise<string> {
  const rs = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: { Accept: 'application/json' }
  });
  if (rs.status >= 400) {
    const text = await rs.text();
    throw new Error(`${rs.status}: ${text || rs.statusText}`);
  }
  const json: UrlResponse = await rs.json();
  if (json.http_code >= 400) {
    throw new Error(`Request ${json.url} failed with code ${json.http_code}`);
  }
  return json.contents;
}

function parseCsv(data: string): { keys: string[]; rows: Record<string, string>[] } {
  if (!data) {
    throw new Error('CSV data is empty');
  }
  const lines = data.replace(/\*([^*]+)\*/, '$1').split(/[\r\n]+/);
  if (lines[0].startsWith('vpn_servers')) {
    lines.shift();
  }

  const keys = lines[0].split(',');
  lines.shift();

  const parseLine = (line: string) => {
    if (line) {
      return line.split(',').reduce((a, val, i) => {
        a[keys[i]] = val;
        return a;
      }, {});
    }
  };
  const rows = lines.map(parseLine).filter((i) => !!i);

  return { keys, rows };
}

const requiredKeys = [
  '#HostName',
  'IP',
  'Score',
  'Ping',
  'Speed',
  'CountryLong',
  'CountryShort',
  'NumVpnSessions',
  'Uptime',
  'TotalUsers',
  'TotalTraffic',
  'LogType',
  'Operator',
  'OpenVPN_ConfigData_Base64'
];

export async function load(): Promise<VGateServer[]> {
  const csv = parseCsv(await requestData());
  const missingKeys = requiredKeys.filter((k) => !csv.keys.includes(k));
  if (missingKeys.length > 0) {
    throw new Error(`Missing requred fields: ${missingKeys.join(', ')}`);
  }
  return csv.rows.map((r) => ({
    host: r['#HostName'],
    ip: r.IP,
    score: +r.Score,
    ping: +r.Ping,
    speed: +r.Speed,
    country: r.CountryLong,
    flag: getEmojiFlag(r.CountryShort),
    sessions: +r.NumVpnSessions,
    uptime: +r.Uptime,
    users: +r.TotalUsers,
    traffic: +r.TotalTraffic,
    logs: r.LogType,
    operator: r.Operator,
    message: r.Message || undefined,
    configBase64: r.OpenVPN_ConfigData_Base64
  }));
}

export interface VGateStore {
  isLoading: boolean;
  servers?: VGateServer[];
  error?: string;
}

export function createStore() {
  const { subscribe, set } = writable<VGateStore>({ isLoading: false });

  return {
    set,
    subscribe,
    async reload() {
      set({ isLoading: true });
      try {
        set({ isLoading: false, servers: await load() });
      } catch (e) {
        set({ isLoading: false, error: (e as Error).message });
      }
    }
  };
}

const store = createStore();

export default store;
