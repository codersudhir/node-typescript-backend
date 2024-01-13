// const express = require('express');
// const mongoose = require('mongoose');

// const InvoiceSchema = mongoose.Schema({
//     dueDate: Date,
//     currency: String,
//     types:String,
//     items: [ { itemName: String, unitPrice: String, quantity: String,hsn: String, discount: String } ],
//     rates: String,
//     extra:String,
//     vat: Number,
//     total: Number,
//     subTotal: Number,
//     notes: String,
//     status: String,
//     invoiceNumber: String,
//     type: String,
//     creator: [String],
//     totalAmountReceived: Number,
//     client: { name: String, email: String, phone: String, gst: String, address: String },
//     paymentRecords: [ {amountPaid: Number, datePaid: Date, paymentMethod: String, note: String, paidBy: String } ],
//     createdAt: {
//         type: Date,
//         default: new Date()
//     }
// })

// const InvoiceModel = mongoose.model('InvoiceModel', InvoiceSchema)
// module.exports= InvoiceModel

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {}
    Invoice.init(
        {
            // Invoice Number
            // Invoice Type (Sale/Purchase)
            // Party Name
            // Phone Number
            // Party Address
            // GSTIN
            // Invoice Date
            // Own GSTIN - User's GSTIN
            // State Of Supply
            // Total Amount
            // Paid Via (Unpaid, Online, Cash)
            // Balance Due
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING,
            },
            invoiceNumber: {
                type: DataTypes.STRING,
            },
            partyName: {
                type: DataTypes.STRING,
            },
            phoneNumber: {
                type: DataTypes.STRING,
            },
            partyAddress: {
                type: DataTypes.STRING,
            },
            gstin: {
                type: DataTypes.STRING,
            },
            date: {
                type: DataTypes.DATEONLY,
            },
            userGstin: {
                type: DataTypes.STRING,
            },
            stateOfSupply: {
                type: DataTypes.STRING,
            },
            totalAmount: {
                type: DataTypes.DECIMAL,
            },
            balanceDue: {
                type: DataTypes.DECIMAL,
            },
            paidVia: {
                type: DataTypes.STRING,
            },
            userId: {
                type: DataTypes.UUID,
            },
        },
        {
            sequelize,
            // tableName: 'invoices',
            modelName: 'Invoice',
        }
    );

    return Invoice;
};
