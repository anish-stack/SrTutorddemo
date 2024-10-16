const NewsLetter = require('../models/NewsLetterModal');
const sendEmail = require('../utils/SendEmails');
const NewsLetterTemplate = require('../models/NewsLetterSendtemplet');
const { ServerError, warn } = require('../utils/Logger');

exports.JoinNewsLetter = async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
        // Check if the email already exists
        let subscriber = await NewsLetter.findOne({ email });
        if (subscriber) {
            warn(`Subscription attempt with existing email: ${email}`, 'NewsLetter Controller', 'JoinNewsLetter');
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        // Create a new subscriber
        subscriber = new NewsLetter({ email });
        await subscriber.save();

        const options = {
            email: email,
            subject: 'Welcome to our Newsletter',
            message: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Sr tutors</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: auto; border-collapse: collapse;">
                        <tr>
                            <td style="background-color: #007BFF; padding: 20px; text-align: center;">
                                <img src="https://i.ibb.co/Ws8KRrD/image.png" alt="Sr tutors" style="max-width: 200px; height: auto;">
                                <h1 style="color: #ffffff; margin: 20px 0;">Welcome to Sr tutors!</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; background-color: #ffffff;">
                                <p style="font-size: 16px; color: #333333;">
                                    Dear Subscriber,
                                </p>
                                <p style="font-size: 16px; color: #333333;">
                                    Thank you for joining our newsletter. We are thrilled to have you with us. Expect to receive the latest updates, exclusive offers, and insightful articles directly in your inbox. We are committed to delivering valuable content that helps you stay informed and ahead in your field.
                                </p>
                                <p style="font-size: 16px; color: #333333;">
                                    If you have any questions or need assistance, feel free to reach out to us. We are here to help!
                                </p>
                                <p style="font-size: 16px; color: #333333;">
                                    Best regards,<br>
                                    The Sr tutors Team
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #007BFF; padding: 10px; text-align: center;">
                                <p style="font-size: 14px; color: #ffffff; margin: 0;">
                                    © 2024 Sr tutors. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        // Send a welcome email
        await sendEmail(options);
        const redisClient = req.app.locals.redis;
        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllTemplates');
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('subscribers')
        res.status(201).json({ message: 'Subscription successful', subscriber });
    } catch (error) {
        console.log(error)
        // ServerError(`Error occurred while subscribing email: ${error.message}`, 'NewsLetter Controller', 'JoinNewsLetter');
        res.status(500).json({ message: 'Server error', error: error });
    }
};

