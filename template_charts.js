/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */

import { clean, CHECK_FIELDS, checkLabel } from "./helpers.js";

/** converting data to labels and numbers*/
function countBy(data, getKey) {
  const counts = {};
  data.forEach((inspection) => {
    const key = getKey(inspection);
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

/** numbers for the charts*/
function categoryData(data) {
  const top = countBy(data, (i) => clean(i.category)).slice(0, 8);
  return { labels: top.map((e) => e[0]), numbers: top.map((e) => e[1]) };
}

function resultData(data) {
 
  const recorded = data.filter((i) => clean(i.inspection_results) !== "Not listed");
  const all = countBy(recorded, (i) => i.inspection_results);
  return { labels: all.map((e) => e[0]), numbers: all.map((e) => e[1]) };
}

function failedCheckData(data) {
  const rows = CHECK_FIELDS.map((field) => ({
    label: checkLabel(field),
    n: data.filter((i) => i[field] === "Out of Compliance").length,
  }))
    .filter((row) => row.n > 0)
    .sort((a, b) => b.n - a.n);
  return { labels: rows.map((r) => r.label), numbers: rows.map((r) => r.n) };
}

/** alt text */
function describe(data) {
  const total = data.length;
  const cat = categoryData(data);
  const res = resultData(data);
  const fail = failedCheckData(data);
  const recordedCount = res.numbers.reduce((sum, n) => sum + n, 0);

  return {
    category: `${cat.labels[0]} had the most inspections: ${cat.numbers[0]} of ${total} (top ${cat.labels.length} business types shown).`,
    result: res.labels.length
      ? `${recordedCount} of ${total} inspections have a recorded result, and the most common was ${res.labels[0]} with ${res.numbers[0]}.`
      : "No inspection results were recorded in this data.",
    failed: fail.labels.length
      ? `${fail.labels[0]} was the most frequently failed check: ${fail.numbers[0]} of ${total} inspections.`
      : "No safety checks were failed in this data.",
  };
}


function showCharts(data) {
  const text = describe(data);
  return `
    <h2 class="view-title">📈 Charts View</h2>
    <p class="view-description">Patterns across all ${data.length} inspections. A sentence under each chart says what it shows.</p>
    <div class="charts-grid">
      <figure class="chart-figure">
        <div class="chart-box">
          <canvas id="chart-category" role="img" aria-label="Bar chart of inspections by type of business. ${text.category}"></canvas>
        </div>
        <figcaption class="chart-summary">${text.category}</figcaption>
      </figure>
      <figure class="chart-figure">
        <div class="chart-box">
          <canvas id="chart-results" role="img" aria-label="Doughnut chart of inspection results. ${text.result}"></canvas>
        </div>
        <figcaption class="chart-summary">${text.result}</figcaption>
      </figure>
      <figure class="chart-figure">
        <div class="chart-box">
          <canvas id="chart-failed" role="img" aria-label="Horizontal bar chart of failed safety checks. ${text.failed}"></canvas>
        </div>
        <figcaption class="chart-summary">${text.failed}</figcaption>
      </figure>
    </div>`;
}

/** charts */
const COLORS = ["#007cba", "#28a745", "#ffc107", "#dc3545", "#6f42c1",
                "#fd7e14", "#20c997", "#6c757d", "#17a2b8", "#e83e8c"];

function makeChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const old = Chart.getChart(canvas); // avoids drawing twice on the same canvas
  if (old) old.destroy();
  new Chart(canvas, config);
}

function drawCharts(data) {
  if (typeof Chart === "undefined") {
    document.querySelector(".charts-grid").innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }

  const cat = categoryData(data);
  const res = resultData(data);
  const fail = failedCheckData(data);

  /** bar*/
  makeChart("chart-category", {
    type: "bar",
    data: {
      labels: cat.labels,
      datasets: [{ label: "Inspections", data: cat.numbers, backgroundColor: "#007cba" }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Inspections by type of business" },
        legend: { display: false },
      },
      scales: {
        x: { title: { display: true, text: "Type of business" }, 
              ticks: {maxRotation: 45, autoSkip: false}},
        y: { beginAtZero: true, ticks: { precision: 0 },
             title: { display: true, text: "Number of inspections" } },
      },
    },
  });

  /** doughnut */
  makeChart("chart-results", {
    type: "doughnut",
    data: {
      labels: res.labels,
      datasets: [{
        data: res.numbers,
        backgroundColor: res.labels.map((_, i) => COLORS[i % COLORS.length]),
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Inspection results (recorded results only)" },
        legend: { position: "bottom" },
      },
    },
  });

  /** horizontal bar*/
  makeChart("chart-failed", {
    type: "bar",
    data: {
      labels: fail.labels,
      datasets: [{ label: "Inspections failed", data: fail.numbers, backgroundColor: "#dc3545" }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      layout: {padding: {left: 10}},
      plugins: {
        title: { display: true, text: "Most frequently failed safety checks" },
        legend: { display: false },
      },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 },
             title: { display: true, text: "Number of inspections failed" } },
        y: { title: { display: true, text: "Safety check" } },
      },
    },
  });
}

export { showCharts, drawCharts };