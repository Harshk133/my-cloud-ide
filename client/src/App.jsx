// import { useCallback, useEffect, useState } from "react";
// import "./App.css";
// import Terminal from "./components/Terminal";
// import Tree from "./components/Tree";
// import socket from "./socket";
// import AceEditor from "react-ace";

// function App() {
//   const [fileTree, setFileTree] = useState({});
//   const [selectedFile, setSelectedFile] = useState("");
//   const [selectedFileContent, setSelectedFileContent] = useState("");
//   const [code, setCode] = useState("");

//   const isSaved = selectedFileContent === code;

//   const getFileTree = async () => {
//     const response = await fetch(`http://localhost:9000/files`);
//     const result = await response.json();
//     setFileTree(result.tree);
//   }

//   const getFileContents = useCallback(async () => {
//     if(!selectedFile) return;
//     const response = await fetch(`http://localhost:9000/files/content?path=${selectedFile}`);
//     const result = await response.json();
//     setSelectedFileContent(result.content);
//   }, [selectedFile]);

//   useEffect(()=>{
//     if(selectedFile && selectedFileContent){
//       setCode(selectedFileContent)
//     }
//   }, [selectedFile, selectedFileContent])

//   useEffect(()=> {
//     getFileTree();
//   }, []);

//   useEffect(()=>{
//     socket.on("file:refresh", getFileTree);
//     return () => {
//       socket.off("file:refresh", getFileTree);
//     }
//   }, []);

//   useEffect(()=>{
//     if(selectedFile) getFileContents();
//   }, [getFileContents, selectedFile]);

//   useEffect(()=>{
//     setCode("");
//   }, [selectedFile]);

//   useEffect(()=> {
//     if(code && !isSaved){
//       const timer = setTimeout(() => {
//         // console.log("Save code", code);
//         socket.emit("file:change", {
//           path: selectedFile,
//           content: code
//         })
//       }, 5*1000);
//       return() => {
//         clearTimeout(timer);
//       }
//     }
//   }, [code, selectedFile, isSaved]);

//   return (
//     <>
//       <div className="playground-container">
//         <div className="editor-container">
//           <div className="files">
//             <Tree tree={fileTree} onSelect={(path) => setSelectedFile(path) } selectedFile={selectedFile} />
//           </div>
//           <div className="editor" style={{ border: "0.7px solid black" }}>
//             {selectedFile && <tt style={{ backgroundColor: "yellow" }}><b><u>{selectedFile.replaceAll("/", "> ")}</u></b></tt>}
//             {isSaved ? "Saved" : "Unsaved"}
//             <AceEditor
//               value={code}
//               onChange={e => setCode(e)}
//             />
//           </div>
//         </div>
//         <div className="terminal-container">
//           <Terminal />
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

// import { useCallback, useEffect, useState } from "react";
// import "./App.css";
// import Terminal from "./components/Terminal";
// import Tree from "./components/Tree";
// import socket from "./socket";
// import AceEditor from "react-ace";

// // Import Ace Editor modes for syntax highlighting
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/mode-css";
// import "ace-builds/src-noconflict/mode-json";

// // Import Ace Editor theme
// import "ace-builds/src-noconflict/theme-monokai";

// // Import snippets and autocompletion
// import "ace-builds/src-noconflict/ext-language_tools";

// function App() {
//   const [fileTree, setFileTree] = useState({});
//   const [openTabs, setOpenTabs] = useState([]); // List of open tabs { path, content, originalContent }
//   const [activeTab, setActiveTab] = useState(null); // Path of the active tab
//   const [code, setCode] = useState(""); // Current editor content
//   const [terminalHeight, setTerminalHeight] = useState(200);

//   // Check if the active tab's content matches the original content
//   const activeTabData = openTabs.find((tab) => tab.path === activeTab);
//   const isSaved = activeTabData ? activeTabData.originalContent === code : true;

//   const getEditorMode = (filePath) => {
//     if (!filePath) return "text";
//     const extension = filePath.split(".").pop().toLowerCase();
//     const modeMap = {
//       js: "javascript",
//       jsx: "javascript",
//       py: "python",
//       java: "java",
//       html: "html",
//       css: "css",
//       json: "json",
//     };
//     return modeMap[extension] || "text";
//   };

