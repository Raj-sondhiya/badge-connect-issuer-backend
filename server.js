import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.text({ type: "application/xml" }));

app.get("/", (req, res) => {
    res.send("✅ Badge Connect Backend is running successfully.");
});



// Generic proxy route for any BadgeCert operation
app.post("/api/badgecert", async (req, res) => {
    try {
        const response = await fetch("https://badgecert.com/bc/api", {
            method: "POST",
            headers: { "Content-Type": "application/xml" },
            body: req.body
        });

        const text = await response.text();
        res.type("application/xml").send(text);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


// ✅ NEW: Proxy badge image requests api for earner badge images
app.get("/api/badge-image/:badgeId", async (req, res) => {
    try {
        const { badgeId } = req.params;
        const url = `https://bcert.me/bc/html/img/badges/generated/badge-${badgeId}.png`;

        const imageResponse = await fetch(url);

        if (!imageResponse.ok) {
            return res.status(404).send("Badge image not found");
        }

        res.setHeader("Content-Type", "image/png");
        imageResponse.body.pipe(res);

    } catch (err) {
        console.error("Image Proxy Error:", err);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(3000, () => console.log("✅ Backend running on http://localhost:3000"));
