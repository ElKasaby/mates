const { Conversation } = require("../models/conversation");
const { Message } = require("../models/message");
const _ = require("lodash");
const {Notification} = require('../models/notification')

// const { find } = require("../models/user");

module.exports ={
  fetchAll: async(req, res, next)=>{
    console.log("new error");
    const conversations = await Conversation.find
      ({"users": req.user.id})
      .sort("-createdAt")
      .populate([{path: "users", select: "name url"}, "lastMessage"])
  
    res.status(200).send(conversations);
  },
  fetchMessagesForCoversation: async(req, res, next)=>{
    console.log("we are here 1");
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation)
      return res.status(404).send("No Conversation with that id");

    if (conversation.users.indexOf(req.user._id) === -1)
      return res.status(403).send("Dont allow to view these messages");

    let key = _.findKey(conversation.meta, { user: req.user._id });
    if (key !== undefined) {
      conversation.meta[key].countOfUnseenMessages = 0;
      await conversation.save();
    }
    //find().sort().populate()
    const messages = await Message.find
      ({"conversation": req.params.id})
      .sort("-createdAt")
      .populate([{path: "user", select: "name url"}])

      res.status(200).json({
        conversation,
        messages
      })
  },
  check: async(req, res, next)=>{
    console.log("1");
    let conversation = await Conversation.findOne({
      $or: [{ users: [req.user.id, req.params.userId] }, { users: [req.params.userId, req.user.id] }],
    }); 
    // if not 404 --- space if okay conut
    if (!conversation) {
      console.log("2");
      conversation = await new Conversation({
        users: [req.user.id, req.params.userId],
        meta: [
          { user: req.user.id, countOfUnseenMessages: 0 },
          { user: req.params.userId, countOfUnseenMessages: 0 },
        ],
      }).save();
       const messages = await Message.find
        ({"conversation": conversation.id})
        .sort("-createdAt")
        .populate([{path: "user", select: "name url"}])
      return res.status(200).json({
        conversation,
        messages
      })
    }
    if (conversation.users.indexOf(req.user._id) === -1)
      return res.status(403).send("Dont allow to view these messages");

    let key = _.findKey(conversation.meta, { user: req.user._id });
    if (key !== undefined) {
      conversation.meta[key].countOfUnseenMessages = 0;
      await conversation.save();
    }
    console.log("3");
    const messages = await Message.find
      ({"conversation": conversation.id})
      .sort("-createdAt")
      .populate([{path: "user", select: "name url"}])
    res.status(200).json({
      conversation,
      messages
    })
  },
  deleteChat : async (req, res, next)=>{
    chat = await Conversation.findOne({_id: req.params.id})
    if(!chat){
     return res.status(401).send("this chat does not exist")
    }
    await Conversation.deleteOne({_id : req.params.id})
    // await Conversation.deleteOne({_id : req.params.id})

  }
}

// exports.fetchAll = async (req, res) => {
//   console.log("new error");
//   const conversations = await Conversation.find
//     ({"users": req.user.id})
//     .sort("-createdAt")
//     .populate([{path: "users", select: "name url"}, "lastMessage"])
  
//   res.status(200).send(conversations);
// };

// exports.fetchMessagesForCoversation = async (req, res) => {
//       console.log("we are here 1");
//       const conversation = await Conversation.findById(req.params.id);
//       if (!conversation)
//         return res.status(404).send("No Conversation with that id");

//       if (conversation.users.indexOf(req.user._id) === -1)
//         return res.status(403).send("Dont allow to view these messages");

//       let key = _.findKey(conversation.meta, { user: req.user._id });
//       if (key !== undefined) {
//         conversation.meta[key].countOfUnseenMessages = 0;
//         await conversation.save();
//       }
//       //find().sort().populate()
//       const messages = await Message.find
//         ({"conversation": req.params.id})
//         .sort("-createdAt")
//         .populate([{path: "user", select: "name url"}])


//       res.status(200).send(messages);
//         res.status(200).json({
//           conversation,
//           messages
//         })
// };

// exports.check = async (req, res) => {
//       console.log("1");
//       let conversation = await Conversation.findOne({
//         $or: [{ users: [req.user.id, req.params.userId] }, { users: [req.params.userId, req.user.id] }],
//       }); 
//       // if not 404 --- space if okay conut
//       if (!conversation) {
//         console.log("2");
//         conversation = await new Conversation({
//           users: [req.user.id, req.params.userId],
//           meta: [
//             { user: req.user.id, countOfUnseenMessages: 0 },
//             { user: req.params.userId, countOfUnseenMessages: 0 },
//           ],
//         }).save();
//         const messages = await Message.find
//           ({"conversation": conversation.id})
//           .sort("-createdAt")
//           .populate([{path: "user", select: "name url"}])
//         return res.status(200).json({
//           conversation,
//           messages
//         })
//       }
//       if (conversation.users.indexOf(req.user._id) === -1)
//         return res.status(403).send("Dont allow to view these messages");

//       let key = _.findKey(conversation.meta, { user: req.user._id });
//       if (key !== undefined) {
//         conversation.meta[key].countOfUnseenMessages = 0;
//         await conversation.save();
//       }
//       console.log("3");
//       const messages = await Message.find
//         ({"conversation": conversation.id})
//         .sort("-createdAt")
//         .populate([{path: "user", select: "name url"}])
//       res.status(200).json({
//         conversation,
//         messages
//       })
// };
