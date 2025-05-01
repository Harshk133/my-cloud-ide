// import React from "react";

// const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
//     const isDir = !!nodes;
//   return (
//     <div onClick={(e) => { e.stopPropagation()
//         if(isDir) return;
//         onSelect(path)
//      }} style={{ marginRight: "7px" }}>
//       <p className={isDir ? "file-node" : "directory-node"}>{!isDir && "👉"}{fileName}</p>
//       {nodes && fileName !== "node_modules" && (
//         <ul>
//           {Object.keys(nodes).map((child) => (
//             <li key={child}>
//               <FileTreeNode onSelect={onSelect} fileName={child} path={path + "/" + child} nodes={nodes[child]} />
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// const Tree = ({ tree, onSelect }) => {
//   return (
//     <div>
//       <FileTreeNode onSelect={onSelect} fileName={"/"} path={""} nodes={tree} />
//     </div>
//   );
// };

// export default Tree;

// Tree.jsx


// import React, { useState } from "react";
// import { styled } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Collapse from "@mui/material/Collapse";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import ChevronRight from "@mui/icons-material/ChevronRight";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import FolderIcon from "@mui/icons-material/Folder";

// // Styled components for VSCode-like appearance
// const StyledListItem = styled(ListItem)(({ theme, isSelected }) => ({
//   padding: "2px 8px",
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   backgroundColor: isSelected ? "#37373d" : "transparent", // Highlight selected file
//   "& .MuiListItemText-primary": {
//     fontWeight: isSelected ? "bold" : "normal", // Bold text for selected file
//   },
// }));

// const FileTreeNode = ({ fileName, nodes, onSelect, path, selectedFile }) => {
//   const isDir = !!nodes;
//   const isSelected = !isDir && path === selectedFile; // Check if this file is the selected one
//   const [open, setOpen] = useState(false);

//   const handleClick = (e) => {
//     e.stopPropagation();
//     if (isDir) {
//       setOpen(!open);
//     } else {
//       onSelect(path);
//     }
//   };

//   return (
//     <>
//       <StyledListItem
//         button
//         onClick={handleClick}
//         isSelected={isSelected}
//       >
//         <ListItemIcon sx={{ minWidth: "32px" }}>
//           {isDir ? (
//             open ? (
//               <ExpandMore sx={{ fontSize: "18px" }} />
//             ) : (
//               <ChevronRight sx={{ fontSize: "18px" }} />
//             )
//           ) : (
//             <InsertDriveFileIcon sx={{ fontSize: "18px", color: "#90caf9" }} />
//           )}
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
//               {fileName}
//             </Typography>
//           }
//         />
//       </StyledListItem>
//       {isDir && nodes && fileName !== "node_modules" && (
//         <Collapse in={open} timeout="auto" unmountOnExit>
//           <List component="div" disablePadding sx={{ pl: 2 }}>
//             {Object.keys(nodes).map((child) => (
//               <FileTreeNode
//                 key={child}
//                 fileName={child}
//                 path={path ? `${path}/${child}` : child}
//                 nodes={nodes[child]}
//                 onSelect={onSelect}
//                 selectedFile={selectedFile}
//               />
//             ))}
//           </List>
//         </Collapse>
//       )}
//     </>
//   );
// };

// const Tree = ({ tree, onSelect, selectedFile }) => {
//   return (
//     <Box
//       sx={{
//         bgcolor: "#252526",
//         color: "#ffffff",
//         height: "100%",
//         overflowY: "auto",
//         fontFamily: '"Segoe UI", Roboto, sans-serif',
//         "& .MuiListItemIcon-root": {
//           color: "#ffffff",
//         },
//       }}
//     >
//       <Typography
//         variant="caption"
//         sx={{
//           p: 1,
//           display: "block",
//           color: "#858585",
//           textTransform: "uppercase",
//           fontSize: "0.7rem",
//         }}
//       >
//         Explorer
//       </Typography>
//       <List dense>
//         <FileTreeNode
//           fileName="/"
//           path=""
//           nodes={tree}
//           onSelect={onSelect}
//           selectedFile={selectedFile}
//         />
//       </List>
//     </Box>
//   );
// };

// export default Tree;







// import React, { useState } from "react";
// import { styled } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Collapse from "@mui/material/Collapse";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import ChevronRight from "@mui/icons-material/ChevronRight";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import IconButton from "@mui/material/IconButton";
// import AddIcon from "@mui/icons-material/Add";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";

// const StyledListItem = styled(ListItem)(({ theme, isSelected }) => ({
//   padding: "2px 8px",
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   backgroundColor: isSelected ? "#37373d" : "transparent",
//   "& .MuiListItemText-primary": {
//     fontWeight: isSelected ? "bold" : "normal",
//   },
// }));

