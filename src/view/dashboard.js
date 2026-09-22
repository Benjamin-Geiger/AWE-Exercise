// ---------------------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------------------
import { formatDate, getStatusBadgeClass } from "../controller/lookup-utilities.js";
import {
  allEvidence,
  allPeople,
  allLocations,
  bookmarks,
  caseData,
  allTimeline,
} from "../controller/state.js";

export function renderDashboard() {
  const container = document.getElementById("dashboardContent");
  if (!container) return;

  let reviewedCount = 0;
  for (let i = 0; i < allEvidence.length; i++) {
    if ((allEvidence[i].status || "").toLowerCase() === "reviewed") reviewedCount++;
  }

  const progressPct =
    allEvidence.length === 0 ? 0 : Math.round((reviewedCount / allEvidence.length) * 100);

  let html = "";
  html += '<div class="case-summary-card">';
  html += "<h3>" + (caseData.title || "Case") + "</h3>";
  html +=
    '<p><span class="badge badge-flagged">' +
    (caseData.status || "unknown").toUpperCase() +
    "</span></p>";
  html += "<p>" + (caseData.summary || "") + "</p>";
  html += "</div>";

  html += '<div class="stat-grid">';
  html += statCardHTML(allEvidence.length, "Evidence items");
  html += statCardHTML(allPeople.length, "People");
  html += statCardHTML(allLocations.length, "Locations");
  html += statCardHTML(bookmarks.length, "Bookmarked");
  html += statCardHTML(reviewedCount, "Reviewed");
  html += "</div>";

  html += '<div class="dashboard-panel">';
  html += "<h3>Review progress</h3>";
  html +=
    '<div class="progress-bar-outer"><div class="progress-bar-inner" style="width:' +
    progressPct +
    '%;"></div></div>';
  html += "<p>" + progressPct + "% of evidence reviewed</p>";
  html += "</div>";

  html += '<div class="dashboard-columns">';

  html += '<div class="dashboard-panel"><h3>Recent evidence</h3>';
  const recentEvidence = allEvidence.slice(-5).reverse();
  if (recentEvidence.length === 0) {
    html += "<p>No evidence loaded yet.</p>";
  }
  for (let e = 0; e < recentEvidence.length; e++) {
    const ev = recentEvidence[e];
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <span class="badge ' +
      getStatusBadgeClass(ev.status) +
      '">' +
      ev.status +
      "</span></div>";
  }
  html += "</div>";

  html += '<div class="dashboard-panel"><h3>Recent timeline events</h3>';
  const recentTimeline = allTimeline.slice(-5).reverse();
  if (recentTimeline.length === 0) {
    html += "<p>No timeline events loaded yet.</p>";
  }
  for (let t = 0; t < recentTimeline.length; t++) {
    const evt = recentTimeline[t];
    html +=
      '<div class="mini-list-item"><strong>' +
      formatDate(evt.time) +
      "</strong><br>" +
      evt.title +
      "</div>";
  }
  html += "</div>";

  html += "</div>"; // dashboard-columns

  container.innerHTML = html;
}

function statCardHTML(value, label) {
  return (
    '<div class="stat-card"><div class="stat-value">' +
    value +
    '</div><div class="stat-label">' +
    label +
    "</div></div>"
  );
}
