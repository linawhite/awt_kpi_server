const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Read data from data.json file
const dataPath = path.join(__dirname, "data.json");
const rawData = fs.readFileSync(dataPath);
const jsonData = JSON.parse(rawData);
const sampleData = jsonData.articles;
// [
//     {
//       title: 'The Quantum Leap in Artificial Intelligence',
//       author: 'Alexandra Quantum',
//       image: 'https://picsum.photos/1080/720',
//       id: 1,
//       comments: [ [Object], [Object], [Object] ],
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo elit auctor, sollicitudin lacus ut, vestibulum enim. Aenean id velit massa. Nunc mattis quam blandit ipsum pharetra, vitae consectetur libero porttitor. Aliquam venenatis est nec dui tristique, eget dictum eros pharetra. Phasellus euismod justo eget massa gravida, sit amet aliquam purus venenatis. Curabitur mauris mi, aliquet non auctor eget, consequat vitae elit. Nulla pharetra ultrices dolor eget rutrum. Pellentesque rhoncus augue velit, vitae rutrum quam malesuada sed. Vestibulum ac lobortis tortor, at pulvinar diam. Morbi nec ultricies mi. Aenean varius, neque id commodo interdum, mauris leo auctor nulla, eu tristique massa urna sed diam. Donec congue nibh at lectus condimentum, eu vulputate quam fringilla. Nulla tempus eget nisi eu maximus. Phasellus semper mi eget erat tincidunt, vel tincidunt turpis placerat. Suspendisse potenti.'
//     },
//     ...
// ]

const itemsPerPage = 20;

// fetch("http://localhost:3000/deleteArticle?id=1", { method: "DELETE" }).then(res => res.json()).then(data => console.log(data))

app.post("/editArticle", (req, res) => {
    const { id, title, author, description, image } = req.body;

    // Parse 'id' as integer
    const articleId = parseInt(id);

    const article = sampleData.find((artc) => artc.id === articleId);

    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }

    article.title = title || article.title;
    article.author = author || article.author;
    article.description = description || article.description;
    article.image = image || article.image;

    res.json(article);
});

app.post("/editComment", (req, res) => {
    // Extract article 'id', comment 'id', and new comment 'text' from the request body
    const { articleId, commentId, text, name } = req.body;

    // Find the article with the given ID
    const article = sampleData.find((art) => art.id === articleId);

    // If the article is not found, return a 404 error
    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }

    // Find the comment with the given ID
    const comment = article.comments.find((cmt) => cmt.id === commentId);

    // If the comment is not found, return a 404 error
    if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
    }

    // Update the comment text
    comment.text = text;
    comment.name = name;

    // Respond with the updated article data
    res.json(article);
});

app.delete("/deleteArticle", (req, res) => {
    // Extract 'id' parameter from the request
    const id = parseInt(req.query.id);

    // Find the index of the article with the given ID
    const articleIndex = sampleData.findIndex((artc) => artc.id === id);

    // If the article is not found, return a 404 error
    if (articleIndex === -1) {
        return res.status(404).json({ error: "Article not found" });
    }

    // Remove the article from the array
    sampleData.splice(articleIndex, 1);

    // Respond with a success message
    res.json({ message: `Article with ID ${id} deleted successfully.` });
});

app.get("/articleDetail", (req, res) => {
    // Extract 'id' parameter from the request
    const id = parseInt(req.query.id);

    // Find the article with the given ID
    const article = sampleData.find((artc) => artc.id === id);

    // If the article is not found, return a 404 error
    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }

    // Respond with the modified article data
    res.json(article);
});

app.get("/paginated-data", (req, res) => {
    // Extract 'page' parameter from the request
    const page = parseInt(req.query.page) || 1; // Default to page 1 if 'page' is not provided

    // Calculate 'from' and 'to' values based on the requested page
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Validate input values to ensure 'from' is less than or equal to 'to'
    if (from > to) {
        return res
            .status(400)
            .json({ error: "'from' must be less than or equal to 'to'" });
    }

    // Paginate the data based on the 'from' and 'to' values
    const paginatedData = sampleData
        .slice(from, to + 1)
        .map(({ title, author, image, id }) => ({ title, author, image, id }));

    // Get pagination metadata
    const totalItems = sampleData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = page;

    // Respond with the paginated data and pagination metadata
    res.json({
        data: paginatedData,
        pagination: {
            totalItems,
            totalPages,
            currentPage,
            itemsPerPage,
        },
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
