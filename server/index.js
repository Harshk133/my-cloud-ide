// const os = require("os");
// const http = require("http");
// const fs = require("fs").promises;
// const express = require("express");
// const { Server: SocketServer } = require("socket.io"); // Server नावाचा क्लास socket.io मधून घेऊन त्याला SocketServer या नावाने वापरण्यास परवानगी देते.
// const pty = require("node-pty");
// const cors = require("cors");
// const chokidar = require("chokidar");
// const { WebSocketServer } = require("ws");
// const { setupWSConnection } = require("y-websocket/bin/utils");
// const Y = require("yjs");
// const { generateFileTree } = require("./utils/generateFile");
// const path = require("path");

// let shell = os.platform() === "win32" ? "powershell.exe" : "bash";

// const ptyProcess = pty.spawn(shell, [], {
//   name: "xterm-color",
//   cols: 250,
//   rows: 100,
//   cwd: process.cwd() + "/users",
//   env: process.env,
// });

// const app = express();
// const server = http.createServer(app);

// app.use(cors());

// /*
// const io = new SocketServer({ cors: '*' })
// SocketServer हा Socket.io सर्व्हर तयार करण्यासाठी वापरला जातो.
// { cors: '*' } म्हणजेच CORS (Cross-Origin Resource Sharing) सर्व ऍक्सेसला उघडं ठेवतो.
// म्हणजे कोणत्याही डोमेनवरून WebSocket कनेक्शनला परवानगी मिळते.
// */
// const io = new SocketServer({
//   cors: "*",
// });

// // Yjs WebSocket server for collaborative editing
// const wss = new WebSocketServer({ port: 1234 }); // Separate port for Yjs
// wss.on("connection", (ws, req) => {
//   setupWSConnection(ws, req); // Yjs handles syncing
// });

// io.attach(server);

// chokidar.watch("./users").on("all", (event, path) => {
//   io.emit("file:refresh", path);
// });

// ptyProcess.onData((data) => {
//   io.emit("terminal:data", data);
// });

// /*
//  io.on("connection", (socket) => { ... })
// "connection" इव्हेंट म्हणजे जेव्हा नवीन क्लायंट WebSocket सर्व्हरशी कनेक्ट होतो तेव्हा हा कोड चालतो.
// socket हा प्रत्येक कनेक्ट झालेल्या क्लायंटचा युनिक WebSocket ऑब्जेक्ट असतो.
// याच socket चा उपयोग डेटा पाठवण्यासाठी, मेसेज रिसीव्ह करण्यासाठी, आणि इव्हेंट हँडल करण्यासाठी केला जातो.
// */
// io.on("connection", (socket) => {
//   console.log(`Socket connected with Scoket ID 👉 ${socket.id}`);
//   socket.emit("file:refresh");

//   // Join a room for a specific file
//   socket.on("joinFile", (filePath) => {
//     socket.join(filePath);
//     console.log(`${socket.id} joined the room: ${filePath}`);
//   });

//   socket.on("codeChange", async ({ filePath, content }) => {
//     try {
//       await fs.writeFile(`./users/${filePath}`, content);
//       // Broadcast the change to all clients in the same file's room except sender
//       socket.to(filePath).emit("codeChange", content);
//       console.log(`Code updated for ${filePath}`);
//     } catch (error) {
//       console.error(`Error saving file ${filePath}:`, error);
//     }
//   });

//   socket.on("file:change", async ({ path, content }) => {
//     await fs.writeFile(`./users/${path}`, content);
//   });

//   socket.on("terminal:write", (data) => {
//     ptyProcess.write(data);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Socket disconnected: ${socket.id}`);
//   });
// });

// app.get("/files", async (req, res) => {
//   const fileTree = await generateFileTree(
//     "D:/MyPrograms/Micro Project Versions/CO6I/JavaScript Microprojects/Project 15/server/users"
//   );
//   return res.json({ tree: fileTree });
// });

// app.get("/files/content", async (req, res) => {
//   const path = req.query.path;
//   const content = await fs.readFile(`./users/${path}`, "utf-8");
//   return res.json({ content });
// });

