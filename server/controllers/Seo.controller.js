const SeoPagesModel = require("../models/Seo.Pages.model");
const sanitizeHtml = require('sanitize-html');
exports.createPage = async (req, res) => {
    try {
        const { MetaTitle, seoFrendilyUrl, MetaDescription, MetaKeywords, PageTitle, Heading, Tag, PageContent } = req.body;

        if (!MetaTitle || MetaTitle.trim() === '') {
            return res.status(400).json({ message: 'MetaTitle is required' });
        }

        if (!seoFrendilyUrl || seoFrendilyUrl.trim() === '') {
            return res.status(400).json({ message: 'seoFrendilyUrl is required' });
        }



        if (!MetaDescription || MetaDescription.trim() === '') {
            return res.status(400).json({ message: 'MetaDescription is required' });
        }

        if (MetaDescription.length > 160) {
            return res.status(400).json({ message: 'MetaDescription should not exceed 160 characters' });
        }

        if (!MetaKeywords || MetaKeywords.length === 0) {
            return res.status(400).json({ message: 'MetaKeywords are required' });
        }

        if (!Array.isArray(MetaKeywords) || MetaKeywords.some(keyword => typeof keyword !== 'string')) {
            return res.status(400).json({ message: 'MetaKeywords should be an array of strings' });
        }

        if (!PageTitle || PageTitle.trim() === '') {
            return res.status(400).json({ message: 'PageTitle is required' });
        }

        if (!Heading || Heading.trim() === '') {
            return res.status(400).json({ message: 'Heading is required' });
        }

        if (!Tag || Tag.trim() === '') {
            return res.status(400).json({ message: 'Tag is required' });
        }

        if (!PageContent || PageContent.trim() === '') {
            return res.status(400).json({ message: 'PageContent is required' });
        }


        const newSeoPage = new SeoPagesModel({
            MetaTitle,
            seoFrendilyUrl,
            MetaDescription,
            MetaKeywords,
            PageTitle,
            Heading,
            Tag,
            PageContent,
        });

        // Save the new SEO page to the database
        const savedSeoPage = await newSeoPage.save();

        // Respond with the newly created SEO page data
        res.status(201).json({
            message: 'SEO page created successfully',
            seoPage: savedSeoPage,
        });

    } catch (error) {
        console.error('Error creating SEO page:', error);
        res.status(500).json({ message: 'An error occurred while creating the SEO page' });
    }
};

exports.getAllPages = async (req, res) => {
    try {
        const pages = await SeoPagesModel.find().sort({ createdAt: -1 });
        res.status(200).json(pages);
    } catch (error) {
        console.error('Error fetching all pages:', error);
        res.status(500).json({ message: 'An error occurred while fetching pages' });
    }
}

exports.getPageBySeoUrl = async (req, res) => {
    try {
        const { seoFrendilyUrl } = req.params;
        const page = await SeoPagesModel.findOne({ seoFrendilyUrl });

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.status(200).json(page);
    } catch (error) {
        console.error('Error fetching the page:', error);
        res.status(500).json({ message: 'An error occurred while fetching the page' });
    }
};

exports.deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await SeoPagesModel.findByIdAndDelete(id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.status(200).json({ message: 'Page deleted successfully' });
    } catch (error) {
        console.error('Error deleting the page:', error);
        res.status(500).json({ message: 'An error occurred while deleting the page' });
    }
};

exports.updatePage = async (req, res) => {
    console.log("UpdatePage endpoint hit");

    try {
        const { id } = req.params;
        console.log(id)
        const { MetaTitle, seoFrendilyUrl, MetaDescription, MetaKeywords, PageTitle, Heading, Tag, PageContent } = req.body;

        // Validate `id` and request body
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Page ID is required in the request parameters.",
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is empty. Please provide fields to update.",
            });
        }

        // Fetch page by ID
        const page = await SeoPagesModel.findById(id);
        if (!page) {
            return res.status(404).json({
                success: false,
                message: `Page with ID ${id} not found.`,
            });
        }

        // Conditionally update fields that are provided and have changed
        if (MetaTitle && MetaTitle !== page.MetaTitle) {
            page.MetaTitle = MetaTitle;
        }
        if (MetaDescription && MetaDescription !== page.MetaDescription) {
            page.MetaDescription = MetaDescription;
        }
        if (MetaKeywords && JSON.stringify(MetaKeywords) !== JSON.stringify(page.MetaKeywords)) {
            page.MetaKeywords = MetaKeywords;
        }
        if (PageTitle && PageTitle !== page.PageTitle) {
            page.PageTitle = PageTitle;
        }
        if (Heading && Heading !== page.Heading) {
            page.Heading = Heading;
        }   
        if (Tag && Tag !== page.Tag) {
            page.Tag = Tag;
        }
        if (PageContent && PageContent !== page.PageContent) {
            page.PageContent = PageContent.toString();
        }

        // Save the updated page
        await page.save();

        return res.status(200).json({
            success: true,
            message: "Page updated successfully",
            data: page,
        });
    } catch (error) {
        console.error("Error updating page:", error);

        // Differentiating between common error types
        if (error.name === "CastError" && error.kind === "ObjectId") {
            return res.status(400).json({
                success: false,
                message: `Invalid page ID format: ${req.params.id}`,
                error: error.message,
            });
        }

        // Handle unexpected errors
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while updating the page.",
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
};


exports.IAmUpdateFunction = async (req, res) => {
    try {
        res.status(200).json({
            message: "I am a dummy function for updating SEO page",
            success: true
        })
    } catch (error) {
        res.status(200).json({
            message: error?.message,
            success: true
        })
    }
}