//   const getFileTree = async () => {
//     const response = await fetch(`http://localhost:9000/files`);
//     const result = await response.json();
//     setFileTree(result.tree);
//   };

//   const getFileContents = async (path) => {
//     const response = await fetch(`http://localhost:9000/files/content?path=${path}`);
//     const result = await response.json();
//     return result.content;
//   };

//   // Open a file in a new tab
//   const openFileInTab = async (path) => {
//     // Check if the file is already open
//     if (openTabs.some((tab) => tab.path === path)) {
//       setActiveTab(path);
//       const tab = openTabs.find((tab) => tab.path === path);
//       setCode(tab.content);
//       return;
//     }

//     // Fetch file content and open a new tab
//     const content = await getFileContents(path);
//     setOpenTabs((prevTabs) => [
//       ...prevTabs,
//       { path, content, originalContent: content }, // Store original content
//     ]);
//     setActiveTab(path);
//     setCode(content);
//   };

//   // Close a tab
//   const closeTab = (path) => {
//     const tab = openTabs.find((t) => t.path === path);
//     if (tab.content !== code && !window.confirm("Unsaved changes will be lost. Close tab?")) {
//       return;
//     }

//     const newTabs = openTabs.filter((tab) => tab.path !== path);
//     setOpenTabs(newTabs);

//     // If the closed tab was active, switch to another tab or clear the editor
//     if (activeTab === path) {
//       if (newTabs.length > 0) {
//         const lastTab = newTabs[newTabs.length - 1];
//         setActiveTab(lastTab.path);
//         setCode(lastTab.content);
//       } else {
//         setActiveTab(null);
//         setCode("");
//       }
//     }
//   };

//   useEffect(() => {
//     getFileTree();
//   }, []);

//   useEffect(() => {
//     socket.on("file:refresh", getFileTree);
//     return () => {
//       socket.off("file:refresh", getFileTree);
//     };
//   }, []);

//   // Save changes to the active tab
//   useEffect(() => {
//     if (code && !isSaved && activeTab) {
//       const timer = setTimeout(() => {
//         socket.emit("file:change", {
//           path: activeTab,
//           content: code,
//         });
//         // Update the original content in openTabs after saving
//         setOpenTabs((prevTabs) =>
//           prevTabs.map((tab) =>
//             tab.path === activeTab ? { ...tab, content: code, originalContent: code } : tab
//           )
//         );
//       }, 1 * 1000); // Reduced to 1 second for quicker feedback
//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [code, activeTab, isSaved]);

//   const handleResize = (e) => {
//     const newHeight = window.innerHeight - e.clientY;
//     if (newHeight >= 100 && newHeight <= window.innerHeight - 100) {
//       setTerminalHeight(newHeight);
//     }
//   };

//   const startResize = () => {
//     window.addEventListener("mousemove", handleResize);
//     window.addEventListener("mouseup", stopResize);
//   };

//   const stopResize = () => {
//     window.removeEventListener("mousemove", handleResize);
//     window.removeEventListener("mouseup", stopResize);
//   };