// Update subscription details
exports.updateSubscription = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    try {
        const subscriber = await NewsLetter.findByIdAndUpdate(id, { email }, { new: true });
        if (!subscriber) {
            warn(`Attempt to update non-existing subscriber: ${id}`, 'NewsLetter Controller', 'updateSubscription');
            return res.status(404).json({ message: 'Subscriber not found' });
        }
        const redisClient = req.app.locals.redis;
        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllTemplates');
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('subscribers')
        res.status(200).json({ message: 'Subscription updated', subscriber });
    } catch (error) {
        ServerError(`Error occurred while updating subscription: ${error.message}`, 'NewsLetter Controller', 'updateSubscription');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
    const { id } = req.params;
    try {
        const subscriber = await NewsLetter.findByIdAndDelete(id);
        if (!subscriber) {
            warn(`Attempt to delete non-existing subscriber: ${id}`, 'NewsLetter Controller', 'deleteSubscription');
            return res.status(404).json({ message: 'Subscriber not found' });
        }
        const redisClient = req.app.locals.redis;
        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllTemplates');
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('subscribers')
        res.status(200).json({ message: 'Subscription deleted' });
    } catch (error) {
        ServerError(`Error occurred while deleting subscription: ${error.message}`, 'NewsLetter Controller', 'deleteSubscription');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all subscriptions

exports.getAllSubscriptions = async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllSubscriptions');
            throw new Error('Redis client is not available.');
        }

        // Check if data is in cache
        const cacheKey = 'subscribers';
        const cachedSubscribers = await redisClient.get(cacheKey);

        if (cachedSubscribers) {
            // Cache hit: return cached data
            res.status(200).json({
                message: 'data from cache',
                data: JSON.parse(cachedSubscribers)
            });
        } else {
            // Cache miss: fetch from database
            const subscribers = await NewsLetter.find();

            // Cache the result
            await redisClient.set(cacheKey, JSON.stringify(subscribers), 'EX', 3600); // Cache expires in 1 hour

            res.status(200).json({
                message: 'data from database',
                data: subscribers
            });
        }
    } catch (error) {
        ServerError(`Error occurred while fetching all subscriptions: ${error.message}`, 'Newsletter Controller', 'getAllSubscriptions');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send emails in batches of 10
exports.sendEmailsInBatches = async (req, res) => {
    try {
        const subscribers = await NewsLetter.find();
        const batchSize = 10;
        const { id } = req.body;

        const FetchTemplate = await NewsLetterTemplate.findById(id);
        if (!FetchTemplate) {
            warn(`Attempt to send emails with non-existing template: ${id}`, 'NewsLetter Controller', 'sendEmailsInBatches');
            return res.status(404).json({ message: 'Template not found' });
        }

        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            const emailPromises = batch.map(subscriber => {
                const options = {
                    email: subscriber.email,
                    subject: FetchTemplate.subject || 'Default Subject',
                    message: FetchTemplate.message || 'Default Message',
                };
                return sendEmail(options).catch(err => {
                    warn(`Failed to send email to ${subscriber.email}: ${err.message}`, 'NewsLetter Controller', 'sendEmailsInBatches');
                    return null;
                });
            });
            await Promise.all(emailPromises);
        }

        res.status(200).json({ message: 'Emails sent in batches' });
    } catch (error) {
        ServerError(`Error occurred while sending emails in batches: ${error.message}`, 'NewsLetter Controller', 'sendEmailsInBatches');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getAllTemplates = async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;
        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllTemplates');
            throw new Error('Redis client is not available.');
        }

        // Define the cache key
        const cacheKey = 'newsletterTemplates';
        // Check if templates are in cache
        const cachedTemplates = await redisClient.get(cacheKey);

        if (cachedTemplates) {
            // Cache hit: return cached data
            res.status(200).json({
                message: 'data from cache',
                data: JSON.parse(cachedTemplates)
            });

        } else {
            // Cache miss: fetch from database
            const templates = await NewsLetterTemplate.find();

            // Cache the result
            await redisClient.set(cacheKey, JSON.stringify(templates), 'EX', 3600); // Cache expires in 1 hour
            res.status(200).json({
                message: 'data from database',
                data: templates
            });

        }
    } catch (error) {
        ServerError(`Error occurred while fetching all templates: ${error.message}`, 'Newsletter Controller', 'getAllTemplates');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.CreateTemplate = async (req, res) => {
    const { subject, message } = req.body;

    try {
        // Create a new template
        const newTemplate = new NewsLetterTemplate({
            subject,
            message
        });

        // Save the template to the database
        await newTemplate.save();
        const redisClient = req.app.locals.redis;
        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllTemplates');
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('newsletterTemplates')
        // Respond with success
        res.status(201).json({
            message: 'Template created successfully',
            template: newTemplate
        });
    } catch (error) {
        ServerError(`Error occurred while creating template: ${error.message}`, 'NewsLetter Controller', 'CreateTemplate');
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

// Edit a template
exports.editTemplate = async (req, res) => {
    const { id } = req.params;
    const { subject, message } = req.body;
    try {
        const template = await NewsLetterTemplate.findByIdAndUpdate(
            id,
            { subject, message },
            { new: true, runValidators: true }
        );
        if (!template) {
            warn(`Attempt to edit non-existing template: ${id}`, 'NewsLetter Controller', 'editTemplate');
            return res.status(404).json({ message: 'Template not found' });
        }
        const redisClient = req.app.locals.redis;
        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllTemplates');
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('newsletterTemplates')
        res.status(200).json({ message: 'Template updated', template });
    } catch (error) {
        ServerError(`Error occurred while editing template: ${error.message}`, 'NewsLetter Controller', 'editTemplate');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a template
exports.deleteTemplate = async (req, res) => {
    const { id } = req.params;
    try {
        const template = await NewsLetterTemplate.findByIdAndDelete(id);
        if (!template) {
            warn(`Attempt to delete non-existing template: ${id}`, 'NewsLetter Controller', 'deleteTemplate');
            return res.status(404).json({ message: 'Template not found' });
        }
        const redisClient = req.app.locals.redis;
        if (!redisClient) {
            warn('Redis client is not available, unable to fetch from cache or invalidate cache', 'Newsletter Controller', 'getAllTemplates');
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('newsletterTemplates')
        res.status(200).json({ message: 'Template deleted' });
    } catch (error) {
        ServerError(`Error occurred while deleting template: ${error.message}`, 'NewsLetter Controller', 'deleteTemplate');
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
