const { json } = require('body-parser')
const User = require('../models/user')
const Team = require('../models/team')
const cloud = require('../../cloudinary')
const _ = require("lodash")


module.exports = {
    getAllTeam: async (req, res, next)=>{
        const allTeam = await Team.find({"teamMember":req.user.id})

        if(allTeam){
            return res.status(200).json({
                massage: "All team",
                allTeam
            })
        }
        res.status(401).json({
            massage: "No team yet",
        })
    },
    addTeam: async (req, res, next)=>{
        const result = await cloud.uploads(req.files[0].path||req.files[0])

        //create a new team
        const newTeam = new Team({
            teamName: req.body.teamName,
            teamDescription: req.body.teamDiscription,
            teamPhoto : req.files[0].originalname,
            url : result.url,
            teamOwner: req.user.id,
            teamMember: req.user.id,
            teamAdmin: req.user.id
        })
        await newTeam.save()
        res.status(201).json(newTeam)
    },
    invite: async (req, res, next)=>{
        const teamId = req.params.id
        const userName = req.body.name

        const userId = await User.findOne({"local.name": userName})
        if(!userId){
            return res.status(403).json({
                 error : 'name is not exist'
             })
         }
        
        const team = await Team.findOne({"_id": teamId})
        const foundId = await Team.findOne({"teamMember": userId.id})
        if(foundId){
            return res.status(403).json({
                error : 'Member is already exist',
                memberId: team.teamMember
             })
         }
        team.teamMember.unshift(userId)
        await team.save()
        res.status(200).json({
           massage  : 'Member add sucsusfly',
           team
        })
        
        
    },
    viewMember: async (req, res, next)=>{
        const teamId = req.params.id
        const team = await Team.findOne({"_id": teamId})
        
        const member =team.teamMember
        let memberData =[]
        for(var i= 0; i <= member.length ; i++){
            const foundUserId = await User.findOne({"_id": member[i]})
            if(foundUserId){
                memberData.push(foundUserId.local.name)
                
            }
        }
        res.status(200).json({
            memberData
        })

    },
    leave: async (req, res, next)=>{
        const teamId = req.params.id
        const userId = req.user.id
        const team = await Team.findOne({"_id": teamId})
        const member =team.teamMember
        for(var i= 0; i <team.teamMember.length ; i++){
            if(team.teamMember[i] == userId){
                console.log("okay");
                team.teamMember.splice(team.teamMember[i],1)  
                await team.save()
                return res.status(200).json({ 
                    massage: "Done",
                    member
                })            
            }
        }
    },
    deleteTeam: async (req, res, next)=>{
        const teamId = req.params.id
        const deleteTeam = await Team.deleteOne({"_id": teamId})
        const team = await Team.findOne({"_id": teamId})
        res.status(200).json({
            massage : 'team delete sucussfly',
            team
        })
    },
    editTeam: async (req, res, next)=>{
        const teamId = req.params.id
        const team = await Team.findOne({"_id": teamId})

        // new value 
        team.teamName= req.body.teamName
        team.teamDescription= req.body.teamDiscription
        team.teamPhoto= req.body.teamPhoto
        await team.save()
        res.status(200).json({
            massage:'team updata done',
            team
        })
    }

}