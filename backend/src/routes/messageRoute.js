import express from 'express';

import{
    sendDrirectMessage,
    sendGroupMessage
} from '../controllers/messageController.js'

const router = express.Router();

router.post('/direct', sendDrirectMessage);
router.post('/group', sendGroupMessage);


export default router;