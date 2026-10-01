(function (root) {
  "use strict";

  function isValidStudentNumber(value) {
    return /^\d{2}-\d{4}-\d{3}$/.test(String(value).trim());
  }

  function isValidPassword(value) {
    return typeof value === "string" && value.length >= 8 && !/\s/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[@$!]/.test(value);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { isValidStudentNumber: isValidStudentNumber, isValidPassword: isValidPassword };
  }

  if (typeof document === "undefined") return;

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("registrationForm");
    if (!form) return;

    var byId = function (id) { return document.getElementById(id); };
    var controls = {
      fullName: byId("fullName"), studentNumber: byId("studentNumber"), email: byId("email"),
      mobileNumber: byId("mobileNumber"), password: byId("password"),
      confirmPassword: byId("confirmPassword"), course: byId("course"), terms: byId("terms")
    };
    var errors = {
      fullName: byId("fullNameError"), studentNumber: byId("studentNumberError"), email: byId("emailError"),
      mobileNumber: byId("mobileNumberError"), password: byId("passwordError"),
      confirmPassword: byId("confirmPasswordError"), course: byId("courseError"), terms: byId("termsError")
    };
    var successMessage = byId("successMessage");
    var summary = byId("registrationSummary");
    var passwordFeedback = byId("passwordFeedback");

    function setError(key, message) {
      errors[key].textContent = message;
      controls[key].setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateName() {
      var value = controls.fullName.value.trim();
      controls.fullName.value = value;
      var message = value.length < 2 ? "Enter your full name (at least two characters)." : "";
      setError("fullName", message);
      return !message;
    }

    function validateStudentNumber() {
      controls.studentNumber.value = controls.studentNumber.value.trim();
      var message = controls.studentNumber.value ? (isValidStudentNumber(controls.studentNumber.value) ? "" : "Enter a student number in the format 24-1234-123.") : "Enter your student number.";
      setError("studentNumber", message);
      return !message;
    }

    function validateEmail() {
      controls.email.value = controls.email.value.trim();
      var value = controls.email.value;
      var message = !value ? "Enter your email address." : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter an email with a name, @, and a dotted domain." : "");
      setError("email", message);
      return !message;
    }

    function validateMobile() {
      controls.mobileNumber.value = controls.mobileNumber.value.trim();
      var value = controls.mobileNumber.value;
      var message = !value ? "Enter your mobile number." : (!/^(09\d{9}|\+639\d{9})$/.test(value) ? "Enter 09 followed by nine digits or +639 followed by nine digits, with no spaces or hyphens." : "");
      setError("mobileNumber", message);
      return !message;
    }

    function validatePassword() {
      var value = controls.password.value;
      var message = !value ? "Enter a password." : (!isValidPassword(value) ? "Use at least 8 characters, one uppercase letter, one digit, and @, $, or !. Do not use spaces." : "");
      setError("password", message);
      return !message;
    }

    function validateConfirmPassword() {
      var message = !controls.confirmPassword.value ? "Confirm your password." : (controls.confirmPassword.value !== controls.password.value ? "The passwords do not match." : "");
      setError("confirmPassword", message);
      return !message;
    }

    function validateCourse() {
      var message = controls.course.value === "BSIT" || controls.course.value === "BSCS" ? "" : "Select BSIT or BSCS.";
      setError("course", message);
      return !message;
    }

    function validateTerms() {
      var message = controls.terms.checked ? "" : "Confirm that your information is accurate.";
      setError("terms", message);
      return !message;
    }

    controls.password.addEventListener("input", function () {
      var valid = isValidPassword(controls.password.value);
      passwordFeedback.textContent = valid ? "Password meets all requirements." : "Password needs 8+ characters, an uppercase letter, a digit, and @, $, or !, with no spaces.";
      passwordFeedback.classList.toggle("is-valid", valid);
      if (errors.password.textContent) validatePassword();
      if (controls.confirmPassword.value) validateConfirmPassword();
    });
    controls.fullName.addEventListener("blur", validateName);
    controls.course.addEventListener("change", validateCourse);
    controls.terms.addEventListener("change", validateTerms);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      successMessage.textContent = "";
      summary.hidden = true;
      var valid = [validateName(), validateStudentNumber(), validateEmail(), validateMobile(), validatePassword(), validateConfirmPassword(), validateCourse(), validateTerms()].every(Boolean);
      if (!valid) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      byId("summaryName").textContent = controls.fullName.value;
      byId("summaryStudentNumber").textContent = controls.studentNumber.value;
      byId("summaryEmail").textContent = controls.email.value;
      byId("summaryMobileNumber").textContent = controls.mobileNumber.value;
      byId("summaryCourse").textContent = controls.course.value;
      successMessage.textContent = "Registration details validated successfully!";
      summary.hidden = false;
    });

    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        Object.keys(errors).forEach(function (key) { setError(key, ""); });
        passwordFeedback.textContent = "";
        passwordFeedback.classList.remove("is-valid");
        successMessage.textContent = "";
        summary.hidden = true;
        ["summaryName", "summaryStudentNumber", "summaryEmail", "summaryMobileNumber", "summaryCourse"].forEach(function (id) { byId(id).textContent = ""; });
      }, 0);
    });
  });

  if (typeof window !== "undefined") {
    window.isValidStudentNumber = isValidStudentNumber;
    window.isValidPassword = isValidPassword;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
