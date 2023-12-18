const API_URL = "https://wt.kpi.fei.tuke.sk/api/article?max=20&offset=";

//an array, defining the routes
export default [
    {
        //the part after '#' in the url (so-called fragment):
        hash: "home",
        ///id of the target html element:
        target: "router-view",
        //the function that returns content to be rendered to the target html element:
        getTemplate: (targetElm) =>
            (document.getElementById(targetElm).innerHTML =
                document.getElementById("template-home").innerHTML),
    },

    {
        hash: "articles",
        target: "router-view",
        getTemplate: fetchAndDisplayArticles,
    },

    {
        hash: "articleDetail",
        target: "router-view",
        getTemplate: fetchAndDisplayArticleDetail,
    },

    {
        hash: "visitorOpinions",
        target: "router-view",
        getTemplate: (targetElm) =>
            (document.getElementById(targetElm).innerHTML =
                document.getElementById("template-visitorOpinions").innerHTML),
    },

    {
        hash: "addOpinion",
        target: "router-view",
        getTemplate: (targetElm) =>
            (document.getElementById(targetElm).innerHTML =
                document.getElementById("template-addOpinion").innerHTML),
    },
];

function createHtml4Article(targetElm, current, totalCount) {
    current = parseInt(current);
    totalCount = parseInt(totalCount);
    const data4rendering = {
        currPage: current,
        pageCount: totalCount,
    };

    if (current > 1) {
        data4rendering.prevPage = current - 1;
    }

    if (current < totalCount) {
        data4rendering.nextPage = current + 1;
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-articles").innerHTML,
        data4rendering
    );
}

function fetchAndDisplayArticles(targetElm, current) {
    const offset = (current - 1) * 20; // Adjust offset based on the current page
    const apiUrl = `https://wt.kpi.fei.tuke.sk/api/article?max=20&offset=${offset}`;

    function reqListener() {
        if (this.status == 200) {
            const responseData = JSON.parse(this.responseText);

            // Calculate pageCount based on the max value and total count
            const pageCount = Math.ceil(responseData.meta.totalCount / 20);

            // Set currPage, pageCount, and articles in the data for rendering
            const data4rendering = {
                currPage: parseInt(current),
                pageCount: pageCount,
                articles: responseData.articles,
                prevPage: parseInt(current) > 1 ? parseInt(current) - 1 : null,
                nextPage:
                    parseInt(current) < pageCount
                        ? parseInt(current) + 1
                        : null,
            };

            // Render the template with the updated data
            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-articles").innerHTML,
                data4rendering
            );
        } else {
            const errMessage = `ERROR in function fetchAndDisplayArticles: ${this.statusText}`;
            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-articles-error").innerHTML,
                { errMessage }
            );
        }
    }

    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", apiUrl, true);
    ajax.send();
}

// async function fetchAndDisplayArticles(targetElm, current) {
//     let currentNum = parseInt(current);

//     try {
//         const response = await fetch(
//             `${API_URL}/paginated-data?page=${currentNum}`
//         );
//         const data = await response.json();

//         document.getElementById(targetElm).innerHTML = Mustache.render(
//             document.getElementById("template-articles").innerHTML,
//             {
//                 articles: data.data,
//                 currPage: currentNum,
//                 pageCount: data.pagination.totalPages,
//                 prevPage: currentNum - 1 > 0 ? currentNum - 1 : null,
//                 nextPage:
//                     currentNum + 1 <= data.pagination.totalPages
//                         ? currentNum + 1
//                         : null,
//             }
//         );
//     } catch (e) {
//         alert(`Error: ${e.message}`);
//     }
// }

async function fetchAndDisplayArticleDetail(targetElm, id) {
    try {
        const response = await fetch(`${API_URL}/articleDetail?id=${id}`);
        const articleDetail = await response.json();
        console.log(articleDetail);

        document.getElementById(targetElm).innerHTML = Mustache.render(
            document.getElementById("template-articleDetail").innerHTML,
            articleDetail
        );

        // Add Event Listener for Edit Button
        document
            .getElementById("article-edit")
            .addEventListener("click", () => {
                const descriptionElm = document.getElementById(
                    "article-description"
                );
                const description = descriptionElm.innerText;
                descriptionElm.innerHTML = `<textarea id="edit-description">${description}</textarea><button id="save-edit">Save</button>`;

                // Add Event Listener for Save Button
                document
                    .getElementById("save-edit")
                    .addEventListener("click", () => {
                        const editedDescription =
                            document.getElementById("edit-description").value;
                        saveArticleDescription(id, editedDescription)
                            .then((updatedArticle) => {
                                console.log(updatedArticle);
                                // Handle the updated article here
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                    });
            });
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
}

async function saveArticleDescription(id, description) {
    const url = `${API_URL}/editArticle`;
    const data = { id: parseInt(id), description }; // Ensure 'id' is an integer

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return response.json();
}

// async function deleteArticle() {
//     // DELETE request using fetch with async/await
//     const element = document.getElementById("article-delete");
//     await fetch(`${API_URL}/deleteArticle`, { method: "DELETE" });
//     element.innerHTML = "Delete successful";
// }
