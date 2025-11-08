import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    
},
{_id: false,})
const groupSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    },
    { _id: false}
)

const lastMessageSchema = new mongoose.Schema({
    _id: { type: String},
    content: {
        type: String,
        default:null,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, 
    creareAt: {
        type: Date,
        default: null,
    }
},
{ _id: false})

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['single', 'group'],
        required: true,
    },
    participants: {
        type: [participantSchema],
        required: true
    },
    group: {
        type: groupSchema,
    },
    lastMessage: {
        type: Date
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {},
    }

},
{ timestamps: true });

conversationSchema.index({
    'participants.userId': 1,
    lastMessageSchema: -1,
})

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;