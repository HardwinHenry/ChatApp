import moongoose from 'mongoose';

const messageSchema = new moongoose.Schema({
    conversationId: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    senderId: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        trim: true,
    },
    imgUrl: {
        type: String,
    },
}, { timestamps: true });
    
messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = moongoose.model('Message', messageSchema);

export default Message;