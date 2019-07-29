// tslint:disable:no-console
import axios from "axios";
import * as React from "react";
import {RefObject} from "react";
import socketio, {Socket} from "socket.io-client";
import {Terminal} from "xterm";
import {fit} from "xterm/lib/addons/fit/fit";
import XTermSize from "../../shared/XTermSize";

interface TerminalDisplayProps {
    instanceId: string;
    serverIp: string;
}

interface TerminalDisplayState {
    connected: boolean;
}

export default class TerminalDisplay extends React.Component<TerminalDisplayProps, TerminalDisplayState> {
    private readonly containerRef: RefObject<HTMLDivElement>;
    private readonly term: Terminal;
    private readonly socket: typeof Socket;

    public state: TerminalDisplayState;

    public constructor(props: TerminalDisplayProps) {
        super(props);
        this.containerRef = React.createRef();
        this.term = new Terminal({
            scrollback: 15000,
            cols: 120,
            disableStdin: true,
            screenReaderMode: false
        });

        this.socket = socketio.connect("/");
        this.socket.on("connect", () => {
            console.info(`connected to server as ${this.socket.id}`);
            axios.post("/api/start-minecraft-server", {
                instanceId: props.instanceId,
                serverIp: props.serverIp,
            }).catch((error) =>
                console.error(error)
            );

            this.setState({
                connected: true
            });
        });
        this.socket.on("status", (data: any) => {
            console.info(`Received status from server: ${JSON.stringify(data)}`);
        });

    }

    public componentDidMount() {
        if (this.containerRef.current) {
            const xterm = this.term;
            xterm.open(this.containerRef.current);
            xterm.focus();
            xterm.writeln("Connecting ...");
            fit(xterm);
            if (this.socket) {
                const size: XTermSize = {
                    cols: xterm.cols,
                    rows: xterm.rows
                };
                this.socket.emit("resize", size);
            }
        }
        if (this.socket) {
            this.socket.on("terminal-data", (line: string) => {
                console.info(`Received terminal-data: ${line}`);
                this.term.write(line);
            });
            console.info("Registered stream listener");
        }
    }

    public componentWillUnmount() {
        if (this.term) {
            this.term.destroy();
        }
        if (this.socket) {
            this.socket.off("terminal-data");
        }
    }

    public render() {
        return <div id="window-terminal-container" ref={this.containerRef} style={{
            width: "100%", height: "100%"
        }}/>;
    }
}
