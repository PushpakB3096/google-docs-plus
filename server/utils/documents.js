const Document = require("../models/Document");

// this function will either try to find the document with the given ID or create it in the DB
const findOrCreateDoc = async id => {
  if (id === null) return;

  const document = await Document.findById(id);

  if (document) return document;

  return await Document.create({
    _id: id,
    data: ""
  });
};

module.exports = findOrCreateDoc;
