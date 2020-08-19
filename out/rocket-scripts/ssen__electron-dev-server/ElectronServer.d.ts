export interface ElectronServerParams {
    dir: string;
    main: string;
    argv: string[];
}
export declare class ElectronServer {
    private params;
    private proc;
    private watcher;
    constructor(params: ElectronServerParams);
    restart: () => void;
    close: () => void;
    private startProc;
}
