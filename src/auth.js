const auth = (function () {
	// Authentication and channels - required
	const channel = "nagen_tm"; // your channel
	const username = "nagen_tm"; // bot account or your channel

	// You may or may not include the "oauth:" portion of your token
	const oauth = process.env.TWITCH_AUTH;

	return {
		channel,
		username,
		oauth,
	};
})();
