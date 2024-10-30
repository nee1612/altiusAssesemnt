import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
} from "@mui/material";
import AddUpdateInvoice from "./components/AddUpdateInvoice";
import InvDetail from "./components/InvDetail";
import ListInvItems from "./components/ListInvItems";

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Invoice Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240 },
        }}
      >
        <Toolbar />
        <List>
          <ListItem>
            <ListItemText primary="Invoices" />
          </ListItem>
        </List>
      </Drawer>
      <main style={{ marginLeft: 240, padding: 20 }}>
        <Routes>
          <Route path="/" element={<ListInvItems />} />
          <Route path="/invoices/edit/:id" element={<AddUpdateInvoice />} />
          <Route path="/details/:id" element={<InvDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