//   return (
//     <div className="playground-container">
//       <div className="editor-container">
//         <div className="files">
//           <Tree tree={fileTree} onSelect={openFileInTab} selectedFile={activeTab} />
//         </div>
//         <div className="editor">
//           {/* Tab Bar */}
//           {openTabs.length > 0 && (
//             <div className="tab-bar">
//               {openTabs.map((tab) => (
//                 <div
//                   key={tab.path}
//                   className={`tab ${tab.path === activeTab ? "active" : ""}`}
//                   onClick={() => {
//                     setActiveTab(tab.path);
//                     setCode(tab.content);
//                   }}
//                 >
//                   <span>{tab.path.split("/").pop()}</span>
//                   <span
//                     className="close-tab"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       closeTab(tab.path);
//                     }}
//                   >
//                     ×
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//           {/* Editor Header */}
//           <div
//             style={{
//               padding: "5px 10px",
//               backgroundColor: "#1e1e1e",
//               borderBottom: "1px solid #3c3c3c",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             {activeTab ? (
//               <span style={{ color: "#d4d4d4", fontSize: "0.9rem" }}>
//                 {activeTab.replaceAll("/", " > ")}
//               </span>
//             ) : (
//               <span style={{ color: "#858585" }}>No file selected</span>
//             )}
//             <span
//               style={{
//                 color: isSaved ? "#3da33d" : "#ff4444",
//                 fontSize: "0.8rem",
//               }}
//             >
//               {isSaved ? "Saved" : "Unsaved"}
//             </span>
//           </div>
//           {/* Ace Editor */}
//           <AceEditor
//             mode={getEditorMode(activeTab)}
//             theme="monokai"
//             value={code}
//             onChange={(e) => setCode(e)}
//             name="code-editor"
//             editorProps={{ $blockScrolling: true }}
//             setOptions={{
//               enableBasicAutocompletion: true,
//               enableLiveAutocompletion: true,
//               enableSnippets: true,
//               showLineNumbers: true,
//               tabSize: 2,
//               useSoftTabs: true,
//               fontSize: 14,
//               showPrintMargin: false,
//               wrap: true,
//             }}
//             style={{
//               width: "100%",
//               height: "calc(100% - 62px)", // Adjust height for tab bar and header
//               backgroundColor: "#1e1e1e",
//             }}
//           />
//         </div>
//       </div>
//       <div className="splitter" onMouseDown={startResize} />
//       <div className="terminal-container" style={{ height: `${terminalHeight}px` }}>
//         <Terminal />
//       </div>
//     </div>
//   );
// }

// export default App;





// ================================================================================
// import { useCallback, useEffect, useState } from "react";
// import "./App.css";
// import Terminal from "./components/Terminal";
// import Tree from "./components/Tree";
// import socket from "./socket";
// import AceEditor from "react-ace";

// // Import Ace Editor modes for syntax highlighting
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/mode-css";
// import "ace-builds/src-noconflict/mode-json";

// // Import Ace Editor theme
// import "ace-builds/src-noconflict/theme-monokai";

// // Import snippets and autocompletion
// import "ace-builds/src-noconflict/ext-language_tools";
// import Welcome from "./components/Welcome";

// function App() {
//   const [fileTree, setFileTree] = useState({});
//   const [openTabs, setOpenTabs] = useState([]); // List of open tabs { path, content, originalContent }
//   const [activeTab, setActiveTab] = useState(null); // Path of the active tab
//   const [code, setCode] = useState(""); // Current editor content
//   const [terminalHeight, setTerminalHeight] = useState(200);
//   const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
//   const [editorInstance, setEditorInstance] = useState(null);

//   // Check if the active tab's content matches the original content
//   const activeTabData = openTabs.find((tab) => tab.path === activeTab);
//   const isSaved = activeTabData ? activeTabData.originalContent === code : true;

//   const getEditorMode = (filePath) => {
//     if (!filePath) return "text";
//     const extension = filePath.split(".").pop().toLowerCase();
//     const modeMap = {
//       js: "javascript",
//       jsx: "javascript",
//       py: "python",
//       java: "java",
//       html: "html",
//       css: "css",
//       json: "json",
//     };
//     return modeMap[extension] || "text";
//   };

//   const getFileTree = async () => {
//     const response = await fetch(`http://localhost:9000/files`);
//     const result = await response.json();
//     setFileTree(result.tree);
//   };

//   const getFileContents = async (path) => {
//     const response = await fetch(
//       `http://localhost:9000/files/content?path=${path}`
//     );
//     const result = await response.json();
//     return result.content;
//   };

//   // Open a file in a new tab
//   const openFileInTab = async (path) => {
//     if (openTabs.some((tab) => tab.path === path)) {
//       setActiveTab(path);
//       const tab = openTabs.find((tab) => tab.path === path);
//       setCode(tab.content);
//       return;
//     }
//     const content = await getFileContents(path);
//     setOpenTabs((prevTabs) => [
//       ...prevTabs,
//       { path, content, originalContent: content },
//     ]);
//     setActiveTab(path);
//     setCode(content);
//   };

