/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories
 */

/** grouping inspections */
import { clean, safe, cityName, formatDate, countFailed } from "./helpers.js";

function showCategories(data) {
  const groups = {};
  data.forEach((inspection) => {
    const key = clean(inspection.category);
    if (!groups[key]) groups[key] = [];
    groups[key].push({ ...inspection, failed: countFailed(inspection) });
  });
/** working between no. of inspection vs avg no. of checks failed */
    const summaries = Object.entries(groups)
    .map(([name, items]) => ({
      name,
      count: items.length,
      avgFailed: items.reduce((sum, i) => sum + i.failed, 0) / items.length,
      items: items.sort(
        (a, b) => new Date(b.inspection_date) - new Date(a.inspection_date)
      ),
    }))
    .sort((a, b) => b.count - a.count);
/** groups to html */
      const sections = summaries
    .map(
      (group) => `
      <section class="category-section">
        <h3 class="category-header">
          <span>${safe(group.name)}</span>
          <span class="category-stats">
            <span>${group.count} inspection${group.count === 1 ? "" : "s"}</span>
            <span>${group.avgFailed.toFixed(2)} avg failed checks</span>
          </span>
        </h3>
        <ul class="category-items">
          ${group.items
            .map(
              (i) => `
            <li class="category-item">
              <span><strong>${safe(i.name)}</strong><br>${cityName(i.city)}</span>
              <span>${formatDate(i.inspection_date)} &middot; ${i.failed} failed</span>
            </li>`
            )
            .join("")}
        </ul>
      </section>`
    )
    .join("");

  return `
    <h2 class="view-title">📂 Category View</h2>
    <p class="view-description">For reporters: inspections grouped by type of business, largest group first. Each group shows its average number of failed checks.</p>
    ${sections}`;
}

export default showCategories;
