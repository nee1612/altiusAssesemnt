import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Typography, Grid, Paper, Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const initialInvoice = {
  id: uuidv4(),
  date: "",
  invoiceNumber: 0,
  customerName: "",
  billingAddress: "",
  shippingAddress: "",
  GSTIN: "",
  items: [{ id: uuidv4(), itemName: "", quantity: 1, price: 0, amount: 0 }],
  billSundrys: [{ id: uuidv4(), billSundryName: "", amount: 0 }],
  totalAmount: 0,
};

function InvDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(initialInvoice);

  useEffect(() => {
    const fetchInvoice = async () => {
      const docRef = doc(db, "Invoices", id);
      const invoiceData = await getDoc(docRef);
      if (invoiceData.exists()) {
        setInvoice({ id: invoiceData.id, ...invoiceData.data() });
      } else {
        console.error("Invoice not found!");
      }
    };
    fetchInvoice();
  }, [id]);

  return (
    <Paper style={{ padding: 16, marginTop: 70 }}>
      <Typography variant="h5">Invoice Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1">
            Customer Name: {invoice.customerName}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">Invoice Date: {invoice.date}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            Billing Address: {invoice.billingAddress}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            Shipping Address: {invoice.shippingAddress}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">GSTIN: {invoice.GSTIN}</Typography>
        </Grid>
      </Grid>

      {/* Items Section */}
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Items
      </Typography>
      {invoice.items.map((item) => (
        <Grid container spacing={2} key={item.id}>
          <Grid item xs={3}>
            <Typography variant="body1">Item Name: {item.itemName}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">Quantity: {item.quantity}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1">Price: {item.price}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1">Amount: {item.amount}</Typography>
          </Grid>
        </Grid>
      ))}

      {/* Bill Sundrys Section */}
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Bill Sundrys
      </Typography>
      {invoice.billSundrys.map((sundry) => (
        <Grid container spacing={2} key={sundry.id}>
          <Grid item xs={6}>
            <Typography variant="body1">
              Bill Sundry Name: {sundry.billSundryName}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">Amount: {sundry.amount}</Typography>
          </Grid>
        </Grid>
      ))}

      <Grid
        container
        justifyContent="flex-end"
        spacing={2}
        style={{ marginTop: 20 }}
      >
        <Grid item>
          <Button variant="contained" onClick={() => navigate("/invoices")}>
            Back to Invoices
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default InvDetail;
