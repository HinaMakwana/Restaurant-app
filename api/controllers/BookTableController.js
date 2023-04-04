/**
 * BookTableController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    book : async (req,res)=> {
        const validate = sails.config.custom.validate
        const id = sails.config.custom.uuid
        validate(req)
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        const user = req.userData
        let { date, guestNo, timeSlot } = req.body
            const newDate = await BookTable.checkDate(date)
            const newTimeSlot =await BookTable.checkTime(timeSlot,date)
            if(newDate.msg == 'done') {
                if(newTimeSlot == true) {
                    console.log('ok');
                } else {
                    return res.status(402).json({
                        error : newTimeSlot
                    })
                }
            } else {
                return res.status(403).json({
                    message : 'check your Date',
                    error : newDate.msg
                })
            }
            if(isNaN(guestNo) == false && guestNo > 0){
                guestNo = parseInt(guestNo)
            } else {
                return res.status(400).json({
                    message :'enter positive number only'
                })
            }
            const data = {
                id : id(),
                user : user.userId,
                date : date,
                guestNo : guestNo,
                timeSlot : timeSlot,
                email : user.email
            }
            const bookTable = await BookTable.create(data).fetch()
            res.status(200).json({
                message : " book table successfully",
                Table : bookTable
            })

    },
    cancel : async (req,res)=> {
        const user = req.userData
        const { id } = req.body
            const findUser = await BookTable.findOne({ user : user.userId, id : id, orderStatus : 'pending'})
            if(!findUser){
                return res.status(404).json({
                    message : 'table booking details not found'
                })
            }
            const cancelTable = await BookTable.updateOne({id : id},{ orderStatus : 'cancel'})
            res.status(200).json({
                message : 'table cancel',
                Table : cancelTable
            })
    },
    list : async (req,res)=> {
        const user = req.userData
            const listTable = await BookTable.find({ user : user.userId}).omit(['email','user'])
            if(!listTable){
                return res.status(404).json({
                    message : 'user not found'
                })
            }
            res.status(200).json({
                count : listTable.length,
                BookedTable : listTable
            })
    },
    listOne : async (req,res)=> {
        const user = req.userData
        const { id } = req.body
            const listTable = await BookTable.find({ user : user.userId, id : id}).omit(['email','user'])
            if(!listTable){
                return res.status(404).json({
                    message : 'user not found'
                })
            }
            res.status(200).json({
                BookedTable : listTable
            })
    },
    confirm : async (req,res)=> {
        const { id , status } = req.body
        const findTable = await BookTable.findOne({id : id})
        if(findTable.orderStatus == 'confirm') {
            return res.json({
                message : 'table is already confirmed'
            })
        }
        const updateTable = await BookTable.updateOne({ id : id}, { orderStatus : status })
        return res.status(200).json({
            message : 'table confirmed',
            Table : updateTable
        })



    }

};
