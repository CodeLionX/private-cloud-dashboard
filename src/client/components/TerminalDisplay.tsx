import * as React from "react";
import { RefObject } from "react";
import socketio, { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { fit } from "xterm/lib/addons/fit/fit";

interface TerminalDisplayProps {
    onProgress: (progress: number) => void
    onSocketConnect: (term: Terminal) => void;
}

export default class TerminalDisplay extends React.Component<TerminalDisplayProps> {
    private readonly containerRef: RefObject<HTMLDivElement>;
    private readonly term: Terminal;
    private readonly socket: typeof Socket;

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
        this.socket.on("connect", () =>
            this.props.onSocketConnect(this.term)
        );
        this.socket.on("terminal-data", (line: string) => {
            this.term.writeln(line);
            this.term.scrollToBottom();
        });
        this.socket.on("progress", this.props.onProgress);
        this.socket.on("end", () => {
            this.term.writeln("\nFinished!");
            this.term.scrollToBottom();
            this.props.onProgress(100);
        });
    }

    public componentDidMount() {
        if (this.containerRef.current) {
            const xterm = this.term;
            xterm.open(this.containerRef.current);
            xterm.focus();
            xterm.writeln("Connecting ...\n");
            fit(xterm);
        }
    }

    public componentWillUnmount() {
        if (this.term) {
            this.term.destroy();
        }
        if (this.socket) {
            this.socket.off("progress");
            this.socket.off("terminal-data");
            this.socket.close();
        }
    }

    public render() {
        return <div id="window-terminal-container" ref={this.containerRef} style={{
            width: "100%", height: "100%"
        }} />;
    }
}
