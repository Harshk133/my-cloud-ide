// import React, { useEffect, useRef } from 'react'
// import { Terminal as XTerminal } from "@xterm/xterm"
// import "@xterm/xterm/css/xterm.css"
// import socket from '../socket'

// const Terminal = () => {

//     const terminalRef = useRef();
//     const isRendered = useRef(false);

//     useEffect(() => {
//         if(isRendered.current) return;
//         isRendered.current = true;
//         const term = new XTerminal({
//             cols: 140,
//             rows: 20,
//         });
//         term.open(terminalRef.current);
//         term.onData(data => {
//             socket.emit("terminal:write", data);      
//         });
//         socket.on("terminal:data", (data) => {
//             term.write(data);
//         })
//     }, [])

//   return (
//     <div ref={terminalRef} id='terminal'></div>
//   )
// }

// export default Terminal




import React, { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import socket from "../socket";

const Terminal = () => {
  const terminalRef = useRef();
  const termRef = useRef(null); // Store the terminal instance

  // Initialize terminal
  useEffect(() => {
    const term = new XTerminal({
      cols: 140,
      rows: 20,
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#ffffff",
        selection: "#ffffff44",
      },
      fontFamily: '"Consolas", "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      allowTransparency: true,
    });

    term.open(terminalRef.current);
    term.focus(); // Ensure terminal has focus on initialization
    termRef.current = term;

    // Dynamically resize terminal based on container size
    const resizeTerminal = () => {
      if (!terminalRef.current || !termRef.current) return;
      const { clientWidth, clientHeight } = terminalRef.current;
      const cols = Math.max(80, Math.floor(clientWidth / 7)); // Approximate char width
      const rows = Math.max(5, Math.floor(clientHeight / 18)); // Approximate char height
      term.resize(cols, rows);
    };
    resizeTerminal();
    window.addEventListener("resize", resizeTerminal);

    // Handle terminal input
    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    // Handle incoming terminal data
    const handleTerminalData = (data) => {
      term.write(data);
    };
    socket.on("terminal:data", handleTerminalData);

    // Cleanup on unmount
    return () => {
      term.dispose();
      termRef.current = null;
      socket.off("terminal:data", handleTerminalData);
      window.removeEventListener("resize", resizeTerminal);
    };
  }, []); // Empty dependency array to run only on mount

  // Ensure terminal regains focus on click
  const handleTerminalClick = () => {
    if (termRef.current) {
      termRef.current.focus();
    }
  };

  return (
    <div className="terminal-wrapper" onClick={handleTerminalClick}>
      <div className="terminal-header">
        <span>Terminal</span>
      </div>
      <div ref={terminalRef} id="terminal" />
    </div>
  );
};

export default Terminal;