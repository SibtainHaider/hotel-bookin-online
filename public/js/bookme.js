// const booking_forms = document.querySelector(".booking-page");
const booking_data = async (event) => {
  id = window.location.href.split("bookme:")[1];

  const result = await fetch("/bookme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location: id,
    }),
  });
  const data = await result.json();
  if (data.status === "200") {
    newhtml = "";
    for (let i = 0; i < data.hotel.length; i++) {
      newhtml =
        newhtml +
        `<div class="card-container">
        <form class="hotel_book">
        <div class="card">
          <div class="card__heading">
              <h2 class="hotel-name">${data.hotel[i].hotel_name}</h2>
          </div>
          <div class="front">
              <div>
                  <img src="roberto-nickson-emqnSQwQQDo-unsplash.jpg" alt="Product Image">
              </div>
              <div class="hotel-desc">
                  <h3>Price: 43</h3> 
                  <h3>Stars: 234</h3>
                  <h3>Room Type: Executive</h3>
              </div>
              <div>
                  <input class="submit-btn" type="submit" value="Book Now" data-id=${data.hotel[i].hotel_id}>
              </div>
          </div>
        </div>
        </form>
      </div>`;
    }
  }
  document.querySelector(".cards-section").innerHTML = newhtml;
  document.querySelectorAll(".hotel_book").forEach((item) => {
    item.addEventListener("submit", async (event) => {
      event.preventDefault();
      const hotel_id = event.target.querySelector(".submit-btn").dataset.id;
      window.location.href = `/form:${hotel_id}`;
    });
  });
};
booking_data();
