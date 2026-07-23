document.addEventListener("DOMContentLoaded", function () {
  const CONTACT_SECTION_ID = "contact";

  const coachState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    dimensionScores: {},
    resultProfile: "",
    resultDescription: "",
    strengths: [],
    developmentAreas: [],
    overallPercentage: 0,
    contact: {
      name: "",
      phone: "",
      email: ""
    }
  };

  const questions = [
    {
      dimension: "discovery",
      dimensionName: "კლიენტის გაგება",
      question:
        "საუბრის დასაწყისში როგორ იგებ, რეალურად რა სჭირდება კლიენტს?",
      answers: [
        {
          text: "პირდაპირ პროდუქტს ვთავაზობ",
          score: 0
        },
        {
          text: "ერთ-ორ ზოგად კითხვას ვსვამ",
          score: 1
        },
        {
          text: "ვაზუსტებ მიზანსა და მოლოდინს",
          score: 2
        },
        {
          text:
            "სისტემურად ვიკვლევ მიზანს, მიზეზსა და გადაწყვეტილების კრიტერიუმებს",
          score: 3
        }
      ]
    },
    {
      dimension: "discovery",
      dimensionName: "კლიენტის გაგება",
      question:
        "რამდენად ხშირად ეძებ კლიენტის რეალურ ტკივილს და პრობლემის მიზეზს?",
      answers: [
        {
          text: "თითქმის არასდროს",
          score: 0
        },
        {
          text: "მხოლოდ მაშინ, როცა თავად ამბობს",
          score: 1
        },
        {
          text: "ხშირად ვაზუსტებ პრობლემას",
          score: 2
        },
        {
          text:
            "ყოველთვის ვარკვევ ტკივილს, გავლენასა და სასურველ შედეგს",
          score: 3
        }
      ]
    },
    {
      dimension: "discovery",
      dimensionName: "კლიენტის გაგება",
      question:
        "შეთავაზებამდე რამდენად კარგად ადგენ, ვინ და როგორ იღებს საბოლოო გადაწყვეტილებას?",
      answers: [
        {
          text: "ამას არ ვაზუსტებ",
          score: 0
        },
        {
          text: "ზოგჯერ ვეკითხები",
          score: 1
        },
        {
          text: "უმეტესად ვიცი გადაწყვეტილების მიმღები",
          score: 2
        },
        {
          text:
            "ვარკვევ გადაწყვეტილების მიმღებს, კრიტერიუმებსა და ვადას",
          score: 3
        }
      ]
    },
    {
      dimension: "value",
      dimensionName: "ღირებულების გაყიდვა",
      question:
        "რაზე აგებ ძირითადად შენს გაყიდვების პრეზენტაციას?",
      answers: [
        {
          text: "პროდუქტის მახასიათებლების ჩამოთვლაზე",
          score: 0
        },
        {
          text: "ფასსა და ფასდაკლებაზე",
          score: 1
        },
        {
          text: "კლიენტისთვის მისაღებ სარგებელზე",
          score: 2
        },
        {
          text:
            "კლიენტის ტკივილის აღმოჩენასა და მის გადაწყვეტაზე",
          score: 3
        }
      ]
    },
    {
      dimension: "value",
      dimensionName: "ღირებულების გაყიდვა",
      question:
        "როგორ რეაგირებ, როცა კლიენტი ამბობს: „ძვირია“?",
      answers: [
        {
          text: "მაშინვე ფასდაკლებას ვთავაზობ",
          score: 0
        },
        {
          text:
            "ვცდილობ ფასის დაცვას, მაგრამ ხშირად მიჭირს",
          score: 1
        },
        {
          text: "ვუხსნი სარგებელსა და ღირებულებას",
          score: 2
        },
        {
          text:
            "ჯერ ვარკვევ წინააღმდეგობის მიზეზს და შემდეგ ღირებულებას მის საჭიროებას ვუკავშირებ",
          score: 3
        }
      ]
    },
    {
      dimension: "value",
      dimensionName: "ღირებულების გაყიდვა",
      question:
        "რამდენად მკაფიოდ შეგიძლია აუხსნა კლიენტს, რატომ უნდა აირჩიოს შენი შეთავაზება?",
      answers: [
        {
          text: "ძირითადად ფასით ვარწმუნებ",
          score: 0
        },
        {
          text:
            "ვყვები პროდუქტის ზოგად უპირატესობებს",
          score: 1
        },
        {
          text: "ვაჩვენებ კონკრეტულ სარგებელს",
          score: 2
        },
        {
          text:
            "კლიენტის სიტუაციაზე მორგებულ განსხვავებულ ღირებულებას ვაჩვენებ",
          score: 3
        }
      ]
    },
    {
      dimension: "closing",
      dimensionName: "გარიგების დახურვა",
      question:
        "რამდენად თავდაჯერებულად სთხოვ კლიენტს გადაწყვეტილების მიღებას?",
      answers: [
        {
          text: "იშვიათად ვთხოვ პირდაპირ",
          score: 0
        },
        {
          text: "ზოგჯერ ვცდილობ",
          score: 1
        },
        {
          text:
            "უმეტეს შემთხვევაში ვთავაზობ კონკრეტულ ნაბიჯს",
          score: 2
        },
        {
          text:
            "ყოველთვის ვირჩევ სწორ მომენტს და ვმართავ გადაწყვეტილების პროცესს",
          score: 3
        }
      ]
    },
    {
      dimension: "closing",
      dimensionName: "გარიგების დახურვა",
      question:
        "რას აკეთებ, როცა კლიენტი ამბობს: „დავფიქრდები“?",
      answers: [
        {
          text: "ვემშვიდობები და ველოდები",
          score: 0
        },
        {
          text:
            "ვთხოვ, მოგვიანებით დამიკავშირდეს",
          score: 1
        },
        {
          text:
            "ვაზუსტებ, კონკრეტულად რაზე უნდა დაფიქრდეს",
          score: 2
        },
        {
          text:
            "ვავლენ დაუმთავრებელ საკითხს და ვთანხმდებით კონკრეტულ შემდეგ ნაბიჯზე",
          score: 3
        }
      ]
    },
    {
      dimension: "closing",
      dimensionName: "გარიგების დახურვა",
      question:
        "რამდენად ხშირად ასრულებ შეხვედრას კონკრეტული შეთანხმებით?",
      answers: [
        {
          text:
            "ხშირად შეთანხმების გარეშე სრულდება",
          score: 0
        },
        {
          text:
            "ზოგჯერ ვთანხმდებით შემდეგ ნაბიჯზე",
          score: 1
        },
        {
          text:
            "უმეტესად მაქვს კონკრეტული შეთანხმება",
          score: 2
        },
        {
          text:
            "ყოველთვის ფიქსირდება პასუხისმგებელი, მოქმედება და ვადა",
          score: 3
        }
      ]
    },
    {
      dimension: "pipeline",
      dimensionName: "ლიდები და Follow-up",
      question:
        "რამდენად სტაბილურია ახალი ლიდების მოძიების შენი სისტემა?",
      answers: [
        {
          text:
            "შემთხვევით ლიდებზე ვარ დამოკიდებული",
          score: 0
        },
        {
          text:
            "ზოგჯერ თავად ვეძებ ახალ კლიენტებს",
          score: 1
        },
        {
          text: "რამდენიმე მოქმედი წყარო მაქვს",
          score: 2
        },
        {
          text:
            "მაქვს სტაბილური, გაზომვადი და მრავალარხიანი სისტემა",
          score: 3
        }
      ]
    },
    {
      dimension: "pipeline",
      dimensionName: "ლიდები და Follow-up",
      question:
        "რამდენჯერ აკეთებ Follow-up-ს, თუ კლიენტი პირველივე საუბარში არ ყიდულობს?",
      answers: [
        {
          text: "აღარ ვუკავშირდები",
          score: 0
        },
        {
          text: "ერთხელ",
          score: 1
        },
        {
          text: "2–3-ჯერ",
          score: 2
        },
        {
          text:
            "წინასწარ დაგეგმილი სცენარით, შედეგამდე ან მკაფიო უარამდე",
          score: 3
        }
      ]
    },
    {
      dimension: "pipeline",
      dimensionName: "ლიდები და Follow-up",
      question:
        "რამდენად სისტემურად ითხოვ რეკომენდაციებს კმაყოფილი კლიენტებისგან?",
      answers: [
        {
          text: "არასდროს",
          score: 0
        },
        {
          text: "იშვიათად",
          score: 1
        },
        {
          text:
            "ზოგჯერ, წარმატებული გაყიდვის შემდეგ",
          score: 2
        },
        {
          text:
            "მაქვს რეკომენდაციის მოთხოვნის კონკრეტული პროცესი",
          score: 3
        }
      ]
    },
    {
      dimension: "systems",
      dimensionName: "გაყიდვების სისტემა",
      question:
        "როგორ მართავ კლიენტებისა და გარიგებების ინფორმაციას?",
      answers: [
        {
          text:
            "არ ვიწერ ან მხოლოდ მეხსიერებას ვეყრდნობი",
          score: 0
        },
        {
          text: "ტელეფონში ან ჩანაწერებში",
          score: 1
        },
        {
          text:
            "ცხრილში ან მარტივ სისტემაში",
          score: 2
        },
        {
          text:
            "CRM-ში, სტატუსებითა და შემდეგი მოქმედების თარიღებით",
          score: 3
        }
      ]
    },
    {
      dimension: "systems",
      dimensionName: "გაყიდვების სისტემა",
      question:
        "რამდენად ხშირად აანალიზებ გაყიდვების ძირითად მაჩვენებლებს?",
      answers: [
        {
          text: "არ ვაანალიზებ",
          score: 0
        },
        {
          text:
            "მხოლოდ მაშინ, როცა შედეგი ცუდია",
          score: 1
        },
        {
          text: "ყოველთვიურად",
          score: 2
        },
        {
          text:
            "ყოველკვირეულად ვზომავ ლიდებს, კონვერსიასა და დაკარგვის მიზეზებს",
          score: 3
        }
      ]
    },
    {
      dimension: "systems",
      dimensionName: "გაყიდვების სისტემა",
      question:
        "რამდენად ხშირად ასრულებ გაყიდვების გეგმას?",
      answers: [
        {
          text: "თითქმის არასდროს",
          score: 0
        },
        {
          text: "ზოგჯერ",
          score: 1
        },
        {
          text: "უმეტეს შემთხვევაში",
          score: 2
        },
        {
          text:
            "თითქმის ყოველთვის და ზუსტად ვიცი, რის ხარჯზე",
          score: 3
        }
      ]
    }
  ];

  const dimensionMeta = {
    discovery: {
      name: "კლიენტის გაგება",
      strength:
        "კლიენტის საჭიროებისა და გადაწყვეტილების მოტივების სწორად აღმოჩენა",
      development:
        "შეთავაზებამდე მეტი დრო დაუთმე ტკივილის, გავლენისა და გადაწყვეტილების კრიტერიუმების კვლევას."
    },
    value: {
      name: "ღირებულების გაყიდვა",
      strength:
        "შეთავაზების კლიენტის რეალურ სარგებელსა და პრობლემის გადაწყვეტასთან დაკავშირება",
      development:
        "პროდუქტის მახასიათებლების ნაცვლად უფრო მკაფიოდ აჩვენე შედეგი, რომელსაც კლიენტი მიიღებს."
    },
    closing: {
      name: "გარიგების დახურვა",
      strength:
        "საუბრის კონკრეტულ გადაწყვეტილებასა და შემდეგ ნაბიჯამდე მიყვანა",
      development:
        "ყოველი საუბარი დაასრულე კონკრეტული მოქმედებით, პასუხისმგებლითა და შეთანხმებული ვადით."
    },
    pipeline: {
      name: "ლიდები და Follow-up",
      strength:
        "ლიდების მოზიდვისა და კლიენტთან განმეორებითი კომუნიკაციის სისტემური მართვა",
      development:
        "შექმენი ლიდების რამდენიმე სტაბილური წყარო და წინასწარ დაგეგმილი Follow-up პროცესი."
    },
    systems: {
      name: "გაყიდვების სისტემა",
      strength:
        "CRM-ის, მაჩვენებლებისა და შედეგების ანალიზის გამოყენება",
      development:
        "დააფიქსირე ყველა კლიენტის სტატუსი, შემდეგი ნაბიჯი და ყოველკვირეულად გაზომე კონვერსია."
    }
  };

  const demoRecommendations = {
    discovery: {
      title: "კლიენტის გაგება",
      demo:
        "შემდეგ საუბარში პროდუქტის წარდგენამდე დაუსვი სამი კითხვა: რა უნდა შეიცვალოს, რატომ არის ეს მნიშვნელოვანი და რა მოხდება, თუ პრობლემა არ მოგვარდება."
    },
    value: {
      title: "ღირებულების გაყიდვა",
      demo:
        "ყოველი მახასიათებელი გადააქციე კლიენტის სარგებლად: არა „რას აკეთებს პროდუქტი“, არამედ „რას ცვლის ეს კონკრეტულად კლიენტისთვის“."
    },
    closing: {
      title: "გარიგების დახურვა",
      demo:
        "საუბრის ბოლოს არ დატოვო ბუნდოვანი პასუხი. შეთანხმდით ერთ კონკრეტულ ნაბიჯზე, პასუხისმგებელ ადამიანსა და შესრულების თარიღზე."
    },
    pipeline: {
      title: "ლიდები და Follow-up",
      demo:
        "აირჩიე სამი ლიდის წყარო და თითოეულზე დაისახე ყოველკვირეული აქტივობა. Follow-up-ისთვის წინასწარ მოამზადე მინიმუმ სამი განსხვავებული შეტყობინება."
    },
    systems: {
      title: "გაყიდვების სისტემა",
      demo:
        "ყველა აქტიურ კლიენტს დაუფიქსირე სტატუსი, ბოლო კომუნიკაცია და შემდეგი ნაბიჯის თარიღი. კვირის ბოლოს გაზომე თითოეული ეტაპის კონვერსია."
    },
    all: {
      title: "გაყიდვების სრული სისტემა",
      demo:
        "დახაზე გზა პირველი კონტაქტიდან დახურვამდე და თითოეულ ეტაპზე განსაზღვრე ერთი მოქმედება და ერთი გასაზომი მაჩვენებელი."
    }
  };

  const button =
    document.getElementById("team4CoachButton");

  const windowBox =
    document.getElementById("team4CoachWindow");

  const closeButton =
    document.getElementById("team4CoachClose");

  const content =
    document.getElementById("team4CoachContent");

  if (
    !button ||
    !windowBox ||
    !closeButton ||
    !content
  ) {
    console.error(
      "Team4 Coach-ის ელემენტები ვერ მოიძებნა"
    );
    return;
  }

  windowBox.style.display = "none";

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function resetCoach() {
    coachState.currentQuestion = 0;
    coachState.score = 0;
    coachState.answers = [];
    coachState.dimensionScores = {};
    coachState.resultProfile = "";
    coachState.resultDescription = "";
    coachState.strengths = [];
    coachState.developmentAreas = [];
    coachState.overallPercentage = 0;
    coachState.contact = {
      name: "",
      phone: "",
      email: ""
    };
  }

  function getDimensionPercentages() {
    const percentages = {};

    Object.keys(dimensionMeta).forEach(
      function (dimension) {
        const dimensionData =
          coachState.dimensionScores[dimension] || {
            score: 0,
            maximum: 0
          };

        percentages[dimension] =
          dimensionData.maximum > 0
            ? Math.round(
                (dimensionData.score /
                  dimensionData.maximum) *
                  100
              )
            : 0;
      }
    );

    return percentages;
  }

  function showStartScreen() {
    content.innerHTML = `
      <p
        style="
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: 900;
        "
      >
        გამარჯობა 👋 მე ვარ Team4 Coach
      </p>

      <p
        style="
          margin: 0 0 8px;
          line-height: 1.5;
          color: #444444;
        "
      >
        უპასუხე 15 პროფესიულ კითხვას და მიიღე შენი გაყიდვების პროფილის მოკლე დიაგნოსტიკა.
      </p>

      <p
        style="
          margin: 0 0 16px;
          font-size: 13px;
          color: #777777;
        "
      >
        საშუალო დრო: 3 წუთი
      </p>

      <button
        id="startCoachTest"
        type="button"
        style="
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #ef1b13;
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        "
      >
        შეფასების დაწყება
      </button>
    `;
  }

  function showQuestion() {
    const currentQuestion =
      questions[coachState.currentQuestion];

    if (!currentQuestion) {
      prepareResult();
      showContactForm();
      return;
    }

    const progress = Math.round(
      ((coachState.currentQuestion + 1) /
        questions.length) *
        100
    );

    const answerButtons =
      currentQuestion.answers
        .map(function (answer, index) {
          return `
            <button
              type="button"
              class="coach-answer"
              data-answer-index="${index}"
              style="
                width: 100%;
                padding: 13px;
                margin-bottom: 9px;
                border: 1px solid #e2e2e2;
                border-radius: 11px;
                background: #ffffff;
                color: #171717;
                font-size: 14px;
                font-weight: 600;
                line-height: 1.4;
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
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          color: #777777;
        "
      >
        <span>
          კითხვა
          ${coachState.currentQuestion + 1}
          /
          ${questions.length}
        </span>

        <span>${progress}%</span>
      </div>

      <div
        style="
          width: 100%;
          height: 6px;
          margin-bottom: 18px;
          border-radius: 10px;
          background: #eeeeee;
          overflow: hidden;
        "
      >
        <div
          style="
            width: ${progress}%;
            height: 100%;
            border-radius: 10px;
            background: #ef1b13;
            transition: width 0.25s ease;
          "
        ></div>
      </div>

      <p
        style="
          margin: 0 0 16px;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.45;
        "
      >
        ${currentQuestion.question}
      </p>

      ${answerButtons}
    `;
  }

  function prepareResult() {
    const percentages =
      getDimensionPercentages();

    const sortedDimensions =
      Object.entries(percentages).sort(
        function (first, second) {
          return second[1] - first[1];
        }
      );

    const strongestKey =
      sortedDimensions[0][0];

    const overallPercentage = Math.round(
      sortedDimensions.reduce(
        function (total, item) {
          return total + item[1];
        },
        0
      ) / sortedDimensions.length
    );

    if (overallPercentage < 35) {
      coachState.resultProfile =
        "განვითარების საწყისი პროფილი";

      coachState.resultDescription =
        "შენი პასუხები აჩვენებს, რომ გაყიდვების რამდენიმე ძირითადი ეტაპი ჯერ სისტემურ განვითარებას საჭიროებს. კარგი შედეგის მისაღებად მთავარი ამოცანაა საფუძვლების სწორად აწყობა.";
    } else if (overallPercentage < 60) {
      coachState.resultProfile =
        "პრაქტიკული გამყიდველის პროფილი";

      coachState.resultDescription =
        "შენ უკვე გაქვს გაყიდვების პრაქტიკული უნარები, თუმცა შედეგი ჯერ ყველა ეტაპზე ერთნაირად სტაბილური არ არის. ყველაზე დიდი ზრდა პროცესის სუსტი რგოლების გამყარებით მიიღება.";
    } else if (
      strongestKey === "discovery"
    ) {
      coachState.resultProfile =
        "კონსულტაციური გამყიდველის პროფილი";

      coachState.resultDescription =
        "შენი ძლიერი მხარე კლიენტის სიტუაციისა და საჭიროების გააზრებაა. ეს გაძლევს შესაძლებლობას შეთავაზება უფრო ზუსტად მოარგო რეალურ პრობლემას.";
    } else if (strongestKey === "value") {
      coachState.resultProfile =
        "ღირებულებაზე ორიენტირებული გამყიდველის პროფილი";

      coachState.resultDescription =
        "შენ კარგად აკავშირებ შეთავაზებას კლიენტის სარგებელსა და პრობლემის გადაწყვეტასთან. შემდეგი ნაბიჯია ამ უპირატესობის უფრო სისტემურად გამოყენება.";
    } else if (
      strongestKey === "closing"
    ) {
      coachState.resultProfile =
        "შედეგზე ორიენტირებული დამხურავის პროფილი";

      coachState.resultDescription =
        "შენი ძლიერი მხარე საუბრის კონკრეტულ გადაწყვეტილებამდე მიყვანაა. მაღალი შედეგისთვის მნიშვნელოვანია ეს უნარი სტაბილურ ლიდებსა და სწორ დიაგნოსტიკას დაეყრდნოს.";
    } else if (
      strongestKey === "pipeline"
    ) {
      coachState.resultProfile =
        "აქტიური გაყიდვების პროფილი";

      coachState.resultDescription =
        "შენ კარგად მუშაობ ლიდების მოძიებასა და განმეორებით კომუნიკაციაზე. შემდეგი ნაბიჯია თითოეული წყაროს ხარისხისა და კონვერსიის უფრო ზუსტად მართვა.";
    } else {
      coachState.resultProfile =
        "სისტემური გამყიდველის პროფილი";

      coachState.resultDescription =
        "შენი ძლიერი მხარე პროცესების, კლიენტების და შედეგების სისტემურად მართვაა. ეს კარგი საფუძველია პროგნოზირებადი და მასშტაბირებადი გაყიდვებისთვის.";
    }

    coachState.strengths =
      sortedDimensions
        .slice(0, 2)
        .map(function (item) {
          return dimensionMeta[item[0]].strength;
        });

    coachState.developmentAreas =
      sortedDimensions
        .slice(-2)
        .reverse()
        .map(function (item) {
          return {
            name:
              dimensionMeta[item[0]].name,
            text:
              dimensionMeta[item[0]]
                .development,
            key: item[0],
            percentage: item[1]
          };
        });

    coachState.overallPercentage =
      overallPercentage;
  }

  function showContactForm() {
    content.innerHTML = `
      <p
        style="
          margin: 0 0 7px;
          font-size: 12px;
          font-weight: 700;
          color: #777777;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        "
      >
        შეფასება დასრულებულია
      </p>

      <p
        style="
          margin: 0 0 9px;
          font-size: 21px;
          font-weight: 900;
        "
      >
        შენი დიაგნოსტიკა მზად არის
      </p>

      <p
        style="
          margin: 0 0 16px;
          line-height: 1.5;
          color: #444444;
        "
      >
        შეავსე ინფორმაცია და ნახე გაყიდვების პროფილი, ძლიერი მხარეები და განვითარების მთავარი მიმართულებები.
      </p>

      <input
        id="coachName"
        type="text"
        placeholder="სახელი და გვარი"
        autocomplete="name"
        style="
          width: 100%;
          padding: 13px;
          margin-bottom: 10px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 14px;
        "
      >

      <input
        id="coachPhone"
        type="tel"
        placeholder="ტელეფონის ნომერი"
        autocomplete="tel"
        style="
          width: 100%;
          padding: 13px;
          margin-bottom: 10px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 14px;
        "
      >

      <input
        id="coachEmail"
        type="email"
        placeholder="ელფოსტა"
        autocomplete="email"
        style="
          width: 100%;
          padding: 13px;
          margin-bottom: 12px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 14px;
        "
      >

      <button
        id="showCoachResult"
        type="button"
        style="
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 11px;
          background: #ef1b13;
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        "
      >
        ჩემი დიაგნოსტიკის ნახვა
      </button>

      <p
        id="coachFormError"
        style="
          display: none;
          margin: 10px 0 0;
          color: #ef1b13;
          font-size: 13px;
          font-weight: 600;
        "
      >
        შეავსე ყველა ველი სწორად
      </p>
    `;
  }

  function makeSkillBarsHTML(
    percentages
  ) {
    return Object.entries(percentages)
      .map(function (item) {
        const key = item[0];
        const percentage = item[1];

        return `
          <div style="margin-bottom: 11px;">
            <div
              style="
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 5px;
                font-size: 13px;
              "
            >
              <span style="font-weight: 700;">
                ${dimensionMeta[key].name}
              </span>

              <span style="font-weight: 800;">
                ${percentage}%
              </span>
            </div>

            <div
              style="
                width: 100%;
                height: 7px;
                border-radius: 10px;
                background: #e9e9e9;
                overflow: hidden;
              "
            >
              <div
                style="
                  width: ${percentage}%;
                  height: 100%;
                  border-radius: 10px;
                  background: #ef1b13;
                "
              ></div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function showFinalResult(name) {
    const percentages =
      getDimensionPercentages();

    const strengthsHTML =
      coachState.strengths
        .map(function (strength) {
          return `
            <li style="margin-bottom: 7px;">
              ${strength}
            </li>
          `;
        })
        .join("");

    const developmentHTML =
      coachState.developmentAreas
        .map(function (area) {
          return `
            <div
              style="
                padding: 11px 12px;
                margin-bottom: 8px;
                border: 1px solid #ffd8d5;
                border-radius: 10px;
                background: #fff8f7;
              "
            >
              <p
                style="
                  margin: 0 0 4px;
                  font-size: 13px;
                  font-weight: 900;
                "
              >
                ${area.name}
              </p>

              <p
                style="
                  margin: 0;
                  font-size: 13px;
                  line-height: 1.45;
                  color: #444444;
                "
              >
                ${area.text}
              </p>
            </div>
          `;
        })
        .join("");

    content.innerHTML = `
      <p
        style="
          margin: 0 0 6px;
          font-size: 11px;
          font-weight: 800;
          color: #777777;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        "
      >
        Team4 Coach-ის დიაგნოსტიკა
      </p>

      <p
        style="
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 700;
        "
      >
        ${escapeHTML(name)}, შენი პროფილია:
      </p>

      <p
        style="
          margin: 0 0 10px;
          font-size: 21px;
          font-weight: 900;
          line-height: 1.3;
        "
      >
        ${coachState.resultProfile}
      </p>

      <p
        style="
          margin: 0 0 14px;
          font-size: 14px;
          line-height: 1.5;
          color: #3f3f3f;
        "
      >
        ${coachState.resultDescription}
      </p>

      <div
        style="
          padding: 13px;
          margin-bottom: 10px;
          border: 1px solid #e7e7e7;
          border-radius: 11px;
          background: #fafafa;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 7px;
          "
        >
          <span
            style="
              font-size: 13px;
              font-weight: 800;
            "
          >
            საერთო მზაობა
          </span>

          <span
            style="
              font-size: 16px;
              font-weight: 900;
            "
          >
            ${coachState.overallPercentage}%
          </span>
        </div>

        <div
          style="
            width: 100%;
            height: 8px;
            border-radius: 10px;
            background: #e7e7e7;
            overflow: hidden;
          "
        >
          <div
            style="
              width: ${coachState.overallPercentage}%;
              height: 100%;
              border-radius: 10px;
              background: #ef1b13;
            "
          ></div>
        </div>
      </div>

      <details
        style="
          margin-bottom: 10px;
          padding: 12px 13px;
          border: 1px solid #e7e7e7;
          border-radius: 11px;
          background: white;
        "
      >
        <summary
          style="
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
          "
        >
          უნარების დეტალური შეფასება
        </summary>

        <div style="padding-top: 12px;">
          ${makeSkillBarsHTML(percentages)}
        </div>
      </details>

      <div
        style="
          padding: 13px;
          margin-bottom: 10px;
          border: 1px solid #e7e7e7;
          border-radius: 11px;
          background: white;
        "
      >
        <p
          style="
            margin: 0 0 8px;
            font-size: 14px;
            font-weight: 900;
          "
        >
          შენი ძლიერი მხარეები
        </p>

        <ul
          style="
            margin: 0;
            padding-left: 19px;
            font-size: 13px;
            line-height: 1.45;
          "
        >
          ${strengthsHTML}
        </ul>
      </div>

      <div style="margin-bottom: 12px;">
        <p
          style="
            margin: 0 0 8px;
            font-size: 14px;
            font-weight: 900;
          "
        >
          განვითარების პრიორიტეტები
        </p>

        ${developmentHTML}
      </div>

      <div
        style="
          padding: 13px;
          margin-bottom: 11px;
          border-radius: 11px;
          background: #f3f3f3;
        "
      >
        <p
          style="
            margin: 0 0 5px;
            font-size: 16px;
            font-weight: 900;
          "
        >
          რისი გაუმჯობესება გინდა?
        </p>

        <p
          style="
            margin: 0 0 10px;
            font-size: 12px;
            line-height: 1.4;
            color: #666666;
          "
        >
          აირჩიე მიმართულება და მიიღე მოკლე დემო რჩევა.
        </p>

        <select
          id="coachImprovementChoice"
          style="
            width: 100%;
            padding: 11px;
            border: 1px solid #d6d6d6;
            border-radius: 9px;
            background: white;
            box-sizing: border-box;
            font-size: 13px;
          "
        >
          <option value="">
            აირჩიე მიმართულება
          </option>

          <option value="discovery">
            კლიენტის გაგება
          </option>

          <option value="value">
            ღირებულების გაყიდვა
          </option>

          <option value="closing">
            გარიგების დახურვა
          </option>

          <option value="pipeline">
            ლიდები და Follow-up
          </option>

          <option value="systems">
            გაყიდვების სისტემა
          </option>

          <option value="all">
            მთელი პროცესის გაუმჯობესება
          </option>
        </select>

        <button
          id="showImprovementRecommendation"
          type="button"
          style="
            width: 100%;
            padding: 12px;
            margin-top: 9px;
            border: none;
            border-radius: 9px;
            background: #171717;
            color: white;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
          "
        >
          დემო რეკომენდაციის ნახვა
        </button>

        <p
          id="coachImprovementError"
          style="
            display: none;
            margin: 8px 0 0;
            color: #ef1b13;
            font-size: 12px;
            font-weight: 700;
          "
        >
          ჯერ აირჩიე მიმართულება
        </p>

        <div
          id="coachImprovementResult"
          style="
            display: none;
            margin-top: 10px;
          "
        ></div>
      </div>

      <button
        id="restartCoachTest"
        type="button"
        style="
          width: 100%;
          padding: 12px;
          border: 1px solid #d8d8d8;
          border-radius: 9px;
          background: white;
          color: #222222;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        "
      >
        შეფასების თავიდან გავლა
      </button>
    `;
  }

  function showDemoRecommendation(
    selectedValue
  ) {
    const recommendation =
      demoRecommendations[selectedValue];

    const resultBox =
      document.getElementById(
        "coachImprovementResult"
      );

    if (!recommendation || !resultBox) {
      return;
    }

    resultBox.style.display = "block";

    resultBox.innerHTML = `
      <div
        style="
          padding: 12px;
          border: 1px solid #e3e3e3;
          border-radius: 10px;
          background: white;
        "
      >
        <p
          style="
            margin: 0 0 6px;
            font-size: 13px;
            font-weight: 900;
          "
        >
          მოკლე დემო რჩევა —
          ${recommendation.title}
        </p>

        <p
          style="
            margin: 0 0 10px;
            font-size: 13px;
            line-height: 1.5;
            color: #3f3f3f;
          "
        >
          ${recommendation.demo}
        </p>

        <p
          style="
            margin: 0 0 10px;
            padding-top: 9px;
            border-top: 1px solid #eeeeee;
            font-size: 12px;
            line-height: 1.45;
            color: #666666;
          "
        >
          ეს არის რეკომენდაციის მცირე დემო ნაწილი. სრული პერსონალური ანალიზისა და სამოქმედო გეგმისთვის ჩაეწერე კონსულტაციაზე.
        </p>

        <button
          id="coachConsultationButton"
          type="button"
          style="
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 9px;
            background: #ef1b13;
            color: white;
            font-size: 13px;
            font-weight: 900;
            cursor: pointer;
          "
        >
          ჩაეწერე პერსონალურ კონსულტაციაზე
        </button>
      </div>
    `;
  }

  function goToContactForm() {
    windowBox.style.display = "none";

    const contactSection =
      document.getElementById(
        CONTACT_SECTION_ID
      );

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      window.history.replaceState(
        null,
        "",
        "#" + CONTACT_SECTION_ID
      );

      return;
    }

    window.location.hash =
      CONTACT_SECTION_ID;
  }

  showStartScreen();

  button.addEventListener(
    "click",
    function () {
      windowBox.style.display = "block";
    }
  );

  closeButton.addEventListener(
    "click",
    function () {
      windowBox.style.display = "none";
    }
  );

  content.addEventListener(
    "click",
    function (event) {
      if (
        event.target.id ===
        "startCoachTest"
      ) {
        resetCoach();
        showQuestion();
        return;
      }

      if (
        event.target.classList.contains(
          "coach-answer"
        )
      ) {
        const answerIndex = Number(
          event.target.dataset.answerIndex
        );

        const currentQuestion =
          questions[
            coachState.currentQuestion
          ];

        const selectedAnswer =
          currentQuestion.answers[
            answerIndex
          ];

        if (!selectedAnswer) {
          return;
        }

        coachState.score +=
          selectedAnswer.score;

        if (
          !coachState.dimensionScores[
            currentQuestion.dimension
          ]
        ) {
          coachState.dimensionScores[
            currentQuestion.dimension
          ] = {
            name:
              currentQuestion.dimensionName,
            score: 0,
            maximum: 0
          };
        }

        coachState.dimensionScores[
          currentQuestion.dimension
        ].score += selectedAnswer.score;

        coachState.dimensionScores[
          currentQuestion.dimension
        ].maximum += 3;

        coachState.answers.push({
          dimension:
            currentQuestion.dimensionName,
          question:
            currentQuestion.question,
          answer: selectedAnswer.text,
          score: selectedAnswer.score
        });

        coachState.currentQuestion += 1;

        showQuestion();
        return;
      }

      if (
        event.target.id ===
        "showCoachResult"
      ) {
        const nameInput =
          document.getElementById(
            "coachName"
          );

        const phoneInput =
          document.getElementById(
            "coachPhone"
          );

        const emailInput =
          document.getElementById(
            "coachEmail"
          );

        const errorMessage =
          document.getElementById(
            "coachFormError"
          );

        const name =
          nameInput.value.trim();

        const phone =
          phoneInput.value.trim();

        const email =
          emailInput.value.trim();

        const emailIsValid =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
          );

        const phoneIsValid =
          phone.replace(/\D/g, "").length >=
          8;

        if (
          !name ||
          !phone ||
          !email ||
          !emailIsValid ||
          !phoneIsValid
        ) {
          errorMessage.style.display =
            "block";
          return;
        }

        errorMessage.style.display =
          "none";

        coachState.contact = {
          name: name,
          phone: phone,
          email: email
        };

        console.log(
          "Team4 Coach ლიდი:",
          {
            name: name,
            phone: phone,
            email: email,
            overallPercentage:
              coachState.overallPercentage,
            profile:
              coachState.resultProfile,
            strengths:
              coachState.strengths,
            developmentAreas:
              coachState.developmentAreas,
            answers:
              coachState.answers
          }
        );

        showFinalResult(name);
        return;
      }

      if (
        event.target.id ===
        "showImprovementRecommendation"
      ) {
        const select =
          document.getElementById(
            "coachImprovementChoice"
          );

        const errorMessage =
          document.getElementById(
            "coachImprovementError"
          );

        const selectedValue =
          select.value;

        if (
          !demoRecommendations[
            selectedValue
          ]
        ) {
          errorMessage.style.display =
            "block";
          return;
        }

        errorMessage.style.display =
          "none";

        showDemoRecommendation(
          selectedValue
        );

        console.log(
          "არჩეული განვითარების მიმართულება:",
          {
            name:
              coachState.contact.name,
            phone:
              coachState.contact.phone,
            email:
              coachState.contact.email,
            improvementChoice:
              demoRecommendations[
                selectedValue
              ].title
          }
        );

        return;
      }

      if (
        event.target.id ===
        "coachConsultationButton"
      ) {
        goToContactForm();
        return;
      }

      if (
        event.target.id ===
        "restartCoachTest"
      ) {
        resetCoach();
        showQuestion();
      }
    }
  );
});