// const FileTreeNode = ({ fileName, nodes, onSelect, path, selectedFile }) => {
//   const isDir = !!nodes;
//   const isSelected = !isDir && path === selectedFile;
//   const [open, setOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (e) => {
//     e.stopPropagation();
//     if (isDir) {
//       setOpen(!open);
//     } else {
//       onSelect(path);
//     }
//   };

//   const handleMenuClick = (e) => {
//     e.stopPropagation();
//     setAnchorEl(e.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDelete = async () => {
//     await fetch(`http://localhost:9000/files/delete?path=${path}`, {
//       method: "DELETE",
//     });
//     // Note: Assumes the backend emits a "file:refresh" event or similar to update the UI
//     handleMenuClose();
//   };

//   const handleDownload = () => {
//     window.open(`http://localhost:9000/files/download?path=${path}`, "_blank");
//     handleMenuClose();
//   };

//   const createFolder = async (folderPath) => {
//     try {
//       const response = await fetch("http://localhost:9000/files/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ path: folderPath, isDir: true }),
//       });
  
//       if (response.ok) {
//         console.log("Folder created successfully");
//         // Trigger file tree refresh here if needed (like re-fetching or listening to socket)
//       } else {
//         const error = await response.text();
//         console.error("Failed to create folder:", error);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };
  

//   return (
//     <>
//       <StyledListItem
//         button
//         onClick={handleClick}
//         isSelected={isSelected}
//         secondaryAction={
//           !isDir && (
//             <IconButton
//               edge="end"
//               size="small"
//               onClick={handleMenuClick}
//               sx={{ color: "#ffffff" }}
//             >
//               <MoreVertIcon fontSize="small" />
//             </IconButton>
//           )
//         }
//       >
//         <ListItemIcon sx={{ minWidth: "32px" }}>
//           {isDir ? (
//             open ? (
//               <ExpandMore sx={{ fontSize: "18px" }} />
//             ) : (
//               <ChevronRight sx={{ fontSize: "18px" }} />
//             )
//           ) : (
//             <InsertDriveFileIcon sx={{ fontSize: "18px", color: "#90caf9" }} />
//           )}
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
//               {fileName}
//             </Typography>
//           }
//         />
//       </StyledListItem>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleDelete}>Delete</MenuItem>
//         <MenuItem onClick={handleDownload}>Download</MenuItem>
//       </Menu>
//       {isDir && (
//   <>
//     <IconButton
//       edge="end"
//       size="small"
//       onClick={(e) => {
//         e.stopPropagation();
//         const folderName = prompt("Enter new folder name");
//         if (folderName) {
//           createFolder(`${path}/${folderName}`);
//         }
//       }}
//       sx={{ color: "#ffffff", ml: 1 }}
//     >
//       <AddIcon fontSize="small" />
//     </IconButton>

//     {nodes && fileName !== "node_modules" && (
//       <Collapse in={open} timeout="auto" unmountOnExit>
//         <List component="div" disablePadding sx={{ pl: 2 }}>
//           {Object.keys(nodes).map((child) => (
//             <FileTreeNode
//               key={child}
//               fileName={child}
//               path={path ? `${path}/${child}` : child}
//               nodes={nodes[child]}
//               onSelect={onSelect}
//               selectedFile={selectedFile}
//             />
//           ))}
//         </List>
//       </Collapse>
//     )}
//   </>
// )}


//     </>
//   );
// };

// const Tree = ({ tree, onSelect, selectedFile, onCreateNew }) => {
//   return (
//     <Box
//       sx={{
//         bgcolor: "#252526",
//         color: "#ffffff",
//         height: "100%",
//         overflowY: "auto",
//         fontFamily: '"Segoe UI", Roboto, sans-serif',
//         "& .MuiListItemIcon-root": {
//           color: "#ffffff",
//         },
//       }}
//     >
//       <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
//         <Typography
//           variant="caption"
//           sx={{
//             flexGrow: 1,
//             color: "#858585",
//             textTransform: "uppercase",
//             fontSize: "0.7rem",
//           }}
//         >
//           Explorer
//         </Typography>
//         <IconButton size="small" onClick={onCreateNew} sx={{ color: "#ffffff" }}>
//           <AddIcon fontSize="small" />
//         </IconButton>
//       </Box>
//       <List dense>
//         <FileTreeNode
//           fileName="/"
//           path=""
//           nodes={tree}
//           onSelect={onSelect}
//           selectedFile={selectedFile}
//         />
//       </List>
//     </Box>
//   );
// };

// export default Tree;









