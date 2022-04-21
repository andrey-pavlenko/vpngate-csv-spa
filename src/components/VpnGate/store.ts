import { writable } from 'svelte/store';
import { csv, getEmojiFlag } from '../../utils';

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

const url = '/_data';
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
  const _csv = (await new csv.Csv().fetch(url)).parse();
  const missingKeys = requiredKeys.filter((k) => !_csv.keys.includes(k));
  if (missingKeys.length > 0) {
    throw new Error(`Missing requred fields: ${missingKeys.join(', ')}`);
  }
  return _csv.rows.map((r) => ({
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
