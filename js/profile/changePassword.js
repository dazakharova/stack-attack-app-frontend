document.addEventListener("DOMContentLoaded", function() {
  function showChangePasswordModal() {
      var modal = document.getElementById("changePasswordModal");
      modal.classList.add("show");
      modal.style.display = "block";
  }

  var changePasswordLink = document.getElementById("change-password-menu");
  if (changePasswordLink) {
      changePasswordLink.addEventListener("click", function(e) {
          e.preventDefault();
          showChangePasswordModal();
      });
  }
});