import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRight from "@mui/icons-material/ChevronRight";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const StyledListItem = styled(ListItem)(({ theme, isSelected }) => ({
  padding: "2px 8px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  backgroundColor: isSelected ? "#37373d" : "transparent",
  "& .MuiListItemText-primary": {
    fontWeight: isSelected ? "bold" : "normal",
  },
}));

const FileTreeNode = ({ fileName, nodes, onSelect, path, selectedFile }) => {
  const isDir = !!nodes;
  const isSelected = path === selectedFile;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDir) {
      setOpen(!open);
    }
    onSelect(path, isDir); // Call onSelect for both files and folders
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${isDir ? "folder" : "file"} '${fileName}'?`)) {
      await fetch(`http://localhost:9000/files/delete?path=${path}`, {
        method: "DELETE",
      });
      // Note: Assumes the backend emits a "file:refresh" event to update the UI
      handleMenuClose();
    }
  };

  const handleDownload = () => {
    window.open(`http://localhost:9000/files/download?path=${path}`, "_blank");
    handleMenuClose();
  };

  const handleRename = async () => {
    const newName = prompt(`Enter new name for ${isDir ? "folder" : "file"} '${fileName}':`, fileName);
    if (newName && newName !== fileName) {
      const parentPath = path.substring(0, path.lastIndexOf("/")) || "";
      const newPath = parentPath ? `${parentPath}/${newName}` : newName;
      try {
        const response = await fetch("http://localhost:9000/files/rename", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPath: path, newPath }),
        });
        if (response.ok) {
          console.log(`${isDir ? "Folder" : "File"} renamed successfully`);
          // Note: Assumes the backend emits a "file:refresh" event to update the UI
        } else {
          const error = await response.text();
          console.error("Failed to rename:", error);
          alert(`Failed to rename: ${error}`);
        }
      } catch (err) {
        console.error("Error:", err);
        alert(`Error renaming: ${err.message}`);
      }
    }
    handleMenuClose();
  };

  const createFolder = async (folderPath) => {
    try {
      const response = await fetch("http://localhost:9000/files/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: folderPath, isDir: true }),
      });

      if (response.ok) {
        console.log("Folder created successfully");
        // Note: Assumes the backend emits a "file:refresh" event to update the UI
      } else {
        const error = await response.text();
        console.error("Failed to create folder:", error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <StyledListItem
        button
        onClick={handleClick}
        isSelected={isSelected}
        secondaryAction={
          <IconButton
            edge="end"
            size="small"
            onClick={handleMenuClick}
            sx={{ color: "#ffffff" }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        }
      >
        <ListItemIcon sx={{ minWidth: "32px" }}>
          {isDir ? (
            open ? (
              <ExpandMore sx={{ fontSize: "18px" }} />
            ) : (
              <ChevronRight sx={{ fontSize: "18px" }} />
            )
          ) : (
            <InsertDriveFileIcon sx={{ fontSize: "18px", color: "#90caf9" }} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              {fileName}
            </Typography>
          }
        />
      </StyledListItem>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleDownload}>Download</MenuItem>
        <MenuItem onClick={handleRename}>Rename</MenuItem>
      </Menu>
      {isDir && (
        <>
          <IconButton
            edge="end"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              const folderName = prompt("Enter new folder name");
              if (folderName) {
                createFolder(`${path}/${folderName}`);
              }
            }}
            sx={{ color: "#ffffff", ml: 1 }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          {nodes && fileName !== "node_modules" && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {Object.keys(nodes).map((child) => (
                  <FileTreeNode
                    key={child}
                    fileName={child}
                    path={path ? `${path}/${child}` : child}
                    nodes={nodes[child]}
                    onSelect={onSelect}
                    selectedFile={selectedFile}
                  />
                ))}
              </List>
            </Collapse>
          )}
        </>
      )}
    </>
  );
};

const Tree = ({ tree, onSelect, selectedFile, onCreateNew }) => {
  return (
    <Box
      sx={{
        bgcolor: "#252526",
        color: "#ffffff",
        height: "100%",
        overflowY: "auto",
        fontFamily: '"Segoe UI", Roboto, sans-serif',
        "& .MuiListItemIcon-root": {
          color: "#ffffff",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <Typography
          variant="caption"
          sx={{
            flexGrow: 1,
            color: "#858585",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        >
          Explorer
        </Typography>
        <IconButton size="small" onClick={onCreateNew} sx={{ color: "#ffffff" }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <List dense>
        <FileTreeNode
          fileName="/"
          path=""
          nodes={tree}
          onSelect={onSelect}
          selectedFile={selectedFile}
        />
      </List>
    </Box>
  );
};

export default Tree;