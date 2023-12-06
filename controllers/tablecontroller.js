const Table = require('../models/table.model');
const { StatusCodes } = require('http-status-codes');

const CustomError = require('../errors');
const validateMongoDbId = require('../utils/validateMongodbId');



const createTable = async (req, res) => {
    const { name, capacity } = req.body;


    const findTable = await Table.findOne({ name: name });

    console.log(!findTable)

    if (!findTable) {

        const table = await Table.create({ ...req.body})
        res.status(StatusCodes.CREATED).json({
            status: "success",
            data: {
                msg: 'Success! Table Created',
                table
            }
        });

    } else {
        throw new CustomError.BadRequestError('Table Already Exists')
    }

}


const getAllTables = async (req, res) => {

    const Tables = await Table.find();
    res.status(StatusCodes.OK).json({
        status: "success",
        data: { Tables }
});
};

const getSingleTable = async (req, res) => {
    validateMongoDbId(req.params.TableId)
    const table = await Table.findOne({ _id: req.params.TableId });
    if (!Table) {
        throw new CustomError.NotFoundError(`No Table with id : ${req.params.TableId}`);
    }
    res.status(StatusCodes.OK).json({
        status: "success",
        data: { table } });
};

const updateTable = async (req, res) => {
    const id = req.params.TableId;
    console.log(req.body, Object.values(req.body).length)
    if (Object.values(req.body).length === 0) {
        throw new CustomError.BadRequestError("no updated data")
    }

    const table = await Table.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    })
    console.log(Table)

    if (!Table) {
        throw new CustomError.NotFoundError(`No Table with this id: ${id}`)
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {msg:"table updated !!", table }
    });
};

const deleteTable = async (req, res) => {
    const { TableId: id } = req.params
    validateMongoDbId(id)
    const TableFound = await Table.findOne({ _id: id })

    if (!TableFound) {
        throw new CustomError.NotFoundError(`No Table with this id: ${id}`)
    }


    const table = await Table.findOneAndDelete({ _id: id })
    res.status(200).json({
        status: "success",
        data: { msg: "success! Table deleted", table }
})
}







module.exports = {
    createTable,
    getAllTables,
    getSingleTable,
    updateTable,
    deleteTable
};

