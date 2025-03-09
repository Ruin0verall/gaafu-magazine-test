async function testAPI() {
  try {
    // Create category
    console.log("Creating category...");
    const categoryResponse = await fetch(
      "http://localhost:5000/api/categories",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "News",
          description: "Latest news and updates",
        }),
      }
    );

    const category = await categoryResponse.json();
    console.log("Category created:", category);

    // Create article
    console.log("\nCreating article...");
    const articleResponse = await fetch("http://localhost:5000/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "First Article",
        content: "This is my first article content",
        image_url: "https://example.com/image.jpg",
        category_id: category.id, // Using the ID from the created category
      }),
    });

    const article = await articleResponse.json();
    console.log("Article created:", article);
  } catch (error) {
    console.error("Error:", error);
  }
}

testAPI();