//   // Close a tab
//   const closeTab = (path) => {
//     const tab = openTabs.find((t) => t.path === path);
//     if (
//       tab.content !== code &&
//       !window.confirm("Unsaved changes will be lost. Close tab?")
//     ) {
//       return;
//     }
//     const newTabs = openTabs.filter((tab) => tab.path !== path);
//     setOpenTabs(newTabs);
//     if (activeTab === path) {
//       if (newTabs.length > 0) {
//         const lastTab = newTabs[newTabs.length - 1];
//         setActiveTab(lastTab.path);
//         setCode(lastTab.content);
//       } else {
//         setActiveTab(null);
//         setCode("");
//       }
//     }
//   };

//   useEffect(() => {
//     getFileTree();
//   }, []);

//   useEffect(() => {
//     socket.on("file:refresh", getFileTree);
//     return () => {
//       socket.off("file:refresh", getFileTree);
//     };
//   }, []);

//   // Save changes to the active tab
//   useEffect(() => {
//     if (code && !isSaved && activeTab) {
//       const timer = setTimeout(() => {
//         socket.emit("file:change", {
//           path: activeTab,
//           content: code,
//         });
//         setOpenTabs((prevTabs) =>
//           prevTabs.map((tab) =>
//             tab.path === activeTab
//               ? { ...tab, content: code, originalContent: code }
//               : tab
//           )
//         );
//       }, 1 * 1000);
//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [code, activeTab, isSaved]);



//   const handleResize = (e) => {
//     const newHeight = window.innerHeight - e.clientY;
//     if (newHeight >= 100 && newHeight <= window.innerHeight - 100) {
//       setTerminalHeight(newHeight);
//     }
//   };

//   const startResize = () => {
//     window.addEventListener("mousemove", handleResize);
//     window.addEventListener("mouseup", stopResize);
//   };

//   const stopResize = () => {
//     window.removeEventListener("mousemove", handleResize);
//     window.removeEventListener("mouseup", stopResize);
//   };

//   return (
//     <div className="playground-container">
//       <div className="editor-container">
//         <div className="files">
//           <Tree
//             tree={fileTree}
//             onSelect={openFileInTab}
//             selectedFile={activeTab}
//           />
//         </div>
//         <div className="editor">
//           {openTabs.length === 0 ? (
//             <Welcome />
//           ) : (
//             <>
//               {/* Tab Bar */}
//               <div className="tab-bar">
//                 {openTabs.map((tab) => (
//                   <div
//                     key={tab.path}
//                     className={`tab ${tab.path === activeTab ? "active" : ""}`}
//                     onClick={() => {
//                       setActiveTab(tab.path);
//                       setCode(tab.content);
//                     }}
//                   >
//                     <span>{tab.path.split("/").pop()}</span>
//                     <span
//                       className="close-tab"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         closeTab(tab.path);
//                       }}
//                     >
//                       ×
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               {/* Editor Header */}
//               <div
//                 style={{
//                   padding: "5px 10px",
//                   backgroundColor: "#1e1e1e",
//                   borderBottom: "1px solid #3c3c3c",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 {activeTab ? (
//                   <span style={{ color: "#d4d4d4", fontSize: "0.9rem" }}>
//                     {activeTab.replaceAll("/", " > ")}
//                   </span>
//                 ) : (
//                   <span style={{ color: "#858585" }}>No file selected</span>
//                 )}
//                 <span
//                   style={{
//                     color: isSaved ? "#3da33d" : "#ff4444",
//                     fontSize: "0.8rem",
//                   }}
//                 >
//                   {isSaved ? "Saved" : "Unsaved"}
//                 </span>
//               </div>
//               {/* Ace Editor */}
//               <AceEditor
//                 mode={getEditorMode(activeTab)}
//                 theme="monokai"
//                 value={code}
//                 onChange={(e) => setCode(e)}
//                 onCursorChange={(selection) => {
//                   setCursorPosition({
//                     line: selection.cursor.row + 1,
//                     column: selection.cursor.column + 1,
//                   });
//                 }}
//                 onLoad={(editor) => setEditorInstance(editor)}
//                 name="code-editor"
//                 editorProps={{ $blockScrolling: true }}
//                 setOptions={{
//                   enableBasicAutocompletion: true,
//                   enableLiveAutocompletion: true,
//                   enableSnippets: true,
//                   showLineNumbers: true,
//                   tabSize: 2,
//                   useSoftTabs: true,
//                   fontSize: 14,
//                   showPrintMargin: false,
//                   wrap: true,
//                 }}
//                 style={{
//                   width: "100%",
//                   height: "calc(100% - 62px)", // Adjust height for tab bar and header
//                   backgroundColor: "#1e1e1e",
//                 }}
//               />

