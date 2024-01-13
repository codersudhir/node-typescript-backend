const express = require('express');
// const {
//     createInvoice,
//     updateInvoice,
//     deleteInvoice,
//     getInvoice,
//     getInvoicesByUser,
//     getTotalCount,
// } = require('../controllers/invoices');

const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    createParty,
    getParties,
    getPartyById,
    createItem,
    getItems,
} = require('../controllers/invoice.controller');

const router = express.Router();

// router.get('/count', getTotalCount); //use to generate invoice serial number
// router.get('/:id', getInvoice);
// router.get('/', getInvoicesByUser);
// router.post('/', createInvoice);
// router.patch('/:id', updateInvoice);
// router.delete('/:id', deleteInvoice);

router.get('/parties', getParties);
router.get('/party/:id', getPartyById);
router.post('/party', createParty);
// router.put('/party', updateParty);
// router.delete('/party', deleteParty);

router.get('/items', getItems);
router.post('/item', createItem);
// router.put('/item', updateItem);
// router.delete('/item', deleteItem);

router.get('/', getInvoices);
router.post('/create', createInvoice);
router.get('/:id', getInvoiceById);

module.exports = router;
