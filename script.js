const year = document.getElementById("year");
const helloButton = document.getElementById("hello-button");
const helloMessage = document.getElementById("hello-message");
year.textContent = new Date().getFullYear();
helloButton.addEventListener("click", () => {
  helloMessage.textContent = "Hello from Miki — thanks for stopping by!";
});
