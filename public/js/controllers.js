'use strict';

/* Controllers */

angular.module('spotlistr.controllers', [])
	.controller('Splash', ['$scope', '$routeParams', 'UserFactory', function($scope, $routeParams, UserFactory) {
		if ($routeParams.access_token && $routeParams.refresh_token) {
			// Save the access token into local storage
			UserFactory.setAccessToken($routeParams.access_token);
			// Save the refresh token into local storage
			UserFactory.setRefreshToken($routeParams.refresh_token);
			UserFactory.getSpotifyUserInfo();
		}
		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});

	}])
	.controller('Textbox', ['$scope', '$routeParams', 'UserFactory', 'SpotifySearchFactory', 'SpotifyPlaylistFactory', 'QueryFactory', function($scope, $routeParams, UserFactory, SpotifySearchFactory, SpotifyPlaylistFactory, QueryFactory) {
		if ($routeParams.access_token && $routeParams.refresh_token) {
			// Save the access token into local storage
			UserFactory.setAccessToken($routeParams.access_token);
			// Save the refresh token into local storage
			UserFactory.setRefreshToken($routeParams.refresh_token);
			UserFactory.getSpotifyUserInfo();
		}
		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});
		// The data in the text area
		$scope.taData = '';
		// The name of the playlist
		$scope.playlistName = '';
		// Boolean for if the playlist will be public or nah
		$scope.publicPlaylist = true;
		// Messages to the user
		$scope.messages = [];
		// Bool flag for if search is running
		$scope.searching = false;
		// The tracks
		$scope.trackArr = [];

		$scope.performSearch = function() {
			$scope.searching = true;
			clearResults();
			var rawInputByLine = $scope.taData.split('\n');
			for (var i = 0; i < rawInputByLine.length; i += 1) {
				$scope.trackArr.push(new Track(rawInputByLine[i]));
			}
			QueryFactory.performSearch($scope.trackArr);
			$scope.searching = false;
		};

		$scope.createDisplayName = QueryFactory.createDisplayName;

		var clearResults = function() {
			$scope.matches = [];
			$scope.toBeReviewed = [];
			$scope.selectedReviewedTracks = {};
			$scope.noMatches = [];
			$scope.messages = [];
		};

		$scope.assignSelectedTrack = function(track, index) {
			QueryFactory.assignSelectedTrack(track, index);
		};

		$scope.createPlaylist = function(name, isPublic) {
			SpotifyPlaylistFactory.createPlaylist(name, isPublic, $scope.matches, $scope.selectedReviewedTracks, $scope.messages);
		};

	}])
	.controller('Subreddit', ['$scope', 'UserFactory', 'SpotifySearchFactory', 'SpotifyPlaylistFactory', 'RedditFactory', 'QueryFactory', function($scope, UserFactory, SpotifySearchFactory, SpotifyPlaylistFactory, RedditFactory, QueryFactory) {
		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});

		$scope.subredditSortBy = [
			{name: 'hot', id: 'hot'},
			{name: 'top - hour', id: 'top', sort: 't=hour'},
			{name: 'top - day', id: 'top', sort: 't=day'},
			{name: 'top - week', id: 'top', sort: 't=week'},
			{name: 'top - month', id: 'top', sort: 't=month'},
			{name: 'top - year', id: 'top', sort: 't=year'},
			{name: 'top - all', id: 'top', sort: 't=all'},
			{name: 'new', id: 'new'}
		];
		$scope.selectedSortBy = $scope.subredditSortBy[0];
		$scope.subredditInput = '';

		// The tracks that matched 100%
		$scope.matches = [];
		// The track that need review
		$scope.toBeReviewed = [];
		// The tracks with no matches
		$scope.noMatches = [];
		// The selected indexes of the review tracks
		$scope.selectedReviewedTracks = {};
		// The name of the playlist
		$scope.playlistName = '';
		// Boolean for if the playlist will be public or nah
		$scope.publicPlaylist = true;
		// Messages to the user
		$scope.messages = [];
		// Bool flag for if search is running
		$scope.searching = false;
		// How many results to fetch from Reddit (multiples of 25)
		$scope.fetchAmounts = [25, 50, 75, 100];
		// The selected fetch amount
		$scope.selectedFetchAmounts = $scope.fetchAmounts[0];
		// A list of popular music Subreddits
		$scope.popularSubreddits = [
			'Or Select a Popular Subreddit!',
			'50sMusic',
			'60sMusic',
			'70sMusic',
			'80sMusic',
			'90sAlternative',
			'90sHipHop',
			'90sMusic',
			'90sPunk',
			'2000sMusic',
			'2010sMusic',
			'Acapella',
			'AcidHouse',
			'AcousticOriginals',
			'AltCountry',
			'AlternativeRock',
			'AltRap',
			'Ambient',
			'AmbientMusic',
			'AsianRap',
			'AStateOfTrance',
			'AtmosphericDnB',
			'BigRoom',
			'BlackMetal',
			'Bluegrass',
			'Blues',
			'BluesRock',
			'Boneyard',
			'BoogieMusic',
			'Breakbeat',
			'Breakcore',
			'Brostep',
			'CanadianMusic',
			'ChillMusic',
			'Chillout',
			'ChillStep',
			'Chillwave',
			'Chiptunes',
			'ChoralMusic',
			'Christcore',
			'ChristianMusic',
			'CircleMusic',
			'ClassicalMusic',
			'ClassicMetal',
			'ClassicRock',
			'Complextro',
			'Country',
			'CoverSongs',
			'CPop',
			'CrateDigging',
			'Crustpunk',
			'Cyberpunk_Music',
			'DanceParty',
			'Deathcore',
			'DeathMetal',
			'Deathstep',
			'DeepHouse',
			'Disco',
			'Djent',
			'DnB',
			'DoomMetal',
			'Dub',
			'Dubstep',
			'Early2000sjams',
			'EDM',
			'Electro',
			'ElectroHouse',
			'Electronica',
			'ElectronicMagic',
			'ElectronicMusic',
			'ElectroPop',
			'ElectroSwing',
			'ElitistClassical',
			'EmoScreamo',
			'EpicMetal',
			'EsoteroFunk',
			'Folk',
			'FolkMetal',
			'FolkPunk',
			'FrenchHouse',
			'Funk',
			'FutureBeats',
			'FutureFunkAirlines',
			'FutureGarage',
			'FuturePopMusic',
			'FutureSynth',
			'Gabber',
			'GameMusic',
			'GaragePunk',
			'GayMusic',
			'GermanRap',
			'Germusic',
			'Glitch',
			'Glitchhop',
			'Grime',
			'Grindcore',
			'Grunge',
			'HappyHardcore',
			'Hardcore',
			'HardRock',
			'Hardstyle',
			'HeadBangToThis',
			'HipHop',
			'HipHopHeads',
			'House',
			'IDM',
			'Indie',
			'IndieWok',
			'Indie_Rock',
			'IndustrialMusic',
			'JamBands',
			'Jazz',
			'JPop',
			'Juke',
			'Jungle',
			'KPop',
			'LiftingMusic',
			'LiquidAndChillstep',
			'LiquidDnB',
			'LiquidDubstep',
			'ListenToThis',
			'ListenToUs',
			'LoFi',
			'MathRock',
			'MelodicDeathMetal',
			'MelodicHardcore',
			'Metal',
			'Minimal',
			'MonsterFuzz',
			'Moombahcore',
			'Moombahton',
			'Music',
			'MusicForConcentration',
			'NeuroFunk',
			'NewGrass',
			'NoiseMusic',
			'NoiseRock',
			'NOLAMusic',
			'NuDisco',
			'ObscureMusic',
			'OldieMusic',
			'Opera',
			'Orchestra',
			'OutlawCountry',
			'Outrun',
			'PartyMusic',
			'PartyMusicStation',
			'PopPunkers',
			'PostHardcore',
			'PostMetal',
			'PostRock',
			'PowerMetal',
			'ProgHouse',
			'ProgMetal',
			'ProgRockMusic',
			'Psybient',
			'PsychadelicRock',
			'PsyTrance',
			'Punk',
			'PunkSkaHardcore',
			'Punk_Rock',
			'RaggaJungle',
			'Rap',
			'RealDubstep',
			'RealProgHouse',
			'RepublicOfMusic',
			'SampleBliss',
			'ShallowHouse',
			'Shoegaze',
			'Ska',
			'Sludge',
			'SoundsVintage',
			'Soundtracks',
			'StonerRock',
			'SwingHouse',
			'SymphonicMetal',
			'Synthwave',
			'TechnicalDeathMetal',
			'Techno',
			'Tech_House',
			'ThisIsOurMusic',
			'Trance',
			'Trap',
			'TrapMuzik',
			'TreeMusic',
			'TripHop',
			'TripTrap',
			'TrueBlackMetal',
			'TrueMusic',
			'Under10k',
			'VintageObscura',
			'WitchHouse',
			'WorldMusic',
		];
		$scope.selectedPopularSubreddits = $scope.popularSubreddits[0];

		$scope.searchType = 'Subreddit';
		$scope.createDisplayName = QueryFactory.createDisplayName;

		$scope.performSearch = function() {
			$scope.searching = true;
			clearResults();
			RedditFactory.getSubreddit($scope.subredditInput, $scope.selectedSortBy.id, $scope.selectedSortBy.sort, $scope.selectedFetchAmounts, function(response) {
				var listings = response.data.children,
					trackTitles = [];

				// 1. Take the title of each listing returned from Reddit
				for (var i = 0; i < listings.length; i += 1) {
					// 1.1. Filter out anything with a self-post
					//      Self posts have a "domain" of self.subreddit
					if (listings[i].data.domain !== 'self.' + $scope.subredditInput) {
						trackTitles.push(listings[i].data.title);
					}
				}

				// 2. Search Spotify
				var inputByLine = QueryFactory.normalizeSearchArray(trackTitles);
				QueryFactory.performSearch(inputByLine, $scope.matches, $scope.toBeReviewed, $scope.selectedReviewedTracks, $scope.noMatches);
				$scope.searching = false;
			});
		};

		$scope.assignSelectedTrack = function(trackUrl, trackId) {
			QueryFactory.assignSelectedTrack(trackUrl, trackId, $scope.selectedReviewedTracks);
		};

		$scope.popularSubredditOnChange = function() {
			if ($scope.selectedPopularSubreddits === $scope.popularSubreddits[0]) {
				$scope.subredditInput = '';
			} else {
				$scope.subredditInput = $scope.selectedPopularSubreddits;
			}
		}

		var clearResults = function() {
			$scope.matches = [];
			$scope.toBeReviewed = [];
			$scope.selectedReviewedTracks = {};
			$scope.noMatches = [];
			$scope.messages = [];
		};

		$scope.createPlaylist = function(name, isPublic) {
			SpotifyPlaylistFactory.createPlaylist(name, isPublic, $scope.matches, $scope.selectedReviewedTracks, $scope.messages);
		};

	}])
	.controller('LastfmSimilar', ['$scope', 'UserFactory', 'SpotifySearchFactory', 'SpotifyPlaylistFactory', 'QueryFactory', 'LastfmFactory', function($scope, UserFactory, SpotifySearchFactory, SpotifyPlaylistFactory, QueryFactory, LastfmFactory) {

		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});
		// The tracks that matched 100%
		$scope.matches = [];
		// The track that need review
		$scope.toBeReviewed = [];
		// The tracks with no matches
		$scope.noMatches = [];
		// The data in the text area
		$scope.taData = '';
		// The selected indexes of the review tracks
		$scope.selectedReviewedTracks = {};
		// The name of the playlist
		$scope.playlistName = '';
		// Boolean for if the playlist will be public or nah
		$scope.publicPlaylist = true;
		// Messages to the user
		$scope.messages = [];
		// Bool flag for if search is running
		$scope.searching = false;
		// Amount of similar tracks per track
		$scope.similarCount = 10;
		$scope.searchType = 'Last.fm Similar Tracks';

		$scope.performSearch = function() {
			$scope.searching = true;
			clearResults();
			var inputByLine = $scope.taData.split('\n'),
				splitTrack = [];

			LastfmFactory.getSimilarTracksAndExtractInfo(inputByLine, $scope.similarCount, function(lastfmSimilarTracks) {
				var similar = [];
				for (var i = 0; i < lastfmSimilarTracks.length; i++) {
					if (lastfmSimilarTracks[i].similartracks.track instanceof Array) {
						var found = LastfmFactory.extractInfoFromLastfmResults(lastfmSimilarTracks[i].similartracks);
						for (var j = 0; j < found.length; j++) {
							similar.push(found[j]);
						}
					}
				}
				QueryFactory.performSearch(similar, $scope.matches, $scope.toBeReviewed, $scope.selectedReviewedTracks, $scope.noMatches);
				$scope.searching = false;
			});
		};

		$scope.createDisplayName = QueryFactory.createDisplayName;

		var clearResults = function() {
			$scope.matches = [];
			$scope.toBeReviewed = [];
			$scope.selectedReviewedTracks = {};
			$scope.noMatches = [];
			$scope.messages = [];
		};

		$scope.assignSelectedTrack = function(trackUrl, trackId) {
			QueryFactory.assignSelectedTrack(trackUrl, trackId, $scope.selectedReviewedTracks);
		};

		$scope.createPlaylist = function(name, isPublic) {
			SpotifyPlaylistFactory.createPlaylist(name, isPublic, $scope.matches, $scope.selectedReviewedTracks, $scope.messages);
		};

	}])
