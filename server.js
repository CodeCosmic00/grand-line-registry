/********************************************************************************
* WEB322 - Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Sandesh Adhikari
* Student ID: 189503238
* Date: 2026-03-11
*
********************************************************************************/

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const crewMembers = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    role: "Captain",
    bounty: 3000000000,
    devilFruit: "Hito Hito no Mi, Model: Nika",
    status: "active"
  },
  {
    id: 2,
    name: "Roronoa Zoro",
    role: "Swordsman",
    bounty: 1111000000,
    devilFruit: "None",
    status: "active"
  },
  {
    id: 3,
    name: "Nami",
    role: "Navigator",
    bounty: 366000000,
    devilFruit: "None",
    status: "active"
  },
  {
    id: 4,
    name: "Usopp",
    role: "Sniper",
    bounty: 500000000,
    devilFruit: "None",
    status: "active"
  },
  {
    id: 5,
    name: "Vinsmoke Sanji",
    role: "Cook",
    bounty: 1032000000,
    devilFruit: "None",
    status: "active"
  },
  {
    id: 6,
    name: "Tony Tony Chopper",
    role: "Doctor",
    bounty: 1000,
    devilFruit: "Hito Hito no Mi",
    status: "inactive"
  },
  {
    id: 7,
    name: "Nico Robin",
    role: "Archaeologist",
    bounty: 930000000,
    devilFruit: "Hana Hana no Mi",
    status: "active"
  },
  {
    id: 8,
    name: "Franky",
    role: "Shipwright",
    bounty: 394000000,
    devilFruit: "None",
    status: "active"
  },
  {
    id: 9,
    name: "Brook",
    role: "Musician",
    bounty: 383000000,
    devilFruit: "Yomi Yomi no Mi",
    status: "active"
  },
  {
    id: 10,
    name: "Jinbe",
    role: "Helmsman",
    bounty: 1100000000,
    devilFruit: "None",
    status: "active"
  }
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Task 2.1: Request Logger middleware
app.use((req, res, next) => {
  const logString = `Request from: ${req.get("user-agent")} at ${new Date().toString()}`;
  console.log(logString);
  req.log = logString;
  next();
});

// Task 2.2: Route-restricting middleware
function verifyBounty(req, res, next) {
  const result = Math.floor(Math.random() * 2);

  if (result === 1) {
    next();
  } else {
    res.status(403).send("403 - The Marines have blocked your path. Turn back.");
  }
}

app.get("/", (req, res) => {
  res.render("index", { crew: crewMembers });
});

app.get("/crew", (req, res) => {
  res.render("crew", { crew: crewMembers });
});

app.get("/recruit", (req, res) => {
  res.render("recruit", {
    errors: [],
    formData: {},
    successMessage: null
  });
});

app.post("/recruit", (req, res) => {
  const { applicantName, skill, role, message, sea, agreeTerms } = req.body;
  const errors = [];

  if (!applicantName || !applicantName.trim()) {
    errors.push("Your Name is required.");
  }

  if (!skill || !skill.trim()) {
    errors.push("Special Skill is required.");
  }

  if (!role || role === "Select a role") {
    errors.push("Please select a desired role.");
  }

  if (!message || !message.trim()) {
    errors.push("Please explain why Luffy should let you join.");
  }

  if (!sea) {
    errors.push("Please choose your preferred sea.");
  }

  if (!agreeTerms) {
    errors.push("You must understand the risks of the Grand Line.");
  }

  if (errors.length > 0) {
    return res.render("recruit", {
      errors,
      formData: req.body,
      successMessage: null
    });
  }

  const nextId =
    crewMembers.length > 0
      ? Math.max(...crewMembers.map((member) => member.id)) + 1
      : 1;

  crewMembers.push({
    id: nextId,
    name: applicantName.trim(),
    role: role,
    bounty: 0,
    devilFruit: skill.trim(),
    status: "pending"
  });

  res.render("recruit", {
    errors: [],
    formData: {},
    successMessage: `${applicantName.trim()} has submitted a recruit application successfully!`
  });
});

app.get("/log-pose", verifyBounty, (req, res) => {
  res.render("logPose", {
    crew: crewMembers,
    log: req.log
  });
});

app.get("/error-test", (req, res, next) => {
  next(new Error("Engine malfunction!"));
});

// Task 2.3: 404 Handler
app.use((req, res) => {
  res.status(404).render("404", {
    message: "404 - We couldn't find what you're looking for on the Grand Line."
  });
});

// Task 2.4: Error-handling middleware
app.use((err, req, res, next) => {
  res
    .status(500)
    .send(`500 - Something went wrong on the Thousand Sunny: ${err.message}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});