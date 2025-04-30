import React from "react";

const Welcome = () => {
  return (
      <div
        className="welcome-screen"
        style={{ marginLeft: "55px", padding: "27px", color: "white" }}
      >
        <h1>Welcome to Your Cloud IDE</h1>
        <p>Open a file from the file tree to start editing.</p>
        <p>Features:</p>
        <ul>
          <li>Tab-based editing like VSCode</li>
          <li>Syntax highlighting and autocompletion</li>
          <li>Real-time file saving</li>
          <li>Integrated terminal</li>
        </ul>
      </div>
  );
};

export default Welcome;
