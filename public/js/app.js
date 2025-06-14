document.addEventListener("DOMContentLoaded", function() {
  let taxToggle = document.getElementById("switchCheckReverse");
  console.log(taxToggle);
  taxToggle.addEventListener("change", function () {
    let gst = document.getElementsByClassName("gst");
    for (let info of gst) {
      if (info.style.display === "none") {
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
    }
  });
});

  function toggleFilters() {
    const filters = document.querySelector(".filters");
    filters.classList.toggle("show");
  }
