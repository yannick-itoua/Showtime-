// user.controller
const User = require('../models/user.model');
const Items = require('../models/item.model');

module.exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('tickets.item');
    console.log(user.tickets);
    res.status(200).json({ name: user.name, id: user._id, tickets: user.tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports.update = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    const user = await User.findByIdAndUpdate(req.userId, updatedData, { new: true }).populate('tickets.item');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.borrowItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.userId);
    const item = await Items.findById(itemId);
    if (item.capacity >=1) {    
      item.userId = user._id;
      item.capacity -= 1;
      const updatedItem = await item.save();
      const ticket = user.tickets.find(ticket => ticket.item.toString() === updatedItem._id.toString());
      if (ticket) {
        ticket.reservedTickets += 1;
      } else {
        user.tickets.push({ item: updatedItem._id, reservedTickets: 1 });
      }
      await user.save();
      res.status(200).json(updatedItem);
    } else {
      res.status(400).json({ error: 'No more capacity for this item' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.releaseItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.userId);
    const item = await Items.findById(itemId);

    if (item) {
      item.capacity += 1;
      item.userId = null;
      const updatedItem = await item.save();

      const ticket = user.tickets.find(ticket => ticket.item.toString() === updatedItem._id.toString());
      if (ticket && ticket.reservedTickets > 0) {
        ticket.reservedTickets -= 1;
        if (ticket.reservedTickets === 0) {
          user.tickets = user.tickets.filter(ticket => ticket.item.toString() !== updatedItem._id.toString());
        }
      }
      await user.save();

      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
