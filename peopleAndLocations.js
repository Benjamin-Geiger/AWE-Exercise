// ---------------------------------------------------------------------
// PEOPLE & LOCATIONS
// ---------------------------------------------------------------------
import { evidenceMentionsPerson } from "./lookup-utilities.js";
import { navigateTo } from "./navigation.js";
import { renderEvidenceList } from "./evidence-catalogue.js";
import { allEvidence, allPeople, allLocations, setCurrentPeopleTab } from "./state.js";

export function switchPeopleTab(tab) {
  setCurrentPeopleTab(tab);
  var peoplePanel = document.getElementById("peoplePanel");
  var locationsPanel = document.getElementById("locationsPanel");
  var peopleTabBtn = document.getElementById("tabPeopleBtn");
  var locationsTabBtn = document.getElementById("tabLocationsBtn");

  if (tab === "people") {
    peoplePanel.classList.remove("hidden");
    locationsPanel.classList.add("hidden");
    peopleTabBtn.classList.add("active");
    locationsTabBtn.classList.remove("active");
  } else {
    peoplePanel.classList.add("hidden");
    locationsPanel.classList.remove("hidden");
    peopleTabBtn.classList.remove("active");
    locationsTabBtn.classList.add("active");
  }
}

function countEvidenceForPerson(person) {
  var count = 0;
  for (var i = 0; i < allEvidence.length; i++) {
    if (evidenceMentionsPerson(allEvidence[i], person)) count++;
  }
  return count;
}

export function renderPeople() {
  var container = document.getElementById("peoplePanel");
  var html = "";
  for (var i = 0; i < allPeople.length; i++) {
    var person = allPeople[i];
    var count = countEvidenceForPerson(person);

    html += '<div class="person-card">';
    html += '<div class="person-card-header">';
    html += '<img class="person-avatar" src="' + person.avatar + '" alt="Portrait of ' + person.name + '">';
    html += "<div><h3>" + person.name + "</h3><div class=\"person-role\">" + person.role + "</div></div>";
    html += "</div>";
    html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";
    html += "<ul>";
    for (var r = 0; r < person.responsibilities.length; r++) {
      html += "<li>" + person.responsibilities[r] + "</li>";
    }
    html += "</ul>";
    html += '<div class="person-statement">&ldquo;' + person.statement + '&rdquo;</div>';
    html += "<p>" + count + " related evidence item" + (count === 1 ? "" : "s") + " &mdash; ";
    html += '<button type="button" class="evidence-count-link" data-person-id="' + person.id + '">view</button></p>';
    html += "</div>";
  }
  container.innerHTML = html;

  var links = container.querySelectorAll(".evidence-count-link");
  for (var l = 0; l < links.length; l++) {
    links[l].addEventListener("click", function (e) {
      var personId = e.target.getAttribute("data-person-id");
      document.getElementById("filterPerson").value = personId;
      navigateTo("evidence");
      setTimeout(function () {
        renderEvidenceList();
      }, 0);
    });
  }
}

export function renderLocations() {
  var container = document.getElementById("locationsPanel");
  var html = "";
  for (var i = 0; i < allLocations.length; i++) {
    var loc = allLocations[i];
    html += '<div class="location-card">';
    html += "<h3>" + loc.id + " &mdash; " + loc.name + "</h3>";
    html += "<p>" + loc.description + "</p>";
    html += "<p><strong>Contains:</strong></p><ul>";
    for (var c = 0; c < loc.contains.length; c++) {
      html += "<li>" + loc.contains[c] + "</li>";
    }
    html += "</ul></div>";
  }
  container.innerHTML = html;
}