//               <div className="status-bar">
//                 <div className="status-left">
//                   <span>{getEditorMode(activeTab).toUpperCase()}</span>
//                   <span>
//                     Line {cursorPosition.line}, Column {cursorPosition.column}
//                   </span>
//                 </div>
//                 <button className="format-button" onClick={formatDocument}>
//                   Format Document
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <div className="splitter" onMouseDown={startResize} />
//       <div
//         className="terminal-container"
//         style={{ height: `${terminalHeight}px` }}
//       >
//         <Terminal />
//       </div>
//     </div>
//   );
// }

// export default App;








// import { useCallback, useEffect, useState, useRef } from "react";
// import "./App.css";
// import Terminal from "./components/Terminal";
// import Tree from "./components/Tree";
// import socket from "./socket";
// import AceEditor from "react-ace";
// import Welcome from "./components/Welcome";
// import * as Y from "yjs";
// import CreateDialog from "./components/CreateDialog";
// import { WebsocketProvider } from "y-websocket";

// // Import Ace Editor modes for syntax highlighting
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/mode-css";
// import "ace-builds/src-noconflict/mode-json";

// // Import Ace Editor theme
// import "ace-builds/src-noconflict/theme-monokai";

// // Import snippets and autocompletion
// import "ace-builds/src-noconflict/ext-language_tools";
// // Import beautify extension for formatting
// import "ace-builds/src-noconflict/ext-beautify";

// function App() {
//   const [fileTree, setFileTree] = useState({});
//   const [openTabs, setOpenTabs] = useState([]); // List of open tabs { path, content, originalContent }
//   const [activeTab, setActiveTab] = useState(null); // Path of the active tab
//   const [code, setCode] = useState(""); // Current editor content
//   const [terminalHeight, setTerminalHeight] = useState(200);
//   const [cursorPosition, setCursorPosition] = useState({ row: 1, column: 1 }); // Cursor position
//   const [createDialogOpen, setCreateDialogOpen] = useState(false); // Add this state
//   const editorRef = useRef(null); // Reference to the AceEditor instance
//   const yDocRef = useRef(new Y.Doc()); // Yjs document
//   const providerRef = useRef(null); // WebSocket provider

//   // Check if the active tab's content matches the original content
//   const activeTabData = openTabs.find((tab) => tab.path === activeTab);
//   const isSaved = activeTabData ? activeTabData.originalContent === code : true;

//   const getEditorMode = (filePath) => {
//     if (!filePath) return "text";
//     const extension = filePath.split(".").pop().toLowerCase();
//     const modeMap = {
//       js: "javascript",
//       jsx: "javascript",
//       py: "python",
//       java: "java",
//       html: "html",
//       css: "css",
//       json: "json",
//     };
//     return modeMap[extension] || "text";
//   };

//   const getFileTree = async () => {
//     const response = await fetch(`http://localhost:9000/files`);
//     const result = await response.json();
//     setFileTree(result.tree);
//   };

//   const getFileContents = async (path) => {
//     const response = await fetch(`http://localhost:9000/files/content?path=${path}`);
//     const result = await response.json();
//     return result.content;
//   };

//   // Open a file in a new tab
//   const openFileInTab = async (path) => {
//     if (openTabs.some((tab) => tab.path === path)) {
//       setActiveTab(path);
//       const tab = openTabs.find((tab) => tab.path === path);
//       setCode(tab.content);
//       return;
//     }
//     const content = await getFileContents(path);
//     setOpenTabs((prevTabs) => [
//       ...prevTabs,
//       { path, content, originalContent: content },
//     ]);
//     setActiveTab(path);
//     setCode(content);
//   };

//   // Close a tab
//   const closeTab = (path) => {
//     const tab = openTabs.find((t) => t.path === path);
//     if (tab.content !== code && !window.confirm("Unsaved changes will be lost. Close tab?")) {
//       return;
//     }
//     const newTabs = openTabs.filter((tab) => tab.path !== path);
//     setOpenTabs(newTabs);
//     if (activeTab === path) {
//       if (newTabs.length > 0) {
//         const lastTab = newTabs[newTabs.length - 1];
//         setActiveTab(lastTab.path);
//         setCode(lastTab.content);
//       } else {
//         setActiveTab(null);
//         setCode("");
//       }
//     }
//   };

