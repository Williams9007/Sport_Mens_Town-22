fetch("http://localhost:5000/api/data")
  .then(res => res.json())
  .then(items => {
    let container = document.getElementById("data");
    items.forEach(item => {
      let p = document.createElement("p");
      p.innerText = item;
      container.appendChild(p);
    });
  });
