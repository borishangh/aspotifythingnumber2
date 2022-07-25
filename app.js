
const client_id = '42593dff4d824153a7b126a21146e968';
const client_secret = '7ee1da0f7ff5433d9456d9a026578639';
const redirect_uri = 'https://borishangh.github.io/aspotifythingnumber2/';

const AUTHOURIZE = 'https://accounts.spotify.com/authorize?';
const TOKEN = 'https://accounts.spotify.com/api/token?';

const RECENT = 'https://api.spotify.com/v1/me/player/recently-played';
const PBSTATE = 'https://api.spotify.com/v1/me/player';
const PLAYLISTS = 'https://api.spotify.com/v1/me/playlists';
const USER = 'https://api.spotify.com/v1/me';
const ID = 'https://api.spotify.com/v1';
const SAVED = 'https://api.spotify.com/v1/me/tracks/contains';


function onload_events() {
	get_res();
	if (window.location.search.length > 0) {
		handle_redirect();
	}
}

function request_auth() {
	console.log('auth');

	let scope = 'user-read-private user-top-read user-read-playback-state user-top-read user-library-read user-read-recently-played';

	let url = AUTHOURIZE
		+ 'client_id=' + client_id
		+ '&response_type=code'
		+ '&redirect_uri=' + encodeURI(redirect_uri)
		// + '&show_dialog=true'
		+ '&scope=' + scope;


	window.location.href = url;
}

function handle_redirect() {
	console.log('redirect');

	let code = get_code();
	fetch_token(code);
	window.history.pushState("", "", redirect_uri);

}

function get_code() {
	const query_string = window.location.search;

	if (query_string.length == 0)
		return null;

	const url_params = new URLSearchParams(query_string);
	let code = url_params.get('code');
	return code;
}

function fetch_token(code) {

	let url = TOKEN
		+ 'grant_type=authorization_code'
		+ '&code=' + code
		+ '&redirect_uri=' + encodeURI(redirect_uri);

	fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
		.then(response => response.json())
		.then(data => {
			show_recent(data.access_token);
		});
}


async function call_api(url, access_token) {
	return fetch(url, {
		headers: {
			'Authorization': "Bearer " + access_token,
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
	})
		.then(response => response.json())
		.then(data => {
			return data;
		});
}

function show_recent(access_token) {
	let url = RECENT + '?limit=50';

	call_api(url, access_token)
		.then(data => {
			for (i in data.items) {
				let artists = data.items[i].track.artists

				let n = parseInt(i) + 1;
				let src = data.items[i].track.album.images[1].url;

				let name = data.items[i].track.name;
				let node = document.querySelector('.box');

				add_item(n, src, name, artists, node)
			}
		})

}

const cant_do_this_shit_anymore = (x) => {
	let poly = -3.1 * Math.log(x - 1.7) + 0.12 * x + 7.5;
	return poly;
}

function add_item(n, src, name, artists, node) {

	let units = 7;

	if(window.innerWidth<600)
		units = 4;

	let WIDTH = document.querySelector('.main').clientWidth;
	let padd = cant_do_this_shit_anymore(units);
	console.log(WIDTH)

	let card = document.createElement('div');
	let item = document.createElement('div');
	let itemname = document.createElement('div');
	let itemartists = document.createElement('div');
	let img = document.createElement('img');

	let artist_str = artists.map(x => x.name).join(', ');

	card.className = 'card';
	item.className = 'item';
	itemname.className = 'itemname';
	itemartists.className = 'itemartists';

	card.innerHTML = n;
	itemname.innerHTML = truncate(name, 30);
	itemartists.innerHTML = truncate(artist_str, 40);

	img.src = src;
	img.style.width = `${(WIDTH - (4 * units)) / units - padd}px`
	item.style.width = `${(WIDTH - (4 * units)) / units - padd}px`

	item.appendChild(card);
	item.appendChild(img);
	item.appendChild(itemname);
	item.appendChild(itemartists);
	node.appendChild(item);
}


function get_res() {
	var ratio = window.devicePixelRatio || 1;
	var w = screen.width * ratio;
	var h = screen.height * ratio;

	console.log(w + ' ' + h)
}

const truncate = (str, n) => {
	return (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str;
};
