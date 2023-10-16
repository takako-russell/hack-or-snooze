"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

/** Wire events for Profile, Submit, Favorites, and My Stories clicks */

function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}
$navUserProfile.on("click", navProfileClick);

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $addStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);

$body.on("click", "#nav-all", navAllStories);

function navFavStories(evt) {
  console.debug("navFavStories", evt);
  hidePageComponents();
  putFavStoriesOnPage();
  $favoritesList.show();
}

$body.on("click", "#favorite-link", navFavStories);

function navMyStories(evt) {
  console.debug("navFavStories", evt);
  hidePageComponents();
  putMyStoriesOnPage();
  $myList.show();
}

$body.on("click", "#mystories-link", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");

  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $loginForm.hide();
  $signupForm.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}
