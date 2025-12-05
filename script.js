document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll(".paper");
  papers.forEach(p => new Paper(p));
});
