import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const addPlugin = async (req, res) => {
	try {
		if (!req.file && !req.body.downloadLink) {
			return res.status(400).json({ message: 'You must either upload a file or provide a direct download link.' })
		}

		let downloadLink = '';
		let providedDownloadLink = false;
		if (req.body.downloadLink && req.body.downloadLink !== '(none)') {
			try {
				new URL(req.body.downloadLink);
			} catch {
				return res.status(400).json({ message: 'Please provide a valid download link.' })
			}

			downloadLink = req.body.downloadLink;
			providedDownloadLink = true;
		}
		const formData = new FormData();

		const c = req.body.category;
		if (c !== "flags" && c !== "game-mode" && c !== "zones" && c !== "administration" && c !== "server"
			&& c !== "chat" && c !== "game-mode-mechanics" && c !== "commands" && c !== "mechanics"
			&& c !== "samples" && c !== "flag-mechanics" && c !== "out-of-date")
		{
				return res.status(400).json({ message: 'Invalid or missing category.' });
		}

		formData.append("name", req.body.name || "Unknown");
		formData.append("author", req.body.author || "Unknown");
		formData.append("license", req.body.license || "All Rights Reserved");
		formData.append("description", req.body.description || "Unknown");
		formData.append("category", req.body.category);
		formData.append("bzfs_version", req.body.bzfsVersion || "2.4.0");
		formData.append("website", req.body.website);
		formData.append("direct_download_link", downloadLink);
		if (req.file) {
 			const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
			formData.append('source_code', blob, req.file.originalname);
		}
		formData.append("approved", false);
		const plugin = await pb.collection('plugins').create(formData);

		if (providedDownloadLink == false) {
			const pluginID = plugin.id;

			// If you're running your own copy of BZP, change this URL.
			const URL = "https://bzp.sandybees.com/plugin/download?id=" + pluginID;

			await pb.collection('plugins').update(pluginID, {
				direct_download_link: URL,
			});
		}

		return res.status(201).json({ message: 'Plugin created successfully!' });
	} catch (error) {
		console.log('Failed to create plugin: ', error.message);
		return res.status(500).json({ message: 'Failed to create plugin: ', error: error.message });
	}
};

export const getPlugin = async (req, res) => {
	try {
		const record = await pb.collection('plugins').getOne(req.query.id, {
			fields: 'name,author,license,description,category,website,direct_download_link,bzfs_version,approved',
		});

		res.json(record);
	} catch (error) {
		res.status(500).json({ message: 'Failed to get plugin: ', error: error.message });
	}
};

export const getPluginDownload = async (req, res) => {
	try {
		const record = await pb.collection('plugins').getOne(req.query.id);

		if (!record.source_code || record.source_code.length === 0) {
			return res.status(404).json({ message: 'There is no downloadable file for this plugin!' });
		}

		const filename = record.source_code;
		const url = pb.files.getURL(record, filename, {'download': '1'});
		const response = await fetch(url);
		const fileBuffer = Buffer.from(await response.arrayBuffer());

		res.setHeader('Content-Type', 'application/zip');
		res.attachment(filename);
		res.send(fileBuffer);
	} catch (error) {
		res.status(500).json({ message: 'Failed to get plugin: ', error: error.message });
	}
};

export const listPlugins = async (req, res) => {
	try {
		const resultList = await pb.collection('plugins').getFullList({
			fields: 'id,name,author,description,category,approved',
			sort: 'name',
		});

		res.json(resultList);
	} catch (error) {
		res.status(500).json({ message: 'Failed to view plugin list: ', error: error.message });
	}
};

export const togglePluginStatus = async (req, res) => {
	try {
		const recordOrig = await pb.collection('plugins').getOne(req.query.id, {
			fields: 'approved',
		});

		const body = {
			"approved": !recordOrig.approved
		}

		await pb.collection('plugins').update(req.query.id, body, {
			headers: {
				'Authorization': req.headers.token
			}
		});

		res.status(200).json({ message: 'Toggle succeeded!' });
	} catch (error) {
		res.status(403).json({ message: 'Failed to toggle plugin status. This is likely because you do not have superuser permission, but the error message is included just in case: ', error: error.message });
	}
};

export const removePlugin = async (req, res) => {
	try {
		await pb.collection('plugins').delete(req.query.id, {
			headers: {
				'Authorization': req.headers.token
			}
		});

		res.status(200).json({ message: 'Removed plugin.' });
	} catch (error) {
		res.status(403).json({ message: 'Failed to remove plugin. This is likely because you do not have superuser permission, but the error message is included just in case: ', error: error.message });
	}
};
