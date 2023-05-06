const total_data = async (event) => {
  const result = await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await result.json();
  // console.log(data.prices);
  locationHTML = '<option value="">--- Select Option ---</option>';
  for (let i = 0; i < data.location.length; i++) {
    locationHTML =
      locationHTML +
      `<option value="${data.location[i].city}">${data.location[i].city}</option>`;
  }
  document.querySelector(".location").innerHTML = locationHTML;

  newHTML = "";
  for (let i = 0; i < data.hotel.length; i++) {
    newHTML =
      newHTML +
      `<div class="card-container">
        <div class="card">
          <div class="front">
            <img src="/roberto-nickson-emqnSQwQQDo-unsplash.jpg" alt="Product Image">
            <h2 class="hotel-name">${data.hotel[i].hotel_name}</h2>
          </div>
          <div class="back">
            <p>Description:</p>
            <ul>
              <li><a href="form.html" class="card-link" data-id=${
                data.hotel[i].hotel_id
              }>Executive Room: Rs${1234}.</a></li>
              <li><a href="form.html" class="card-link" data-id=${
                data.hotel[i].hotel_id
              }>Prime Room</a></li>
              <li><a href="/form" class="card-link" data-id=${
                data.hotel[i].hotel_id
              }>Deluxe Room</a></li>
            </ul>
          </div>
        </div>
      </div>`;
  }
  document.querySelector(".cards-section").innerHTML = newHTML;
  //console.log(data.hotel)
  document.querySelectorAll(".card-link").forEach((item) => {
    item.addEventListener("click", async (event) => {
      event.preventDefault();
      const hotel_id = item.dataset.id;
      window.location.href = `/form:${hotel_id}`;
    });
  });
  const search = document.querySelector(".search");
  search.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = search.querySelector(".location").value;
    console.log(location);
    const result = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location,
      }),
    });
    const data = await result.json();
    if (data.status === "200") {
      window.location.href = data.path;
    }
  });
};
total_data();
