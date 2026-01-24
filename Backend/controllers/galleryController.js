// Controller to upload gallery image
// Image file comes from multer
// Save image URL and title to MongoDB
// Return success response
const Gallery = require('../models/Gallery');
const GrillFabrication = require('../models/GrillFabrication');
const GateFabrication = require('../models/GateFabrication');
const ShedFabrication = require('../models/ShedFabrication');
const RailingAndStaircase = require('../models/RailingAndStaircase');
const CustomFabrication = require('../models/CustomFabrication');
const BuildingWork = require('../models/BuildingWork');

const serviceModelMap = {
    'grill fabrication': GrillFabrication,
    'gate fabrication': GateFabrication,
    'shed fabrication': ShedFabrication,
    'railing & staircase': RailingAndStaircase,
    'custom fabrication': CustomFabrication,
    'building work': BuildingWork,
};

exports.uploadGalleryImage = async (req, res) => {
    try {
        const { title, description, service, optionsMarkdown, order } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Cloudinary storage provides an https URL in file.path
        // Local disk storage provides a filesystem path + filename
        let imageUrl = req.file.path;
        if (!/^https?:\/\//i.test(imageUrl)) {
            // Build a public URL for locally stored files
            const filename = req.file.filename;
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
        }

        // Choose model based on service value (case-insensitive)
        const svcKey = String(service || '').trim().toLowerCase();
        const Model = serviceModelMap[svcKey] || Gallery;

        const newGalleryImage = new Model({
            title,
            imageUrl,
            description,
            service: service || '',
            optionsMarkdown: optionsMarkdown || '',
            order: (order !== undefined && order !== null && order !== '') ? Number(order) : null
        });

        await newGalleryImage.save();

        res.status(201).json({ message: 'Gallery image uploaded successfully', galleryImage: newGalleryImage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload gallery image', error: error.message });
    }
};

// Controller to fetch all gallery images
// Sort by createdAt descending (latest first)
exports.getGalleryImages = async (req, res) => {
    try {
        // Aggregate images from all collections
        const collections = [
          GrillFabrication,
          GateFabrication,
          ShedFabrication,
          RailingAndStaircase,
          CustomFabrication,
          BuildingWork,
          Gallery,
        ];
        const results = await Promise.all(collections.map((M) => M.find()));
        const items = results.flat();
        // Normalize to have public URL and sort by createdAt desc
        const galleryImages = items.map((doc) => {
            const obj = doc.toObject();
            let url = obj.imageUrl || '';
            if (!/^https?:\/\//i.test(url)) {
                // Convert previously saved absolute/local paths to public URL
                const match = String(url).match(/uploads[\\/](.+)$/i);
                const filename = match ? match[1].replace(/\\/g, '/') : '';
                if (filename) {
                    url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
                }
            }
            return { ...obj, imageUrl: url };
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.status(200).json({ galleryImages });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch gallery images', error: error.message });
    }
};

// Fetch items from a specific collection by key
// GET /api/gallery/service/:key
exports.getServiceGallery = async (req, res) => {
    try {
        const key = String(req.params.key || '').trim().toLowerCase();
        const keyToModel = {
            'grill-fabrication': GrillFabrication,
            'gate-fabrication': GateFabrication,
            'shed-fabrication': ShedFabrication,
            'railing': RailingAndStaircase,
            'custom-fabrication': CustomFabrication,
            'building-work': BuildingWork,
        };
        const Model = keyToModel[key];
        if (!Model) {
            return res.status(400).json({ message: 'Unknown service key' });
        }

        const items = await Model.find();
        const normalized = items.map((doc) => {
            const obj = doc.toObject();
            let url = obj.imageUrl || '';
            if (!/^https?:\/\//i.test(url)) {
                const match = String(url).match(/uploads[\\/](.+)$/i);
                const filename = match ? match[1].replace(/\\/g, '/') : '';
                if (filename) {
                    url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
                }
            }
            return { ...obj, imageUrl: url };
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.status(200).json({ galleryImages: normalized });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch service gallery', error: error.message });
    }
};

// Controller to delete a gallery image (admin-only)
exports.deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const collections = [
          GrillFabrication,
          GateFabrication,
          ShedFabrication,
          RailingAndStaircase,
          CustomFabrication,
          BuildingWork,
          Gallery,
        ];
        let deletedDoc = null;
        for (const M of collections) {
          deletedDoc = await M.findByIdAndDelete(id);
          if (deletedDoc) break;
        }
        if (!deletedDoc) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }
        res.status(200).json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete gallery image', error: error.message });
    }
};
