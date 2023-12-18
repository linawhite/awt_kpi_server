// window.addEventListener("load", (event) => {
//     displayFeedback();
// });

window.addEventListener("hashchange", function () {
    if (window.location.hash === "#yourRelevantRoute") {
        displayFeedback();
    }
});

function formHandler() {
    // document
    //     .getElementById("feedback-form")
    //     .addEventListener("submit", function (event) {
    //         event.preventDefault();

    //check

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const imgLink = document.getElementById("imageURL").value;
    const opinion = document.getElementById("opinion").value;

    if (
        name.length <= 1 ||
        email.length <= 5 ||
        imgLink.length <= 6 ||
        opinion.length < 10
    ) {
        alert("Fill out the form!!!");
    } else {
        const occupationButtons = document.querySelectorAll(
            'input[name="occupation"]'
        );
        let selectedOccupation;

        for (const occupation of occupationButtons) {
            if (occupation.checked) {
                selectedOccupation = occupation.value;
                break;
            }
        }

        const formData = {
            name: name,
            email: email,
            imgLink: imgLink,
            opinion: opinion,
            occupation: selectedOccupation,
        };

        saveFormData(formData);

        alert("success");

        if (JSON.parse(localStorage.getItem("formData")) < 4) {
            const userData = JSON.parse(localStorage.getItem("formData")) || [];
            const feedbackContainer = document.querySelector(".user-info");
            console.log("I am into");
            feedbackContainer.innerHTML = ""; // Clear existing content

            for (let i = 0; i < 4; i++) {
                const user = userData[i];
                const template = `
                <div class="user-feedback">
                    <h1>{{name}}, {{occupation}}</h1>
                    <p>{{opinion}}</p>
                </div>
            `;
                const rendered = mustache.render(template, user);
                feedbackContainer.innerHTML += rendered;
            }
        }
    }

    // });
}

function saveFormData(formData) {
    const storedFormData = JSON.parse(localStorage.getItem("formData")) || [];
    storedFormData.push(formData);
    localStorage.setItem("formData", JSON.stringify(storedFormData));
}

function displayFeedback() {
    const userData = JSON.parse(localStorage.getItem("formData")) || [];
    const feedbackContainer = document.querySelector(".user-info");
    console.log("I am into");
    feedbackContainer.innerHTML = ""; // Clear existing content

    for (let i = 0; i < 4; i++) {
        const user = userData[i];
        const template = `
                <div class="user-feedback">
                    <h1>{{name}}, {{occupation}}</h1>
                    <p>{{opinion}}</p>
                </div>
            `;
        const rendered = mustache.render(template, user);
        feedbackContainer.innerHTML += rendered;
    }
}