// app.post("/files/create", async (req, res) => {
//   const { path: filePath, isDir } = req.body;
//   const fullPath = path.join(__dirname, "users", filePath);
//   try {
//     if (isDir) {
//       await fs.mkdir(fullPath, { recursive: true });
//     } else {
//       await fs.writeFile(fullPath, "");
//     }
//     io.emit("file:refresh"); // Assuming io is your socket.io instance
//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // DELETE /files/delete
// app.delete("/files/delete", async (req, res) => {
//   const { path: filePath } = req.query;
//   const fullPath = path.join(__dirname, "users", filePath);
//   try {
//     await fs.unlink(fullPath);
//     io.emit("file:refresh");
//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // GET /files/download
// app.get("/files/download", (req, res) => {
//   const { path: filePath } = req.query;
//   const fullPath = path.join(__dirname, "users", filePath);
//   res.download(fullPath);
// });

// server.listen(9000, () =>
//   console.log(`🐳 Docker Server is running on port 9000`)
// );


// const os = require("os");
// const http = require("http");
// const fs = require("fs").promises;
// const express = require("express");
// const { Server: SocketServer } = require("socket.io");
// const pty = require("node-pty");
// const cors = require("cors");
// const chokidar = require("chokidar");
// const { WebSocketServer } = require("ws");
// const { setupWSConnection } = require("y-websocket/bin/utils");
// const Y = require("yjs");
// const { generateFileTree } = require("./utils/generateFile");
// const path = require("path");

// let shell = os.platform() === "win32" ? "powershell.exe" : "bash";

// const ptyProcess = pty.spawn(shell, [], {
//   name: "xterm-color",
//   cols: 250,
//   rows: 100,
//   cwd: process.cwd() + "/users",
//   env: process.env,
// });

// const app = express();
// const server = http.createServer(app);

// // Add this line to parse JSON request bodies
// app.use(express.json());
// app.use(cors());

// const io = new SocketServer({
//   cors: "*",
// });

// const wss = new WebSocketServer({ port: 1234 });
// wss.on("connection", (ws, req) => {
//   setupWSConnection(ws, req);
// });

// io.attach(server);

// chokidar.watch("./users").on("all", (event, path) => {
//   io.emit("file:refresh", path);
// });

// ptyProcess.onData((data) => {
//   io.emit("terminal:data", data);
// });

// io.on("connection", (socket) => {
//   console.log(`Socket connected with Socket ID 👉 ${socket.id}`);
//   socket.emit("file:refresh");

//   socket.on("joinFile", (filePath) => {
//     socket.join(filePath);
//     console.log(`${socket.id} joined the room: ${filePath}`);
//   });

//   socket.on("codeChange", async ({ filePath, content }) => {
//     try {
//       await fs.writeFile(`./users/${filePath}`, content);
//       socket.to(filePath).emit("codeChange", content);
//       console.log(`Code updated for ${filePath}`);
//     } catch (error) {
//       console.error(`Error saving file ${filePath}:`, error);
//     }
//   });

//   socket.on("file:change", async ({ path, content }) => {
//     await fs.writeFile(`./users/${path}`, content);
//   });

//   socket.on("terminal:write", (data) => {
//     ptyProcess.write(data);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Socket disconnected: ${socket.id}`);
//   });
// });

// app.get("/files", async (req, res) => {
//   const fileTree = await generateFileTree(
//     "D:/MyPrograms/Micro Project Versions/CO6I/JavaScript Microprojects/Project 15/server/users"
//   );
//   return res.json({ tree: fileTree });
// });

// app.get("/files/content", async (req, res) => {
//   const path = req.query.path;
//   const content = await fs.readFile(`./users/${path}`, "utf-8");
//   return res.json({ content });
// });

// app.post("/files/create", async (req, res) => {
//   const { path: filePath, isDir } = req.body;
//   if (!filePath) {
//     return res.status(400).send("Path is required");
//   }
//   const fullPath = path.join(__dirname, "users", filePath);
//   try {
//     if (isDir) {
//       await fs.mkdir(fullPath, { recursive: true });
//     } else {
//       await fs.writeFile(fullPath, "");
//     }
//     io.emit("file:refresh");
//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// app.delete("/files/delete", async (req, res) => {
//   const { path: filePath } = req.query;
//   if (!filePath) {
//     return res.status(400).send("Path is required");
//   }
//   const fullPath = path.join(__dirname, "users", filePath);
//   try {
//     await fs.unlink(fullPath);
//     io.emit("file:refresh");
//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// app.get("/files/download", (req, res) => {
//   const { path: filePath } = req.query;
//   if (!filePath) {
//     return res.status(400).send("Path is required");
//   }
//   const fullPath = path.join(__dirname, "users", filePath);
//   res.download(fullPath);
// });

