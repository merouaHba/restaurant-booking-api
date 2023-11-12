var slugify = require('slugify')
const {MenuItemModel} = require('../models');
const { StatusCodes } = require('http-status-codes');


const { uploadFile, destroyFile } = require('../utils/cloudinary')
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');
const validateMongoDbId = require('../utils/validateMongodbId');


const createMenuItem = async (req, res) => {
    const files = req.files;
    const slug = slugify(req.body.name)
    let mainImage = {
        public_id: '',
        url: '',
    }
    let images = []
    // console.log('file.fieldName')
    if (files.length < 2) {
        throw new CustomError.BadRequestError('please upload images')
    }
    const fieldnames = []
    files.map(file => {
        fieldnames.push(file.fieldname)
    })
    console.log(fieldnames)
    console.log(!fieldnames.includes("mainImage"))

    if (!fieldnames.includes("mainImage")) {
        throw new CustomError.BadRequestError('please upload main image')
    }


    await Promise.all(files.map(async (file) => {

        try {
            const result = await uploadFile(file.path, `MenuItems`);

            if (file.fieldname === 'mainImage') {
                console.log('mainImage')
                mainImage.public_id = result.public_id
                mainImage.url = result.secure_url

                console.log(mainImage)
            }
            images.push({
                public_id: result.public_id,
                url: result.secure_url
            })
            console.log(mainImage)
            console.log("###################")
            console.log(images)


        } catch (err) {
            // 👇️ catch block ran:  An error occurred
            throw new CustomError.BadRequestError(err._message)
        }


    }))

    const MenuItem = await MenuItem.create({ ...req.body, slug, mainImage, images });
    // console.log(req.files)
    res.status(StatusCodes.CREATED).json({ MenuItem });

};
const getAllMenuItems = async (req, res) => {
    const MenuItems = await MenuItem.find({});

    res.status(StatusCodes.OK).json({ MenuItems, count: MenuItems.length });
};
const getSingleMenuItem = async (req, res) => {
    const { id: slug } = req.params;

    const MenuItem = await MenuItem.findOne({ slug: slug });

    if (!MenuItem) {
        throw new CustomError.NotFoundError(`No MenuItem found with id : ${slug}`);
    }

    res.status(StatusCodes.OK).json({ MenuItem });
};
const updateMenuItem = async (req, res) => {
    const { id: MenuItemId } = req.params;


    const { idAdmin } = req.body;
    checkPermissions(id, idAdmin, 'admin')


    validateMongoDbId(MenuItemId)
    const MenuItem = await MenuItem.findOneAndUpdate({ _id: MenuItemId }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!MenuItem) {
        throw new CustomError.NotFoundError(`No MenuItem with id : ${MenuItemId}`);
    }

    res.status(StatusCodes.OK).json({ msg: "Success! MenuItem updated", MenuItem });
};
const deleteMenuItem = async (req, res) => {
    const { id: MenuItemId } = req.params;


    const { idAdmin } = req.body;
    checkPermissions(id, idAdmin, 'admin')

    validateMongoDbId(MenuItemId)
    const MenuItem = await MenuItem.findOneAndDelete({ _id: MenuItemId });

    if (!MenuItem) {
        throw new CustomError.NotFoundError(`No MenuItem with id : ${MenuItemId}`);
    }

    await destroyFile(MenuItem.mainImage.public_id)

    MenuItem.images.map(async (image) => await destroyFile(image.url))


    res.status(StatusCodes.OK).json({ msg: 'Success! MenuItem removed.' });
};
const updateMenuItemMainImage = async (req, res) => {
    const { id } = req.params;

    const { idAdmin } = req.body;
    checkPermissions(id, idAdmin, 'admin')

    validateMongoDbId(id)
    const MenuItem = await MenuItem.findOne({ _id: id });
    console.log(!req.file)
    if (!req.file) {
        throw new CustomError.NotFoundError("No file found, please upload file")
    }
    const result = await uploadFile(req.file.path, `MenuItems`);

    if (MenuItem.mainImage.url) {
        await destroyFile(MenuItem.mainImage.url)
    }
    console.log("top")
    MenuItem.mainImage = {
        public_id: result.public_id,
        url: result.secure_url
    }
    MenuItem.save();

    res.status(StatusCodes.OK).json({ msg: "Main image updated" })
};
const updateMenuItemImages = async (req, res) => {
    const { id } = req.params;


    const { idAdmin } = req.body;
    checkPermissions(id, idAdmin, 'admin')

    validateMongoDbId(id)
    const MenuItem = await MenuItem.findOne({ _id: id });
    console.log(!req.files)
    if (req.files.length === 0) {
        throw new CustomError.NotFoundError("No file found, please upload file")
    }
    const files = req.files;
    files.map(async (file) => {
        const result = await uploadFile(file.path, `MenuItems/${id}`)
        MenuItem.images = [];
        MenuItem.images.push({
            public_id: res.public_id,
            url: res.secure_url
        })
    })

    if (MenuItem.images.length !== 0) {
        MenuItem.images.map(async (image) => {
            await destroyFile(image.url)

        })
    }
    console.log("top")



    MenuItem.save();

    res.status(StatusCodes.OK).json({ msg: "images updated" })
};
const getTopSheapeastMenuItems = async (req, res) => {

}

module.exports = {
    createMenuItem,
    getAllMenuItems,
    getSingleMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateMenuItemMainImage,
    updateMenuItemImages,
    getTopSheapeastMenuItems
};