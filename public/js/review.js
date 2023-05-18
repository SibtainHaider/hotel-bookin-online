const total_data = async (event) => {
    const result = await fetch("/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    console.log(data);
    newHTML = ''
    for(let i =0; i<data.data.length; i++)
    {
        newHTML = newHTMl + `<section class="review">
        <div class="review-text">
          <h2>Bob Johnson</h2>
          <p>"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p> 
        </div>
      </section>`
    }

}
total_data();

const form = document.querySelector('.review-form');
form.addEventListener('submit', async (event) => {
    const res = await fetch("/PostReview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            review: event.target.review.value
        })
    })
    const data = res.json();
    window.location.href = data.path;
});