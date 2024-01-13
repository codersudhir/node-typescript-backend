// const { Invoice, UserProfile, UserBusinessProfile } = require('../models');
// const ApiError = require('../errors/ApiError');

// class InvoiceController {
//     createInvoice = async (req, res, next) => {
//         var token = req.header('authorization');
//         if (token) {
//             var payload = decodeToken(token);
//             // console.log("token ", token);
//             var invoice = new Invoice(req.body);
//             invoice.user_id = payload.id;
//             invoice
//                 .save()
//                 .then((invoice) => {
//                     res.status(200).json({
//                         status: 'success',
//                         message: 'invoice created successfully',
//                         data: invoice,
//                     });
//                 })
//                 .catch((error) => {
//                     res.status(500).json({
//                         status: 'error',
//                         message: 'invoice not created',
//                         error: error,
//                     });
//                 });
//         } else {
//             res.status(403).json({
//                 status: 'error',
//                 message: 'token not found',
//             });
//         }
//     };

//     getInvoice = async (req, res, next) => {
//         var token = req.header('authorization');
//         if (token) {
//             var payload = decodeToken(token);
//             Invoice.findAll({
//                 where: {
//                     user_id: payload.id,
//                 },
//             })
//                 .then((invoice) => {
//                     res.status(200).json({
//                         status: 'success',
//                         message: 'invoice fetched successfully',
//                         data: invoice,
//                     });
//                 })
//                 .catch((error) => {
//                     res.status(500).json({
//                         status: 'error',
//                         message: 'invoice not fetched',
//                         error: error,
//                     });
//                 });
//         } else {
//             res.status(403).json({
//                 status: 'error',
//                 message: 'token not found',
//             });
//         }
//     };

//     updateInvoice = async (req, res, next) => {
//         var token = req.header('authorization');
//         if (token) {
//             var payload = decodeToken(token);
//             Invoice.update(req.body, {
//                 where: {
//                     id: req.body.id,
//                 },
//             })
//                 .then((invoice) => {
//                     res.status(200).json({
//                         status: 'success',
//                         message: 'invoice updated successfully',
//                         // data: invoice
//                     });
//                 })
//                 .catch((error) => {
//                     res.status(500).json({
//                         status: 'error',
//                         message: 'invoice not updated',
//                         error: error,
//                     });
//                 });
//         } else {
//             res.status(403).json({
//                 status: 'error',
//                 message: 'token not found',
//             });
//         }
//     };
// }
const { Party, Item, Invoice } = require('../models');

const LIMIT = 10;

decodeToken = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    return payload;
};

// PARTIES
exports.createParty = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            await Party.create({
                type: req.body.type,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                gstin: req.body.gstin,
                userId: payload.id,
            });

            res.status(200).json({
                status: 'success',
                msg: 'Party created',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

exports.getParties = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);

        if (!req.query.type) {
            return res.status(400).json({
                status: 'error',
                error: 'query type required',
            });
        }

        try {
            const data = await Party.findAndCountAll({
                where: {
                    userId: payload.id,
                    type: req.query.type,
                },
                offset: req.body.pageNo ? req.body.pageNo * LIMIT : 0,
                limit: LIMIT,
                order: [['name', 'ASC']],
            });

            res.status(200).json({
                total_parties: data.count,
                parties: data.rows,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

exports.getPartyById = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            const data = await Party.findOne({
                where: {
                    userId: payload.id,
                    id: req.params.id,
                },
            });

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

// ITEMS
exports.createItem = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            await Item.create({
                type: req.body.type,
                name: req.body.name,
                description: req.body.description,
                unit: req.body.unit,
                salePrice: req.body.salePrice,
                purchasePrice: req.body.purchasePrice,
                taxExempted: req.body.taxExempted,
                openingStock: req.body.openingStock,
                lowStock: req.body.lowStock,
                hsnCode: req.body.hsnCode,
                gstPercentage: req.body.gstPercentage,
                userId: payload.id,
            });

            res.status(200).json({
                status: 'success',
                msg: 'Item created',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

exports.getItems = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            const data = await Item.findAndCountAll({
                where: {
                    userId: payload.id,
                },
                offset: req.query.pageNo ? req.query.pageNo * LIMIT : 0,
                limit: LIMIT,
                order: [['name', 'ASC']],
                // offset: req.body.offset ? req.body.offset : 0,
            });

            res.status(200).json({
                total_items: data.count,
                items: data.rows,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

exports.getItemById = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            const data = await Item.findOne({
                where: {
                    userId: payload.id,
                    id: req.params.id,
                },
            });

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

// INVOICE
exports.createInvoice = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            await Invoice.create({
                type: req.body.type,
                invoiceNumber: req.body.invoiceNumber,
                partyName: req.body.partyName,
                phoneNumber: req.body.phoneNumber,
                partyAddress: req.body.partyAddress,
                gstin: req.body.gstin,
                date: req.body.date,
                userGstin: req.body.userGstin,
                stateOfSupply: req.body.stateOfSupply,
                totalAmount: req.body.totalAmount,
                paidVia: req.body.paidVia,
                balanceDue: req.body.balanceDue,
                userId: payload.id,
            });

            res.status(200).json({
                status: 'success',
                msg: 'Invoice created',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

exports.getInvoices = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            const data = await Invoice.findAndCountAll({
                where: {
                    userId: payload.id,
                },
                offset: req.query.pageNo ? req.query.pageNo * LIMIT : 0,
                limit: LIMIT,
            });

            res.status(200).json({
                total_invoices: data.count,
                items: data.rows,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};

exports.getInvoiceById = async (req, res) => {
    var token = req.header('authorization');
    if (token) {
        var payload = decodeToken(token);
        try {
            const data = await Invoice.findOne({
                where: {
                    userId: payload.id,
                    id: req.params.id,
                },
            });

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error,
            });
        }
    } else {
        res.status(403).json({
            status: 'error',
            message: 'token not found',
        });
    }
};