// server.listen(9000, () =>
//   console.log(`🐳 Docker Server is running on port 9000`)
// );



// Code from Grok AI
const os = require("os");
const http = require("http");
const fs = require("fs").promises;
const express = require("express");
const { Server: SocketServer } = require("socket.io");
const pty = require("node-pty");
const cors = require("cors");
const chokidar = require("chokidar");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const Y = require("yjs");
const { generateFileTree } = require("./utils/generateFile");
const path = require("path");
const archiver = require("archiver");

let shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const ptyProcess = pty.spawn(shell, [], {
  name: "xterm-color",
  cols: 250,
  rows: 100,
  cwd: process.cwd() + "/users",
  env: process.env,
});

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new SocketServer({
  cors: "*",
});

const wss = new WebSocketServer({ port: 1234 });
wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
});

io.attach(server);

chokidar.watch("./users").on("all", (event, path) => {
  io.emit("file:refresh", path);
});

ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});

io.on("connection", (socket) => {
  console.log(`Socket connected with Socket ID 👉 ${socket.id}`);
  socket.emit("file:refresh");

  socket.on("joinFile", (filePath) => {
    socket.join(filePath);
    console.log(`${socket.id} joined the room: ${filePath}`);
  });

  socket.on("codeChange", async ({ filePath, content }) => {
    try {
      await fs.writeFile(`./users/${filePath}`, content);
      socket.to(filePath).emit("codeChange", content);
      console.log(`Code updated for ${filePath}`);
    } catch (error) {
      console.error(`Error saving file ${filePath}:`, error);
    }
  });

  socket.on("file:change", async ({ path, content }) => {
    await fs.writeFile(`./users/${path}`, content);
  });

  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.get("/files", async (req, res) => {
  const fileTree = await generateFileTree(
    path.join(__dirname, "users")
  );
  return res.json({ tree: fileTree });
});

app.get("/files/content", async (req, res) => {
  const filePath = req.query.path;
  const fullPath = path.join(__dirname, "users", filePath);
  try {
    const content = await fs.readFile(fullPath, "utf-8");
    return res.json({ content });
  } catch (error) {
    res.status(500).send(`Error reading file: ${error.message}`);
  }
});

app.post("/files/create", async (req, res) => {
  const { path: filePath, isDir } = req.body;
  if (!filePath) {
    return res.status(400).send("Path is required");
  }
  const fullPath = path.join(__dirname, "users", filePath);
  try {
    if (isDir) {
      await fs.mkdir(fullPath, { recursive: true });
    } else {
      await fs.writeFile(fullPath, "");
    }
    io.emit("file:refresh");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(`Error creating ${isDir ? "folder" : "file"}: ${error.message}`);
  }
});

app.delete("/files/delete", async (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).send("Path is required");
  }
  const fullPath = path.join(__dirname, "users", filePath);
  try {
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }
    io.emit("file:refresh");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(`Error deleting: ${error.message}`);
  }
});

app.get("/files/download", async (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).send("Path is required");
  }
  const fullPath = path.join(__dirname, "users", filePath);
  try {
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      // Create a zip archive for folders
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${path.basename(filePath)}.zip"`);

      const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression
      });

      archive.on("error", (err) => {
        res.status(500).send(`Error creating zip: ${err.message}`);
      });

      // Pipe the archive to the response
      archive.pipe(res);

      // Add the folder to the archive
      archive.directory(fullPath, path.basename(filePath));
      await archive.finalize();
    } else {
      // Download file directly
      res.download(fullPath);
    }
  } catch (error) {
    res.status(500).send(`Error downloading: ${error.message}`);
  }
});

app.post("/files/rename", async (req, res) => {
  const { oldPath, newPath } = req.body;
  if (!oldPath || !newPath) {
    return res.status(400).send("Both oldPath and newPath are required");
  }
  const oldFullPath = path.join(__dirname, "users", oldPath);
  const newFullPath = path.join(__dirname, "users", newPath);
  try {
    await fs.rename(oldFullPath, newFullPath);
    io.emit("file:refresh");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(`Error renaming: ${error.message}`);
  }
});

server.listen(9000, () =>
  console.log(`🐳 Docker Server is running on port 9000`)
);