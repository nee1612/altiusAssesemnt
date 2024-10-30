import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { TextField, Button, Grid, Typography, Paper } from "@mui/material";
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

function AddUpdateInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(initialInvoice);

  useEffect(() => {
    if (id !== "0") {
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
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] =
      field === "quantity" || field === "price"
        ? parseFloat(value) || 0
        : value;
    updatedItems[index].amount =
      updatedItems[index].quantity * updatedItems[index].price;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const handleBillSundryChange = (index, field, value) => {
    const updatedBillSundrys = [...invoice.billSundrys];
    updatedBillSundrys[index][field] =
      field === "amount" ? parseFloat(value) || 0 : value;
    setInvoice({ ...invoice, billSundrys: updatedBillSundrys });
  };

  const calculateTotalAmount = () => {
    const itemsTotal = invoice.items.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    const billSundrysTotal = invoice.billSundrys.reduce(
      (acc, sundry) => acc + sundry.amount,
      0
    );
    return itemsTotal + billSundrysTotal;
  };

  const addDataRef = collection(db, "Invoices");
  const handleSave = async () => {
    const totalAmount = calculateTotalAmount();
    const invoiceToSave = { ...invoice, totalAmount };

    try {
      if (id === "0") {
        const docRef = await addDoc(addDataRef, {
          ...invoiceToSave,
          docId: "",
        });
        await updateDoc(docRef, { docId: docRef.id });
        setInvoice({ ...invoiceToSave, id: docRef.id });
      } else {
        await updateDoc(doc(db, "Invoices", id), invoiceToSave);
        setInvoice(invoiceToSave);
      }
      alert("Invoice saved successfully!");
      navigate("/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice: " + error.message);
    }
  };

  return (
    <Paper style={{ padding: 16, marginTop: 70 }}>
      <Typography variant="h5">Invoice Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={invoice.customerName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Invoice Date"
            type="date"
            name="date"
            InputLabelProps={{ shrink: true }}
            value={invoice.date}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Billing Address"
            name="billingAddress"
            value={invoice.billingAddress}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Shipping Address"
            name="shippingAddress"
            value={invoice.shippingAddress}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="GSTIN"
            name="GSTIN"
            value={invoice.GSTIN}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>

      {/* Items Section */}
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Items
      </Typography>
      {invoice.items.map((item, index) => (
        <Grid container spacing={2} key={item.id}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Item Name"
              value={item.itemName}
              onChange={(e) =>
                handleItemChange(index, "itemName", e.target.value)
              }
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Amount"
              value={item.amount}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      ))}

      {/* Bill Sundrys Section */}
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Bill Sundrys
      </Typography>
      {invoice.billSundrys.map((sundry, index) => (
        <Grid container spacing={2} key={sundry.id}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Bill Sundry Name"
              value={sundry.billSundryName}
              onChange={(e) =>
                handleBillSundryChange(index, "billSundryName", e.target.value)
              }
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={sundry.amount}
              onChange={(e) =>
                handleBillSundryChange(index, "amount", e.target.value)
              }
              required
            />
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
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSave}>
            {id === "0" ? "Save" : "Update"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AddUpdateInvoice;
