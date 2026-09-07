// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------
var allEvidence = [];
var filteredEvidence = [];
var selectedEvidence = null;
var bookmarks = [];
var currentPage = "dashboard";

var allPeople = [];
var allLocations = [];
var allTimeline = [];
var caseData = {};

var currentPeopleTab = "people";
var loadingStepsRemaining = 2; 


var evidenceViewLoading = true;


var viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false
};

var notesStore = {}; 
var modalCloseListenerCount = 0; 

var STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
var STORAGE_KEY_NOTES = "remotion_notes";
var STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";