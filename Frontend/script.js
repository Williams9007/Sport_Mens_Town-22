document.addEventListener("DOMContentLoaded", () => {
  const dataDiv = document.getElementById("data");

  fetch("http://localhost:8000/api/epl")
    .then(res => res.json())
    .then(data => {
      if (!data.fixtures || data.fixtures.length === 0) {
        dataDiv.innerHTML = "<p>No fixtures found.</p>";
        return;
      }

      let html = "<ul>";
      data.fixtures.forEach(f => {
        html += `<li>${f.date} - ${f.home} vs ${f.away} (${f.time})</li>`;
      });
      html += "</ul>";
      dataDiv.innerHTML = html;
    })
    .catch(err => {
      dataDiv.innerHTML = `<p style="color:red;">Error fetching data: ${err.message}</p>`;
    });
});
