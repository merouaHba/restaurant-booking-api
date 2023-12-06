var slugify = require('slugify')
const MenuItemModel = require('../models/menuItem.model');
const { StatusCodes } = require('http-status-codes');


const { uploadFile, destroyFile } = require('../utils/cloudinary')
const CustomError = require('../errors');
// const { checkPermissions } = require('../utils');
const validateMongoDbId = require('../utils/validateMongodbId');


const createMenuItem = async (req, res) => {
    const file = req.file;
    console.log(file)
    const slug = slugify(req.body.name)
    let image = {
        public_id: '',
        url: '',
    }

    if (!file) {
        throw new CustomError.BadRequestError('please upload image')
    }
   

            const result = await uploadFile(file.path, `menu`);

                image.public_id = result.public_id
                image.url = result.secure_url

                console.log(image)








    const MenuItem = await MenuItemModel.create({ ...req.body, slug, image });
    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            msg:"menu item created",
            MenuItem
        }
    });

};
const getMenu = async (req, res) => {
    const MenuItems = await MenuItemModel.find({});

    res.status(StatusCodes.OK).json({
        status: "success",
        data: { MenuItems, count: MenuItems.length }
});
};
const getMenuItem = async (req, res) => {
    const { id: slug } = req.params;

    const MenuItem = await MenuItemModel.findOne({ slug: slug });

    if (!MenuItem) {
        throw new CustomError.NotFoundError(`No MenuItem found with id : ${slug}`);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: { MenuItem } });
};
const updateMenuItem = async (req, res) => {
    const { id: MenuItemId } = req.params;



    validateMongoDbId(MenuItemId)
    const MenuItem = await MenuItemModel.findOneAndUpdate({ _id: MenuItemId }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!MenuItem) {
        throw new CustomError.NotFoundError(`No MenuItem with id : ${MenuItemId}`);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: { msg: "Success! MenuItem updated", MenuItem }
});
};
const deleteMenuItem = async (req, res) => {
    const { id: MenuItemId } = req.params;

    validateMongoDbId(MenuItemId)
    const MenuItem = await MenuItemModel.findOneAndDelete({ _id: MenuItemId });

    if (!MenuItem) {
        throw new CustomError.NotFoundError(`No MenuItem with id : ${MenuItemId}`);
    }

    await destroyFile(MenuItem.image.public_id)



    res.status(StatusCodes.OK).json({
        status: "success",
        data: { msg: 'Success! MenuItem removed.' }});
};
const updateMenuItemMainImage = async (req, res) => {
    const { id } = req.params;



    validateMongoDbId(id)
    const MenuItem = await MenuItem.findOne({ _id: id });
    console.log(!req.file)
    if (!req.file) {
        throw new CustomError.NotFoundError("No file found, please upload file")
    }
    const result = await uploadFile(req.file.path, `Menu`);

    if (MenuItem.image.url) {
        await destroyFile(MenuItem.image.url)
    }
    console.log("top")
    MenuItem.image = {
        public_id: result.public_id,
        url: result.secure_url
    }
    MenuItem.save();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: { msg: "Main image updated" }
})
};



module.exports = {
    createMenuItem,
    getMenu,
    getMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateMenuItemMainImage,
};