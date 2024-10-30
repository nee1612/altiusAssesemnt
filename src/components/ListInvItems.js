import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

function ListInvItems() {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoiceSnapshot = await getDocs(collection(db, "Invoices"));
        const invoiceData = invoiceSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Invoices: ", invoiceData);
        setInvoices(invoiceData);
      } catch (error) {
        console.error("Error fetching invoices: ", error);
      }
    };
    fetchInvoices();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) =>
    setRowsPerPage(+event.target.value);

  const handleRowClick = (invoice) => {
    navigate(`/details/${invoice.docId}`);
  };

  const handleEditClick = (event, invoice) => {
    event.stopPropagation();
    navigate(`/invoices/edit/${invoice.docId}`);
  };

  return (
    <div>
      {/* "Add Invoice" Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/invoices/0")}
        startIcon={<AddIcon />}
        style={{ marginBottom: 16, marginTop: 56 }}
      >
        Add Invoice
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice) => (
                <TableRow
                  key={invoice.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(invoice)}
                >
                  <TableCell> INV {invoice.id.slice(0, 10)} </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.totalAmount}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(e, invoice);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={invoices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default ListInvItems;
