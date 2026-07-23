document.addEventListener("DOMContentLoaded", function () {
  const coachState = {
    currentQuestion: 0,
    score: 0,
    answers: []
  };

  const questions = [
    {
      question: "რამდენი ხანია გაყიდვებში მუშაობ?",
      answers: [
        { text: "ჯერ არ მიმუშავია", score: 1 },
        { text: "1 წლამდე", score: 2 },
        { text: "1–3 წელი", score: 3 },
        { text: "3 წელზე მეტი", score: 4 }
      ]
    },
    {
      question: "რა არის შენთვის ყველაზე რთული გაყიდვებში?",
      answers: [
        { text: "კლიენტის დაინტერესება", score: 1 },
        { text: "ფასზე წინააღმდეგობის გადალახვა", score: 2 },
        { text: "გარიგების დახურვა", score: 3 },
        { text: "სტაბილურად ლიდების მოძიება", score: 4 }
      ]
    }
  ];

  const button = document.getElementById("team4CoachButton");
  const windowBox = document.getElementById("team4CoachWindow");
  const closeButton = document.getElementById("team4CoachClose");
  const content = document.getElementById("team4CoachContent");

  if (!button || !windowBox || !closeButton || !content) {
    console.error("Team4 Coach-ის ელემენტები ვერ მოიძებნა");
    return;
  }

  windowBox.style.display = "none";

  function showStartScreen() {
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
  }

  function showQuestion() {
    const currentQuestion = questions[coachState.currentQuestion];

    if (!currentQuestion) {
      showResult();
      return;
    }

    const answerButtons = currentQuestion.answers
      .map(function (answer, index) {
        return `
          <button
            type="button"
            class="coach-answer"
            data-answer-index="${index}"
            style="
              width: 100%;
              padding: 12px;
              margin-bottom: 8px;
              border: 1px solid #dddddd;
              border-radius: 10px;
              background: white;
              color: #111111;
              font-weight: 600;
              cursor: pointer;
              text-align: left;
            "
          >
            ${answer.text}
          </button>
        `;
      })
      .join("");

    content.innerHTML = `
      <p style="margin-bottom: 8px; font-size: 13px; color: #777777;">
        კითხვა ${coachState.currentQuestion + 1} / ${questions.length}
      </p>

      <p style="margin-bottom: 15px; font-weight: 700;">
        ${currentQuestion.question}
      </p>

      ${answerButtons}
    `;
  }

  function showResult() {
    let title = "";
    let description = "";

    if (coachState.score <= 3) {
      title = "დამწყები დონე";
      description =
        "შენთვის მნიშვნელოვანია გაყიდვების საფუძვლების, კლიენტთან კომუნიკაციისა და სწორი კითხვების დასმის განვითარება.";
    } else if (coachState.score <= 6) {
      title = "განვითარებადი დონე";
      description =
        "შენ უკვე გაქვს გარკვეული გამოცდილება, თუმცა შედეგის გასაზრდელად საჭიროა წინააღმდეგობებთან მუშაობისა და დახურვის ტექნიკების გაძლიერება.";
    } else {
      title = "გამოცდილი დონე";
      description =
        "შენ გაქვს კარგი საფუძველი. შემდეგი ეტაპია სისტემური ლიდების გენერაცია, მაღალი კონვერსია და გაყიდვების სტაბილური ზრდა.";
    }

    content.innerHTML = `
      <p style="margin-bottom: 8px; font-size: 13px; color: #777777;">
        შეფასება დასრულებულია
      </p>

      <p style="margin-bottom: 10px; font-size: 20px; font-weight: 800;">
        ${title}
      </p>

      <p style="margin-bottom: 15px; line-height: 1.5;">
        ${description}
      </p>

      <p style="margin-bottom: 15px; font-weight: 700;">
        შენი ქულა: ${coachState.score}
      </p>

      <button
        id="restartCoachTest"
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
        თავიდან დაწყება
      </button>
    `;

    console.log("Team4 Coach პასუხები:", coachState.answers);
  }

  showStartScreen();

  button.addEventListener("click", function () {
    windowBox.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    windowBox.style.display = "none";
  });

  content.addEventListener("click", function (event) {
    if (event.target.id === "startCoachTest") {
      coachState.currentQuestion = 0;
      coachState.score = 0;
      coachState.answers = [];

      showQuestion();
      return;
    }

    if (event.target.classList.contains("coach-answer")) {
      const answerIndex = Number(event.target.dataset.answerIndex);
      const currentQuestion = questions[coachState.currentQuestion];
      const selectedAnswer = currentQuestion.answers[answerIndex];

      if (!selectedAnswer) {
        return;
      }

      coachState.score += selectedAnswer.score;

      coachState.answers.push({
        question: currentQuestion.question,
        answer: selectedAnswer.text,
        score: selectedAnswer.score
      });

      coachState.currentQuestion += 1;

      showQuestion();
      return;
    }

    if (event.target.id === "restartCoachTest") {
      coachState.currentQuestion = 0;
      coachState.score = 0;
      coachState.answers = [];

      showQuestion();
    }
  });
});
