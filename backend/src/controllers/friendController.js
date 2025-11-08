import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const {to, message} =  req.body;

        const from = req.user._id;

        if (from === to) {
            return res.status(400).json({ message: "Không thể gửi lời mời kết bạn cho chính mình" });
        }

        const userExists = await User.exists({ _id: to });
        if (!userExists) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        let userA = from.toString();
        let userB = to.toString();
        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }

        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.exists({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            })
        ])

        if (alreadyFriends) {
            return  res.status(400).json({ message: "Bạn đã là bạn bè với người dùng này" });
        }
        if (existingRequest) {
            return res.status(400).json({ message: "Đã có lời mời kết bạn tồn tại giữa hai người dùng" });
        }

        const request = await FriendRequest.create({ from, to, message });
        res.status(201).json({ message: "Đã gửi lời mời kết bạn", request });

    } catch (error) {
        console.error("Lỗi khi yêu cầu kết bạn:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Lời mời kết bạn không tồn tại" });
        }
        if (request.to.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền chấp nhận lời mời kết bạn này" });
        }

        const friend = await Friend.create({
             userA: request.from,
              userB: request.to 
            });
        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from).select('_id displayName avatarUrl').lean();

        return res.status(200).json({ message: "Đã chấp nhận lời mời kết bạn", 
            newFriend: from?._id,
            displayName: from?.displayName,
            avatarUrl: from?.avatarUrl
         });
    } catch (error) {
        console.error("Lỗi khi chấp nhận lời mời kết bạn:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Lời mời kết bạn không tồn tại" });
        }

        if (request.to.toString() !== userId.toString()){
            return res.status(403).json({ message: "Bạn không có quyền từ chối lời mời kết bạn này" });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.sendStatus(204);

    } catch (error) {
        console.error("Lỗi khi từ chối lời mời kết bạn:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const getAllFriends = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu kết bạn:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}