//   useEffect(() => {
//     getFileTree();
//   }, []);

//   useEffect(() => {
//     socket.on("file:refresh", getFileTree);
//     return () => {
//       socket.off("file:refresh", getFileTree);
//     };
//   }, []);

//   // Save changes to the active tab
//   useEffect(() => {
//     if (code && !isSaved && activeTab) {
//       const timer = setTimeout(() => {
//         socket.emit("file:change", {
//           path: activeTab,
//           content: code,
//         });
//         setOpenTabs((prevTabs) =>
//           prevTabs.map((tab) =>
//             tab.path === activeTab ? { ...tab, content: code, originalContent: code } : tab
//           )
//         );
//       }, 1 * 1000);
//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [code, activeTab, isSaved]);

//   const handleResize = (e) => {
//     const newHeight = window.innerHeight - e.clientY;
//     if (newHeight >= 100 && newHeight <= window.innerHeight - 100) {
//       setTerminalHeight(newHeight);
//     }
//   };

//   const startResize = () => {
//     window.addEventListener("mousemove", handleResize);
//     window.addEventListener("mouseup", stopResize);
//   };

//   const stopResize = () => {
//     window.removeEventListener("mousemove", handleResize);
//     window.removeEventListener("mouseup", stopResize);
//   };

//   // Handle cursor position change
//   const handleCursorChange = (selection) => {
//     const { row, column } = selection.getCursor();
//     setCursorPosition({ row: row + 1, column: column + 1 }); // +1 to match typical editor numbering (1-based)
//   };

//   const handleCreateNew = () => {
//     const name = prompt("Enter the name of the new file or folder:");
//     if (name) {
//       const path = name; // For simplicity, creating at the root level
//       const isDir = false; // Default to file; adjust as needed
//       fetch(`http://localhost:9000/files/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ path, isDir }),
//       }).then(() => {
//         getFileTree(); // Refresh the file tree after creation
//       });
//     }
//   };

//   // ==========================================================================================================================
 

//   return (
//     <div className="playground-container">
//       <div className="editor-container">
//         <div className="files">
//           {/* <Tree tree={fileTree} onSelect={openFileInTab} selectedFile={activeTab} /> */}
//           <Tree
//             tree={fileTree}
//             onSelect={openFileInTab}
//             selectedFile={activeTab}
//             onCreateNew={handleCreateNew}
//           />
//         </div>
//         <div className="editor">
//           {openTabs.length === 0 ? (
//             <Welcome />
//           ) : (
//             <>
//               {/* Tab Bar */}
//               <div className="tab-bar">
//                 {openTabs.map((tab) => (
//                   <div
//                     key={tab.path}
//                     className={`tab ${tab.path === activeTab ? "active" : ""}`}
//                     onClick={() => {
//                       setActiveTab(tab.path);
//                       setCode(tab.content);
//                     }}
//                   >
//                     <span>{tab.path.split("/").pop()}</span>
//                     <span
//                       className="close-tab"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         closeTab(tab.path);
//                       }}
//                     >
//                       ×
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               {/* Editor Header */}
//               <div
//                 style={{
//                   padding: "5px 10px",
//                   backgroundColor: "#1e1e1e",
//                   borderBottom: "1px solid #3c3c3c",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 {activeTab ? (
//                   <span style={{ color: "#d4d4d4", fontSize: "0.9rem" }}>
//                     {activeTab.replaceAll("/", " > ")}
//                   </span>
//                 ) : (
//                   <span style={{ color: "#858585" }}>No file selected</span>
//                 )}
//                 <span
//                   style={{
//                     color: isSaved ? "#3da33d" : "#ff4444",
//                     fontSize: "0.8rem",
//                   }}
//                 >
//                   {isSaved ? "Saved" : "Unsaved"}
//                 </span>
//               </div>
//               {/* Ace Editor */}
//               <AceEditor
//                 mode={getEditorMode(activeTab)}
//                 theme="monokai"
//                 value={code}
//                 onChange={(e) => setCode(e)}
//                 onCursorChange={handleCursorChange} // Track cursor position
//                 name="code-editor"
//                 editorProps={{ $blockScrolling: true }}
//                 ref={editorRef} // Reference to access editor instance
//                 setOptions={{
//                   enableBasicAutocompletion: true,
//                   enableLiveAutocompletion: true,
//                   enableSnippets: true,
//                   showLineNumbers: true,
//                   tabSize: 2,
//                   useSoftTabs: true,
//                   fontSize: 14,
//                   showPrintMargin: false,
//                   wrap: true,
//                 }}
//                 style={{
//                   width: "100%",
//                   height: "calc(100% - 92px)", // Adjust height for tab bar, header, and status bar
//                   backgroundColor: "#1e1e1e",
//                 }}
//               />
//               {/* Status Bar */}
//               <div className="status-bar">
//                 <span className="language">
//                   {activeTab ? getEditorMode(activeTab) : "No Language"}
//                 </span>
//                 <span className="cursor-position">
//                   Ln {cursorPosition.row}, Col {cursorPosition.column}
//                 </span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <div className="splitter" onMouseDown={startResize} />
//       <div className="terminal-container" style={{ height: `${terminalHeight}px` }}>
//         <Terminal />
//       </div>
//       {createDialogOpen && (
//         <CreateDialog
//           open={createDialogOpen}
//           onClose={() => setCreateDialogOpen(false)}
//           onCreate={handleCreate}
//         />
//       )}
//     </div>
//   );
// }

