
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */

/** data */
import { safe, cityName, formatDate, countFailed } from "./helpers.js";

function showTable(data) {
  const rows = data
    .map((inspection) => ({ ...inspection, failed: countFailed(inspection) }))
    .sort(
      (a, b) =>
        b.failed - a.failed ||
        new Date(b.inspection_date) - new Date(a.inspection_date)
    );
/**
 * converting inspection into rows
 */
      const bodyRows = rows
    .map(
      (i) => `
      <tr>
        <th scope="row">${safe(i.name)}</th>
        <td>${cityName(i.city)}</td>
        <td>${formatDate(i.inspection_date)}</td>
        <td>${safe(i.inspection_type)}</td>
        <td>${safe(i.inspection_results)}</td>
        <td><span class="badge ${i.failed > 0 ? "badge-bad" : "badge-ok"}">${i.failed} of 15</span></td>
      </tr>`
    )
    .join("");
/** wrapping the table */
      return `
    <h2 class="view-title">📊 Table View</h2>
    <p class="view-description">For health inspectors: inspections with the most failed safety checks appear first.</p>
    <div class="table-wrap" role="region" aria-label="Inspections table, scrolls sideways on small screens" tabindex="0">
      <table class="restaurant-table">
        <caption>${data.length} food safety inspections, ranked by number of failed safety checks (most first)</caption>
        <thead>
          <tr>
            <th scope="col">Business</th>
            <th scope="col">City</th>
            <th scope="col">Date</th>
            <th scope="col">Inspection type</th>
            <th scope="col">Result</th>
            <th scope="col">Failed checks</th>
          </tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;
}

export default showTable;
