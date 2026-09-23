// ---------------------------------------------------------------------
// PEOPLE & LOCATIONS
// ---------------------------------------------------------------------
import { evidenceMentionsPerson } from "../controller/lookup-utilities.js";
import { navigateTo } from "../controller/navigation.js";
import { renderEvidenceList } from "./evidence-catalogue.js";
import { allEvidence, allPeople, allLocations } from "../controller/state.js";
import type { Person } from "../types.js";

export function switchPeopleTab(tab: string): void {
  const peoplePanel = document.getElementById("peoplePanel");
  const locationsPanel = document.getElementById("locationsPanel");
  const peopleTabBtn = document.getElementById("tabPeopleBtn");
  const locationsTabBtn = document.getElementById("tabLocationsBtn");
  if (!peoplePanel || !locationsPanel || !peopleTabBtn || !locationsTabBtn) return;

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

function countEvidenceForPerson(person: Person): number {
  let count = 0;
  for (const ev of allEvidence) {
    if (evidenceMentionsPerson(ev, person)) count++;
  }
  return count;
}

export function renderPeople(): void {
  const container = document.getElementById("peoplePanel");
  if (!container) return;

  let html = "";
  for (const person of allPeople) {
    const count = countEvidenceForPerson(person);

    html += '<div class="person-card">';
    html += '<div class="person-card-header">';
    html +=
      '<img class="person-avatar" src="' +
      person.avatar +
      '" alt="Portrait of ' +
      person.name +
      '">';
    html +=
      "<div><h3>" + person.name + '</h3><div class="person-role">' + person.role + "</div></div>";
    html += "</div>";
    html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";
    html += "<ul>";
    for (const responsibility of person.responsibilities) {
      html += "<li>" + responsibility + "</li>";
    }
    html += "</ul>";
    html += '<div class="person-statement">&ldquo;' + person.statement + "&rdquo;</div>";
    html += "<p>" + count + " related evidence item" + (count === 1 ? "" : "s") + " &mdash; ";
    html +=
      '<button type="button" class="evidence-count-link" data-person-id="' +
      person.id +
      '">view</button></p>';
    html += "</div>";
  }
  container.innerHTML = html;

  const links = container.querySelectorAll(".evidence-count-link");
  for (let l = 0; l < links.length; l++) {
    links[l]?.addEventListener("click", (e) => {
      const personId = (e.target as HTMLElement).getAttribute("data-person-id");
      const personFilter = document.getElementById("filterPerson") as HTMLSelectElement | null;
      if (personFilter && personId) personFilter.value = personId;
      navigateTo("evidence");
      setTimeout(() => renderEvidenceList(), 0);
    });
  }
}

export function renderLocations(): void {
  const container = document.getElementById("locationsPanel");
  if (!container) return;

  let html = "";
  for (const loc of allLocations) {
    html += '<div class="location-card">';
    html += "<h3>" + loc.id + " &mdash; " + loc.name + "</h3>";
    html += "<p>" + loc.description + "</p>";
    html += "<p><strong>Contains:</strong></p><ul>";
    for (const item of loc.contains) {
      html += "<li>" + item + "</li>";
    }
    html += "</ul></div>";
  }
  container.innerHTML = html;
}
