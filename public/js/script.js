// Selecting elements from the DOM
const bookingForm = document.querySelector("#booking-form");
const checkInDateInput = document.querySelector("#check-in-date");
const checkOutDateInput = document.querySelector("#check-out-date");
const roomTypeSelect = document.querySelector("#room-type");
const guestsInput = document.querySelector("#guests");
const availabilityResults = document.querySelector("#availability-results");
const roomList = document.querySelector("#room-list");

// Event listener for the booking form
bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  
  // Getting the form data
  const checkInDate = checkInDateInput.value;
  const checkOutDate = checkOutDateInput.value;
  const roomType = roomTypeSelect.value;
  const guests = guestsInput.value;
  
  // Checking availability
  const availableRooms = checkAvailability(checkInDate, checkOutDate, roomType, guests);
  
  // Displaying the available rooms
  displayAvailability(availableRooms);
});

// Function to check availability
function checkAvailability(checkInDate, checkOutDate, roomType, guests) {
  // In this sample code, we assume that all rooms are available
  // You would replace this code with your actual availability logic
  
  const availableRooms = [
    { type: "Single Room", price: 100 },
    { type: "Double Room", price: 150 },
    { type: "Suite", price: 250 }
  ];
  
  return availableRooms;
}

// Function to display availability
function displayAvailability(availableRooms) {
  // Clearing the existing room list
  roomList.innerHTML = "";
  
  // Creating the new room list
  availableRooms.forEach(function (room) {
    const roomItem = document.createElement("li");
    roomItem.innerHTML = `
      <h3>${room.type}</h3>
      <p>Price: $${room.price}/night</p>
      <button class="book-now">Book Now</button>
    `;
    roomList.appendChild(roomItem);
  });
  
  // Displaying the availability results section
  availabilityResults.classList.add("visible");
  
  // Adding event listeners to the book now buttons
  const bookNowButtons = document.querySelectorAll(".book-now");
  bookNowButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      alert("Booking not implemented in this sample code!");
    });
  });
}
