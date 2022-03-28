import { Router } from 'express';
import Joi from 'joi';

import { Track } from "./models.js";

const router = Router();

router.post('/track', async (req, res, next) => {
    const eventSchema = Joi.object({
        event: Joi.string().required(),
        tags: Joi.array(),
        url: Joi.string().required(),
        title: Joi.string(),
        ts: Joi.date().iso()
    })

    try {
        const { events } = req.body;
        const parsedEvents = JSON.parse(events);
        const errors = [];
        parsedEvents.forEach(eventObj => {
            const validation = eventSchema.validate(eventObj)
            if (validation.error) {
                errors.push(validation);
            }
        })

        if (errors.length > 0) return next(new Error('Events is not valid'));

        res.status(200).json();
        await Track.collection.insertMany(parsedEvents);
    } catch (error) {
        next(error);
    }
});

export default router;
