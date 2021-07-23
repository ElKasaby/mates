const { json } = require('body-parser')
const mongoose = require('mongoose');
const User = require('../models/user')
const Team = require('../models/team')
const Calendar = require('../models/calendar')
const {Notification} = require('../models/notification')



module.exports ={
    getAll: async(req, res, next)=>{
        const allCalendar = await Calendar.find({"members":req.user.id})
        console.log(allCalendar);
        if(allCalendar){
            return res.status(200).json({
                massage: "All Calendar",
                allCalendar
            })
        }
        res.status(401).json({
            massage: "No Calendar yet",
        })
    },
    addMeeting: async(req, res, next)=>{
        const team= await Team.findOne({_id: req.params.teamId})
        if(!team){
            return res.status(403).send("No team with this id")
        }
        //create a new Calendar 
        const newCalendar = new Calendar({
            meetingName: req.body.meetingName,
            teamName: team.teamName,
            teamId:req.params.teamId,
            meetingTime: req.body.time,
            meetingDate: req.body.date,
            ownerMetting: req.user.name,
            ownerId: req.user.id,
            members: team.teamMember
        })
        await newCalendar.save()
        res.status(201).json(newCalendar)


        // Send Notification in-app
        const clients = await Team.findOne({_id: req.params.teamId})
        const targetUsers = clients.teamMember
        const users = await User.find({_id:{$in:targetUsers}})
        // console.log(targetUsers);
        const notification = await new Notification({
            title: "Add calendar",
            body: `${req.user.name} add calendar in ${clients.teamName} `,
            user: req.user._id,
            targetUsers: targetUsers,
            subjectType: "calendar",
            subject: newCalendar.id ,
        }).save();
  
        // push notifications
        const receivers = users;
        for (let i = 0; i < receivers.length; i++) {
            await receivers[i].sendNotification(
                notification.toFirebaseNotification()
            );
        }
    },
    cancel: async(req, res, next)=>{
        const calendar = await Calendar.findOne({_id:req.params.calId})
        const id = calendar.teamId
        const clients = await Team.findOne({_id: calendar.teamId})
        const targetUsers = clients.teamMember
        // await Notification.remove()
        if(calendar){
            if(calendar.ownerId == req.user.id){
                await Calendar.deleteOne({"_id": req.params.calId})
                return res.status(200).json({
                    massage: "Calendar cancel",
                })
            }
            return res.status(401).json({
                massage: "Error this is not your Calendar",
            })
        }
        res.status(401).json({
            massage: "Error this calendar does not exist",
        })

        // Send Notification in-app
        
        const users = await User.find({_id:{$in:targetUsers}})
        const notification = await new Notification({
            title: "cancel meeting",
            body: `${req.user.name} cancel this ${clients.meetingName} `,
            user: req.user._id,
            targetUsers: targetUsers,
            subjectType: "team",
            subject: id ,
        }).save();
  
        // push notifications
        const receivers = users;
        for (let i = 0; i < receivers.length; i++) {
            await receivers[i].sendNotification(
                notification.toFirebaseNotification()
            );
        }

    }
}