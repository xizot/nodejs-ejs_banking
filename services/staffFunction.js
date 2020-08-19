const AccountInfo = require("./accountInfo");
const Activity = require("./staffActivityLog");

const findInfoOffCustomer = async (key) => {
  const foundAccount = await AccountInfo.getBySTKOne(key);

  return foundAccount;
};

const findActivityStaff = async (staffID, numpage, limit) => {
  const found = await Activity.getAllActivity(staffID, numpage, limit);
  return found;
};
const countActivityStaff = async (staffID) => {
  const count = await Activity.count({
    where: {
      staffID,
    },
  });

  return Math.floor(count / 10) + (count % 10 > 0 ? 1 : 0);
};

module.exports = { findInfoOffCustomer, findActivityStaff, countActivityStaff };
