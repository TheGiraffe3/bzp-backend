import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const login = async (req, res) => {
	try {
		const authData = await pb.collection('_superusers').authWithPassword(
			req.query.email,
			req.query.password,
		);
		res.status(200).json({ token: authData.token });
	} catch (error) {
		res.status(500).json({ message: 'Failed to log in: ', error: error.message });
	}
};

export const logout = async (req, res) => {
	pb.authStore.clear();
	res.json({ message: 'Logged out!' });
};
