document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("team4CoachButton");
  const windowBox = document.getElementById("team4CoachWindow");
  const closeButton = document.getElementById("team4CoachClose");
  const content = document.getElementById("team4CoachContent");

  if (!button || !windowBox || !closeButton || !content) {
    console.error("Team4 Coach-ის ელემენტები ვერ მოიძებნა");
    return;
  }

  windowBox.style.display = "none";

  content.innerHTML = `
    <p style="margin-bottom: 12px; font-weight: 700;">
      გამარჯობა 👋 მე ვარ Team4 Coach.
    </p>

    <p style="margin-bottom: 15px;">
      დაგეხმარები შეაფასო შენი გაყიდვების დონე.
    </p>

    <button
      id="startCoachTest"
      type="button"
      style="
        width: 100%;
        padding: 13px;
        border: none;
        border-radius: 10px;
        background: #ef1b13;
        color: white;
        font-weight: 700;
        cursor: pointer;
      "
    >
      დაიწყე შეფასება
    </button>
  `;

  button.addEventListener("click", function () {
    windowBox.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    windowBox.style.display = "none";
  });

  content.addEventListener("click", function (event) {
    if (event.target.id === "startCoachTest") {
      content.innerHTML = `
        <p style="margin-bottom: 10px; font-weight: 700;">
          პირველი კითხვა
        </p>

        <p style="margin-bottom: 15px;">
          რამდენი ხანია გაყიდვებში მუშაობ?
        </p>

        <button type="button" class="coach-answer">
          ჯერ არ მიმუშავია
        </button>

        <button type="button" class="coach-answer">
          1 წლამდე
        </button>

        <button type="button" class="coach-answer">
          1–3 წელი
        </button>

        <button type="button" class="coach-answer">
          3 წელზე მეტი
        </button>
      `;

      return;
    }

    if (event.target.classList.contains("coach-answer")) {
      const selectedAnswer = event.target.innerText;

      content.innerHTML = `
        <p style="margin-bottom: 10px; font-weight: 700;">
          მეორე კითხვა
        </p>

        <p style="margin-bottom: 15px;">
          რა არის შენთვის ყველაზე რთული გაყიდვებში?
        </p>

        <button type="button" class="coach-answer">
          კლიენტის დაინტერესება
        </button>

        <button type="button" class="coach-answer">
          ფასზე წინააღმდეგობის გადალახვა
        </button>

        <button type="button" class="coach-answer">
          გარიგების დახურვა
        </button>

        <button type="button" class="coach-answer">
          სტაბილურად ლიდების მოძიება
        </button>
      `;

      console.log("არჩეული პასუხი:", selectedAnswer);
    }
  });
});
