async function fetchPage({
	pageToken = '',
	part = 'snippet',
	maxResults = 50, // max possible
	playlistId = process.env.PLAYLIST_ID,
	key = process.env.YT_API_KEY,
} = {}) {
	const requestUrl = new URL('https://youtube.googleapis.com/youtube/v3/playlistItems');
	requestUrl.searchParams.set('playlistId', playlistId);
	requestUrl.searchParams.set('maxResults', maxResults);
	requestUrl.searchParams.set('part', part);
	requestUrl.searchParams.set('key', key);

	if ( pageToken ) {
		requestUrl.searchParams.set('pageToken', pageToken);
	}

	return fetch(requestUrl);
}

async function fetchAllPages() {
	const collection = [];
	let pageToken;
	
	do {
		const res = await fetchPage({pageToken});
		const {items, nextPageToken} = await res.json();
		collection.push(...items);
		pageToken = nextPageToken
	} while ( pageToken );
	
	return collection;
}

try {
	const collection = await fetchAllPages();
	process.stdout.write(JSON.stringify(collection, null, 4));
} catch (e) {
	console.error(e);
	process.exit(1);
}