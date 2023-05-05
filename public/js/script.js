const total_data = async(event)=>{
  const result = await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await result.json();
  console.log(data.prices);
  
  newHTML = ''
  for(let i = 0; i < data.hotel.length; i++){
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
              <li><a href="form.html" class="card-link">Executive Room: Rs${data.prices[i].price}.</a></li>
              <li><a href="form.html" class="card-link">Prime Room</a></li>
              <li><a href="/form" class="card-link">Deluxe Room</a></li>
            </ul>
          </div>
        </div>
      </div>`;
    }
    document.querySelector(".cards-section").innerHTML = newHTML;
  //console.log(data.hotel)
}
total_data();
