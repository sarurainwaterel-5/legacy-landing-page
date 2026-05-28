import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const leadsFilePath = path.join(__dirname, "leads.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Legacy Partners Lead API is running");
});

app.post("/api/leads", async (req, res) => {
  const lead = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  let existingLeads = [];

  try {
    const data = fs.readFileSync(leadsFilePath, "utf8");
    existingLeads = JSON.parse(data);
  } catch {
    existingLeads = [];
  }

  existingLeads.push(lead);

  try {
    fs.writeFileSync(leadsFilePath, JSON.stringify(existingLeads, null, 2));

    console.log("Lead saved successfully:");
    console.log(lead);

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFY_EMAIL,
        subject: "New Legacy Partners Life Insurance Lead",
        text: `
New Lead Submitted:

Name: ${lead.fullName}
Email: ${lead.email}
Phone: ${lead.phone}
Coverage Interest: ${lead.coverageInterest}
Age Range: ${lead.ageRange}
Source: ${lead.leadSource}
Submitted: ${lead.createdAt}
        `,
      });

      console.log("EMAIL SENT SUCCESSFULLY");
      console.log(info.response);
    } catch (emailError) {
      console.error("EMAIL FAILED:");
      console.error(emailError);
    }

    res.status(201).json({
      success: true,
      message: "Lead saved successfully",
      lead,
    });
  } catch (error) {
    console.error("Error saving lead:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save lead",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Legacy Partners API running on port ${PORT}`);
});
