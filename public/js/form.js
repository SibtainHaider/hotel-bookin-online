const booking_forms = document.querySelector(".booking-page");
const booking_data = async (event) => {
  id = window.location.href.split("form:")[1];

  const result = await fetch("/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  });
  const data = await result.json();
  if (data.status === "200") {
    console.log(data.hotel);
    booking_forms.querySelector(".firstname").value = data.user.f_name;
    booking_forms.querySelector(".lastname").value = data.user.l_name;
    booking_forms.querySelector(".email").value = data.user.email;
    booking_forms.querySelector(".location__select").value = data.hotel.city;
    booking_forms.querySelector(".h-name").value = data.hotel.hotel_name;
  }
  booking_forms.addEventListener("submit", async (event) => {
    event.preventDefault();
    const firstname = booking_forms.querySelector(".firstname").value;
    const lastname = booking_forms.querySelector(".lastname").value;
    const email = booking_forms.querySelector(".email").value;
    const phone = booking_forms.querySelector(".phone-no").value;
    const location = booking_forms.querySelector(".location__select").value;
    const hotelname = booking_forms.querySelector(".h-name").value;
    const roomtype = booking_forms.querySelector(".r-type").value;
    const no_person = booking_forms.querySelector(".no-person").value;
    const cin = booking_forms.querySelector(".cin-date").value;
    const cout = booking_forms.querySelector(".cout-date").value;
    const hotel_id = id;

    // console.log(firstname,
    //   lastname,
    //   email,
    //   phone,
    //   location,
    //   hotelname,
    //   roomtype,
    //   no_person,
    //   cin,
    //   cout,
    //   hotel_id);

    const result = await fetch("/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phone,
        location,
        hotelname,
        roomtype,
        no_person,
        cin,
        cout,
        hotel_id,
      }),
    });
    const data = await result.json();
    if (data.status === "200") {
      alert("Booking Successful");
      window.location.href = "/";
    }
  });
};
booking_data();
