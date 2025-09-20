function previewImage(url) {
    const previewElement = document.getElementById("image-preview-element");
    const placeholder = document.querySelector(".image-preview-placeholder");

    if (url && url.trim() !== "") {
      previewElement.src = url;
      previewElement.style.display = "block";
      placeholder.style.display = "none";
    } else {
      previewElement.style.display = "none";
      placeholder.style.display = "block";
    }
  }


  document.querySelector("form").addEventListener("submit", function (e) {
    let isValid = true;
    const inputs = this.querySelectorAll("input[required], textarea[required]");

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "red";
      } else {
        input.style.borderColor = "#ddd";
      }
    });

    if (!isValid) {
    //   e.preventDefault();
    //   alert("Please fill in all required fields.");
    input.style.borderColor = "red";
    }
  });



// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  console.log(forms);
  
  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()