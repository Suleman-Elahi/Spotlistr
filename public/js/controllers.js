'use strict';

/* Controllers */

angular.module('spotlistr.controllers', [])
	.controller('Textbox', ['$scope', '$routeParams', 'UserFactory', 'SpotifySearchFactory', 'SpotifyPlaylistFactory', function($scope, $routeParams, UserFactory, SpotifySearchFactory, SpotifyPlaylistFactory) {
		if ($routeParams.access_token && $routeParams.refresh_token) {
			console.log('New session being created');
			// Save the access token into local storage
			UserFactory.setAccessToken($routeParams.access_token);
			// Save the refresh token into local storage
			UserFactory.setRefreshToken($routeParams.refresh_token);
			UserFactory.getSpotifyUserInfo();
		}
		$scope.currentUser = UserFactory.currentUser();
		$scope.userLoggedIn = UserFactory.userLoggedIn();
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
		$scope.publicPlaylist = false;

		$scope.performSearch = function() {
			clearResults();
			var rawInputByLine = $scope.taData.split('\n');
			var inputByLine = normalizeSearchArray(rawInputByLine);
			for (var i = 0; i < inputByLine.length; i += 1) {
				console.log(inputByLine[i]);
				SpotifySearchFactory.search(inputByLine[i], function(response) {
					if (response.tracks.items.length > 1) {
						$scope.toBeReviewed.push(response);
						$scope.selectedReviewedTracks[response.tracks.href] = response.tracks.items[0].id;
					} else if (response.tracks.items.length === 1) {
						$scope.matches.push(response);
					} else {
						$scope.noMatches.push(response);
					}
				});
			}
		};

		var normalizeSearchQuery = function(query) {
			return query.replace(/[^\w\s]/gi, '');
		};

		var normalizeSearchArray = function(arr) {
			var normalizedArray = new Array(arr.length);
			for (var i = 0; i < arr.length; i += 1) {
				normalizedArray[i] = normalizeSearchQuery(arr[i]);
			}
			return normalizedArray;
		};

		$scope.createDisplayName = function(track) {
			var result = '';
			for (var i = 0; i < track.artists.length; i += 1) {
				if (i < track.artists.length - 1) {
					result += track.artists[i].name + ', ';
				} else {
					result += track.artists[i].name;
				}
			}
			result += ' - ' + track.name;
			return result;
		}

		var clearResults = function() {
			$scope.matches = [];
			$scope.toBeReviewed = [];
			$scope.noMatches = [];
		}

		$scope.login = function() {
			UserFactory.spotifyLogin();
		}

		$scope.assignSelectedTrack = function(trackUrl, trackId) {
			$scope.selectedReviewedTracks[trackUrl] = trackId;
		}

		$scope.createPlaylist = function(name, isPublic) {
			var playlist = gatherPlaylist(),
				successCallback = function(response) {
					if (response.id) {
						SpotifyPlaylistFactory.addTracks(UserFactory.getUserId(), response.id, UserFactory.getAccessToken(), playlist, function(response) {
							console.log(response);
						});
					} else {
						// TODO: Handle error
					}
				},
				errorCallback = function(data, status, headers, config) {
					if (status === 401) {
						// 401 unauthorized
						// The token needs to be refreshed
						UserFactory.getNewAccessToken(function(newTokenResponse) {
							console.log(newTokenResponse);
							UserFactory.setAccessToken(newTokenResponse.access_token);
							// Call the create new playlist function again
							// since we now have the proper access token
							SpotifyPlaylistFactory.create(name, UserFactory.getUserId(), UserFactory.getAccessToken(), isPublic, successCallback, errorCallback);
						}, function(data, status, headers, config) {
							// TODO: Show the error to the user
						});
					} else {
						// TODO: Show the error to the user
					}
				};
			SpotifyPlaylistFactory.create(name, UserFactory.getUserId(), UserFactory.getAccessToken(), isPublic, successCallback, errorCallback);
		};

		var gatherPlaylist = function () {
			var playlist = [];
			// Add all of the 100% matches
			for (var i = 0; i < $scope.matches.length; i += 1) {
				playlist.push(createSpotifyUriFromTrackId($scope.matches[i].tracks.items[0].id));
			}
			// Add the selected songs for the to-be-reviewed songs
			for (var prop in $scope.selectedReviewedTracks) {
				if ($scope.selectedReviewedTracks.hasOwnProperty(prop)) {
					playlist.push(createSpotifyUriFromTrackId($scope.selectedReviewedTracks[prop]));
				}
			}
			// TODO: Do something better with the ones that we couldn't find
			console.log(playlist);
			return playlist;
		};

		var createSpotifyUriFromTrackId = function(id) {
			return 'spotify:track:' + id;
		};

	}])
	.controller('Subreddit', ['$scope', 'SpotifySearchFactory', 'RedditFactory', function($scope, SpotifySearchFactory, RedditFactory) {
		$scope.subredditSortBy = [{name: 'hot', id: 'hot'}, {name: 'top', id: 'top'}, {name: 'new', id: 'new'}];
		$scope.selectedSortBy = $scope.subredditSortBy[0];
		$scope.subredditInput = '';

		$scope.performSearch = function() {
			RedditFactory.getSubreddit($scope.subredditInput, $scope.selectedSortBy.id, function(response) {
				console.log(response);
			});
		};
	}])
	.config(['$compileProvider', function( $compileProvider ) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|spotify):/);
	}]);
