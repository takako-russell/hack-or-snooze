"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, isMyNav = false) {
  console.debug("generateStoryMarkup", story);

  let isFavorite =
    currentUser &&
    currentUser.favorites &&
    currentUser.favorites.find((s) => {
      return s.storyId === story.storyId;
    })
      ? true
      : false;
  const hostName = story.getHostName();
  return $(`
  
      <li id="${story.storyId}">
             ${
               isMyNav
                 ? `
                 <span class="trash">
                   <i class="fas fa-trash-alt"></i>
                 </span>`
                 : ""
             }
        <span class="star">
          <i class="${isFavorite ? "fa" : "far"} fa-star">
          </i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div>
        <small class="story-author" style="color:green">by ${
          story.author
        }</small>
        <small class="story-user" style="color:orange">posted by ${
          story.username
        }</small>
        </div>
      </li>
    `);
}

// ----------- Build UI for Each Tab independetly

// Build All Stories default page
async function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of the stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    $allStoriesList.append($story);
  }
  $(".star").on("click", onStarClick);

  $allStoriesList.show();
}

//Build Favorites page
async function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");
  $favoritesList.empty();

  // loop through all of our favorites and generate HTML for them
  if (currentUser.favorites.length > 0) {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritesList.append($story);
    }
    $(".star").on("click", onStarClick);
  } else {
    $favoritesList.append(
      "<div class='no-items'><p>No favorited user stories</p></div>"
    );
  }

  $favoritesList.show();
}

// Build MY Stories Page
async function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");
  $myList.empty();

  // loop through all of our stories and generate HTML for them
  if (currentUser.ownStories.length > 0) {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);

      $myList.append($story);
    }
    $(".trash").on("click", onTrashClick);
    $(".star").on("click", onStarClick);
  } else {
    $myList.append("<div class='no-items'><p>No added user stories</p></div>");
  }

  $myList.show();
}

// --------- Story Favorite (Add/Remove) and Remove Event Listeners

// Fires when a star is clicked (on/off)
async function onStarClick(e) {
  let iconElement = e.currentTarget.children[0];
  let isFavorite = iconElement.classList.contains("fa");

  if (!isFavorite) {
    $(iconElement).removeClass("far fa-star").addClass("fa fa-star");
    let favs = await currentUser.addFavorite(
      currentUser.username,
      e.currentTarget.parentElement.id,
      currentUser.loginToken
    );
    currentUser.favorites = favs;
  } else {
    $(iconElement).removeClass("fa fa-star").addClass("far fa-star");
    let favs = await currentUser.deleteFavorite(
      currentUser.username,
      e.currentTarget.parentElement.id,
      currentUser.loginToken
    );
    currentUser.favorites = favs;
  }
}

// Fires when trash icon is clicked (deleted story)
async function onTrashClick(e) {
  const thisParent = $(this).parent();

  let deletedStory = await currentUser.deleteStory(thisParent.attr("id"));
  storyList.stories = storyList.stories.filter((story) => {
    return story.storyId !== deletedStory.storyId;
  });
  currentUser.ownStories = currentUser.ownStories.filter((story) => {
    return story.storyId !== deletedStory.storyId;
  });
  currentUser.favorites = currentUser.favorites.filter((story) => {
    return story.storyId !== deletedStory.storyId;
  });

  putMyStoriesOnPage();
}

// ------ Submit new story handling

// Fires when a new story is submit
async function submitNewStory(e) {
  e.preventDefault();
  const addedStory = await submitFormToAddStory();
  const $story = generateStoryMarkup(addedStory);

  $allStoriesList.append($story);
  $addStoryForm.hide();
}

$("#submit-form-btn").on("click", submitNewStory);

// Creates new story and adds to list
// push the created story also on to the current user's list of stories
async function submitFormToAddStory() {
  console.debug("submitFormToAddStory");

  let storyVals = {
    author: $("#input-author").val(),
    title: $("#input-title").val(),
    url: $("#input-url").val(),
  };

  const addedStory = await storyList.addStory(currentUser, storyVals);
  currentUser.ownStories.push(addedStory);
  resetAddStoryUI();
  return addedStory;
}

// Reset the UI for form fields after new story post
function resetAddStoryUI() {
  $("#input-author").val("");
  $("#input-title").val("");
  $("#input-url").val("");

  $addStoryForm.hide();
}