// export default App;



import { useCallback, useEffect, useState, useRef } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import Tree from "./components/Tree";
import socket from "./socket";
import AceEditor from "react-ace";
import Welcome from "./components/Welcome";
import * as Y from "yjs";
import CreateDialog from "./components/CreateDialog";
import { WebsocketProvider } from "y-websocket";

// Import Ace Editor modes for syntax highlighting
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-json";

// Import Ace Editor theme
import "ace-builds/src-noconflict/theme-monokai";

// Import snippets and autocompletion
import "ace-builds/src-noconflict/ext-language_tools";
// Import beautify extension for formatting
import "ace-builds/src-noconflict/ext-beautify";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [openTabs, setOpenTabs] = useState([]); // List of open tabs { path, content, originalContent }
  const [activeTab, setActiveTab] = useState(null); // Path of the active tab
  const [code, setCode] = useState(""); // Current editor content
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [cursorPosition, setCursorPosition] = useState({ row: 1, column: 1 }); // Cursor position
  const [createDialogOpen, setCreateDialogOpen] = useState(false); // Add this state
  const [selectedFolder, setSelectedFolder] = useState(""); // Track selected folder
  const editorRef = useRef(null); // Reference to the AceEditor instance
  const yDocRef = useRef(new Y.Doc()); // Yjs document
  const providerRef = useRef(null); // WebSocket provider

  // Check if the active tab's content matches the original content
  const activeTabData = openTabs.find((tab) => tab.path === activeTab);
  const isSaved = activeTabData ? activeTabData.originalContent === code : true;

  const getEditorMode = (filePath) => {
    if (!filePath) return "text";
    const extension = filePath.split(".").pop().toLowerCase();
    const modeMap = {
      js: "javascript",
      jsx: "javascript",
      py: "python",
      java: "java",
      html: "html",
      css: "css",
      json: "json",
    };
    return modeMap[extension] || "text";
  };

  const getFileTree = async () => {
    const response = await fetch(`http://localhost:9000/files`);
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = async (path) => {
    const response = await fetch(`http://localhost:9000/files/content?path=${path}`);
    const result = await response.json();
    return result.content;
  };

  // Open a file or select a folder
  const openFileInTab = async (path, isDir) => {
    if (isDir) {
      setSelectedFolder(path); // Set the selected folder
      return;
    }
    if (openTabs.some((tab) => tab.path === path)) {
      setActiveTab(path);
      const tab = openTabs.find((tab) => tab.path === path);
      setCode(tab.content);
      return;
    }
    const content = await getFileContents(path);
    setOpenTabs((prevTabs) => [
      ...prevTabs,
      { path, content, originalContent: content },
    ]);
    setActiveTab(path);
    setCode(content);
    setSelectedFolder(""); // Reset selected folder when opening a file
  };

  // Close a tab
  const closeTab = (path) => {
    const tab = openTabs.find((t) => t.path === path);
    if (tab.content !== code && !window.confirm("Unsaved changes will be lost. Close tab?")) {
      return;
    }
    const newTabs = openTabs.filter((tab) => tab.path !== path);
    setOpenTabs(newTabs);
    if (activeTab === path) {
      if (newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1];
        setActiveTab(lastTab.path);
        setCode(lastTab.content);
      } else {
        setActiveTab(null);
        setCode("");
      }
    }
  };

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  // Save changes to the active tab
  useEffect(() => {
    if (code && !isSaved && activeTab) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: activeTab,
          content: code,
        });
        setOpenTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.path === activeTab ? { ...tab, content: code, originalContent: code } : tab
          )
        );
      }, 1 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, activeTab, isSaved]);

  const handleResize = (e) => {
    const newHeight = window.innerHeight - e.clientY;
    if (newHeight >= 100 && newHeight <= window.innerHeight - 100) {
      setTerminalHeight(newHeight);
    }
  };

  const startResize = () => {
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
  };

  const stopResize = () => {
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResize);
  };

  // Handle cursor position change
  const handleCursorChange = (selection) => {
    const { row, column } = selection.getCursor();
    setCursorPosition({ row: row + 1, column: column + 1 }); // +1 to match typical editor numbering (1-based)
  };

  const handleCreateNew = () => {
    const name = prompt("Enter the name of the new file:");
    if (name) {
      const path = selectedFolder ? `${selectedFolder}/${name}` : name; // Use selected folder if available
      const isDir = false; // Creating a file
      fetch(`http://localhost:9000/files/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, isDir }),
      }).then(() => {
        getFileTree(); // Refresh the file tree after creation
      });
    }
  };

  return (
    <div className="playground-container">
      <div className="editor-container">
        <div className="files">
          <Tree
            tree={fileTree}
            onSelect={openFileInTab}
            selectedFile={activeTab}
            onCreateNew={handleCreateNew}
          />
        </div>
        <div className="editor">
          {openTabs.length === 0 ? (
            <Welcome />
          ) : (
            <>
              {/* Tab Bar */}
              <div className="tab-bar">
                {openTabs.map((tab) => (
                  <div
                    key={tab.path}
                    className={`tab ${tab.path === activeTab ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab.path);
                      setCode(tab.content);
                    }}
                  >
                    <span>{tab.path.split("/").pop()}</span>
                    <span
                      className="close-tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.path);
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
              {/* Editor Header */}
              <div
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#1e1e1e",
                  borderBottom: "1px solid #3c3c3c",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {activeTab ? (
                  <span style={{ color: "#d4d4d4", fontSize: "0.9rem" }}>
                    {activeTab.replaceAll("/", " > ")}
                  </span>
                ) : (
                  <span style={{ color: "#858585" }}>No file selected</span>
                )}
                <span
                  style={{
                    color: isSaved ? "#3da33d" : "#ff4444",
                    fontSize: "0.8rem",
                  }}
                >
                  {isSaved ? "Saved" : "Unsaved"}
                </span>
              </div>
              {/* Ace Editor */}
              <AceEditor
                mode={getEditorMode(activeTab)}
                theme="monokai"
                value={code}
                onChange={(e) => setCode(e)}
                onCursorChange={handleCursorChange} // Track cursor position
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                ref={editorRef} // Reference to access editor instance
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                  useSoftTabs: true,
                  fontSize: 14,
                  showPrintMargin: false,
                  wrap: true,
                }}
                style={{
                  width: "100%",
                  height: "calc(100% - 92px)", // Adjust height for tab bar, header, and status bar
                  backgroundColor: "#1e1e1e",
                }}
              />
              {/* Status Bar */}
              <div className="status-bar">
                <span className="language">
                  {activeTab ? getEditorMode(activeTab) : "No Language"}
                </span>
                <span className="cursor-position">
                  Ln {cursorPosition.row}, Col {cursorPosition.column}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="splitter" onMouseDown={startResize} />
      <div className="terminal-container" style={{ height: `${terminalHeight}px` }}>
        <Terminal />
      </div>
      {createDialogOpen && (
        <CreateDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

export default App;