.controller('LastfmToptracksSimilar', ['$scope', 'UserFactory', 'SpotifySearchFactory', 'SpotifyPlaylistFactory', 'QueryFactory', 'LastfmFactory', function($scope, UserFactory, SpotifySearchFactory, SpotifyPlaylistFactory, QueryFactory, LastfmFactory) {

		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});
		// The tracks that matched 100%
		$scope.matches = [];
		// The track that need review
		$scope.toBeReviewed = [];
		// The tracks with no matches
		$scope.noMatches = [];
		// The data in the text area
		$scope.taData = '';
		// The selected indexes of the review tracks
		$scope.selectedReviewedTracks = {};
		// The name of the playlist
		$scope.playlistName = '';
		// Boolean for if the playlist will be public or nah
		$scope.publicPlaylist = true;
		// Messages to the user
		$scope.messages = [];
		// Bool flag for if search is running
		$scope.searching = false;
		// Amount of similar tracks per track
		$scope.similarCount = 10;
		// Inputted Last.fm username
		$scope.lastfmUsername = '';
		// Sort by options
		$scope.lastfmPeriodOptions = [
			{name: '7 Days', id: '7day'},
			//{name: '1 Month', id: '1month'},
			{name: '3 Months', id: '3month'},
			{name: '6 Months', id: '6month'},
			{name: '12 Months', id: '12month'},
			{name: 'Overall', id: 'overall'},
		];
		$scope.searchType = 'Last.fm Top Tracks Similar';
		// Selected sort option
		$scope.selectedLastfmPeriodOption = $scope.lastfmPeriodOptions[0];

		$scope.performSearch = function() {
			$scope.searching = true;
			clearResults();
			var inputByLine = $scope.taData.split('\n'),
				splitTrack = [];

			// 1. Grab the tracks from the Last.fm user's profile
			LastfmFactory.getUserTopTracks($scope.lastfmUsername, $scope.selectedLastfmPeriodOption.id, function(response) {
				// 2. Extract the Artist - Track Title from the results
				var topTracks = LastfmFactory.extractInfoFromLastfmResults(response.toptracks);
				// 3. For each Top Track, find similar tracks and produce results
				LastfmFactory.getSimilarTracksAndExtractInfo(topTracks, $scope.similarCount, function(lastfmSimilarTracks) {
					QueryFactory.performSearch(topTracks, $scope.matches, $scope.toBeReviewed, $scope.selectedReviewedTracks, $scope.noMatches);
					$scope.searching = false;
				});
			});
		};

		$scope.createDisplayName = QueryFactory.createDisplayName;

		var clearResults = function() {
			$scope.matches = [];
			$scope.toBeReviewed = [];
			$scope.selectedReviewedTracks = {};
			$scope.noMatches = [];
			$scope.messages = [];
		};

		$scope.assignSelectedTrack = function(trackUrl, trackId) {
			QueryFactory.assignSelectedTrack(trackUrl, trackId, $scope.selectedReviewedTracks);
		};

		$scope.createPlaylist = function(name, isPublic) {
			SpotifyPlaylistFactory.createPlaylist(name, isPublic, $scope.matches, $scope.selectedReviewedTracks, $scope.messages);
		};

	}])
	.controller('YouTube', ['$scope', '$routeParams', 'UserFactory', 'SpotifySearchFactory', 'SpotifyPlaylistFactory', 'QueryFactory', 'YouTubeFactory', function($scope, $routeParams, UserFactory, SpotifySearchFactory, SpotifyPlaylistFactory, QueryFactory, YouTubeFactory) {
		if ($routeParams.access_token && $routeParams.refresh_token) {
			// Save the access token into local storage
			UserFactory.setAccessToken($routeParams.access_token);
			// Save the refresh token into local storage
			UserFactory.setRefreshToken($routeParams.refresh_token);
			UserFactory.getSpotifyUserInfo();
		}
		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});
		// The tracks that matched 100%
		$scope.matches = [];
		// The track that need review
		$scope.toBeReviewed = [];
		// The tracks with no matches
		$scope.noMatches = [];
		// The selected indexes of the review tracks
		$scope.selectedReviewedTracks = {};
		// The name of the playlist
		$scope.playlistName = '';
		// Boolean for if the playlist will be public or nah
		$scope.publicPlaylist = true;
		// Messages to the user
		$scope.messages = [];
		// Bool flag for if search is running
		$scope.searching = false;

		$scope.playlistId = '';

		$scope.searchType = 'YouTube';

		$scope.performSearch = function() {
			$scope.searching = true;
			clearResults();
			YouTubeFactory.getPlaylist(getPlaylistIdFromUrl(), function(items) {
				var titles = [];

				for (var i = 0; i < items.length; i += 1) {
					titles.push(QueryFactory.normalizeSearchQuery(items[i].snippet.title));
				}
				QueryFactory.performSearch(titles, $scope.matches, $scope.toBeReviewed, $scope.selectedReviewedTracks, $scope.noMatches);
				$scope.searching = false;
			});
		};

		var getPlaylistIdFromUrl = function() {
			var name = 'list';
			// http://stackoverflow.com/a/901144/877117
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		        results = regex.exec($scope.playlistId);
		    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

		$scope.createDisplayName = QueryFactory.createDisplayName;

		var clearResults = function() {
			$scope.matches = [];
			$scope.toBeReviewed = [];
			$scope.selectedReviewedTracks = {};
			$scope.noMatches = [];
			$scope.messages = [];
		};

		$scope.assignSelectedTrack = function(trackUrl, trackId) {
			QueryFactory.assignSelectedTrack(trackUrl, trackId, $scope.selectedReviewedTracks);
		};

		$scope.createPlaylist = function(name, isPublic) {
			SpotifyPlaylistFactory.createPlaylist(name, isPublic, $scope.matches, $scope.selectedReviewedTracks, $scope.messages);
		};

	}])
	.controller('SoundCloud', ['$scope', '$routeParams', 'UserFactory', 'SpotifySearchFactory', 'SpotifyPlaylistFactory', 'QueryFactory', function($scope, $routeParams, UserFactory, SpotifySearchFactory, SpotifyPlaylistFactory, QueryFactory) {
		if ($routeParams.access_token && $routeParams.refresh_token) {
			// Save the access token into local storage
			UserFactory.setAccessToken($routeParams.access_token);
			// Save the refresh token into local storage
			UserFactory.setRefreshToken($routeParams.refresh_token);
			UserFactory.getSpotifyUserInfo();
		}
		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});
		// The tracks that matched 100%
		$scope.matches = [];
		// The track that need review
		$scope.toBeReviewed = [];
		// The tracks with no matches
		$scope.noMatches = [];
		// The selected indexes of the review tracks
		$scope.selectedReviewedTracks = {};
		// The name of the playlist
		$scope.playlistName = '';
		// Boolean for if the playlist will be public or nah
		$scope.publicPlaylist = true;
		// Messages to the user
		$scope.messages = [];
		// Bool flag for if search is running
		$scope.searching = false;

		$scope.playlistId = '';

		$scope.searchType = 'SoundCloud';

		$scope.soundCloudClientId = '88434bd865d117fd3f098ca6c2c7ad38';

		$scope.performSearch = function() {
			$scope.searching = true;
			clearResults();
			var url = '/resolve.json?url=' + $scope.playlistId + '&client_id=' + $scope.soundCloudClientId;
			SC.get(url, function(playlist) {
				var tracks = [];
				for (var i = 0; i < playlist.tracks.length; i++) {
					tracks.push(QueryFactory.normalizeSearchQuery(playlist.tracks[i].title));
				}
				QueryFactory.performSearch(tracks, $scope.matches, $scope.toBeReviewed, $scope.selectedReviewedTracks, $scope.noMatches);
				$scope.searching = false;
			});
		};

		var getPlaylistIdFromUrl = function() {
			var name = 'list';
			// http://stackoverflow.com/a/901144/877117
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		        results = regex.exec($scope.playlistId);
		    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

		$scope.createDisplayName = QueryFactory.createDisplayName;

		var clearResults = function() {
			$scope.matches = [];
			$scope.toBeReviewed = [];
			$scope.selectedReviewedTracks = {};
			$scope.noMatches = [];
			$scope.messages = [];
		};

		$scope.assignSelectedTrack = function(trackUrl, trackId) {
			QueryFactory.assignSelectedTrack(trackUrl, trackId, $scope.selectedReviewedTracks);
		};

		$scope.createPlaylist = function(name, isPublic) {
			SpotifyPlaylistFactory.createPlaylist(name, isPublic, $scope.matches, $scope.selectedReviewedTracks, $scope.messages);
		};

	}])
	.controller('User', ['$scope', 'UserFactory', function($scope, UserFactory) {
		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
		$scope.$on('userChanged', function(event, data) {
			$scope.userLoggedIn = data.userLoggedIn;
			$scope.currentUser = data.currentUser;
		});

	}])
	.controller('UsersLogOut', ['$scope', '$location', 'UserFactory', function($scope, $location, UserFactory) {
		UserFactory.clearUserData();
		$location.path('#/splash')
	}]);
