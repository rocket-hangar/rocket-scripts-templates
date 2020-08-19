import { Subject } from 'rxjs';
import { ProxyConfigArray, ProxyConfigMap } from 'webpack-dev-server';
import { TimeMessage } from '../types';
interface Params {
    proxyConfig: ProxyConfigMap | ProxyConfigArray;
    subject: Subject<TimeMessage[]>;
}
export declare function patchProxyLogger({ proxyConfig, subject }: Params): ProxyConfigMap | ProxyConfigArray;
export {};
