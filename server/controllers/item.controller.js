//item.controller
const Items = require('../models/item.model');
const User = require('../models/user.model');

const allitems = async (req, res) => {
  try {
    const allitems = await Items.find();
    res.status(200).json(allitems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getItem = async (req,res) => {
    const item = await Items.findById(req.params.itemId);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
}

const createitems = async (req, res, _) => {
  const newItemData = { ...req.body };
  try {
    const item = await Items.create(newItemData);
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

const deleteitems = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    await User.updateMany(
      { 'tickets.item': itemId },
      { $pull: { tickets: { item: itemId } } }
    );
    await Items.findByIdAndRemove(itemId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateItemDescription = async (req, res) => {
  const itemId = req.params.itemId;
  const { newDescription } = req.body;
  try {
    const item = await Items.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    item.description = newDescription;
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.allitems = allitems;
module.exports.getItem = getItem;
module.exports.createitems = createitems;
module.exports.deleteitems = deleteitems;
module.exports.updateItemDescription = updateItemDescription;
