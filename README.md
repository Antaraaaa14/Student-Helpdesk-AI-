# 🎓 AI Student Helpdesk Assistant

### Smart, Simple and AI-Powered Student Support

An AI-powered student support platform designed to make college-related information more accessible through natural-language conversations. The application helps students ask questions, explore FAQs, receive relevant responses and access student support through an interactive dashboard.

---

## 🌐 Live Application

| Component | Deployed Link |
|---|---|
| **Frontend Application** | https://student-helpdesk-ai.vercel.app/ |
| **Backend API** | https://student-helpdesk-ai.onrender.com |

**Explore the application:** [AI Student Helpdesk Assistant](https://student-helpdesk-ai.vercel.app/)

---

## 📌 Project Overview

The AI Student Helpdesk Assistant is a web-based application developed to simplify communication between students and college support services.

Students often face difficulties finding accurate information about fees, attendance, examinations, assignments and other academic activities. This application provides a centralized platform where students can ask questions in natural language and receive relevant assistance.

By integrating AI capabilities and Prompt Engineering techniques, the system aims to understand student queries, generate context-aware responses and provide a smoother helpdesk experience.

---

## 🎯 Project Objectives

- Provide a centralized platform for student assistance.
- Make college-related information easier to access.
- Allow students to communicate using natural language.
- Generate relevant and understandable AI responses.
- Organize frequently asked questions into categories.
- Maintain a record of student queries.
- Support staff confirmation for college-specific information that requires verification.

---

## ✨ Key Features

### 1. AI-Powered Question Answering
Students can enter questions in natural language and receive relevant, conversational responses.

### 2. Smart Query Understanding
The application analyses student messages to understand their intent and determine the appropriate response.

### 3. FAQ Management
Students can explore frequently asked questions and access relevant information through the FAQ section.

### 4. Category-Based Navigation
Queries are organized into categories such as:
- Fees & Payments
- Attendance
- Assignments
- Examinations

### 5. Student Query History
Students can view their recent and previously submitted queries through the My Queries section.

### 6. Admin Dashboard & Analytics
The administrative dashboard provides an interface for reviewing and monitoring helpdesk activity.

### 7. Query Escalation
Queries requiring official college confirmation can be directed for staff review instead of generating unverified information.

### 8. Interactive User Interface
A clean, responsive and student-friendly interface with a pastel colour theme, intuitive navigation and interactive components.

---

## 🤖 AI Integration & Prompt Engineering

Prompt Engineering plays an important role in guiding how the AI assistant understands and responds to student messages.

The application uses structured instructions to guide the AI's behaviour.

**Important Prompt Engineering concepts:**

- **Role Definition:** Defines the AI as a Student Helpdesk Assistant.
- **Context Setting:** Provides the AI with the purpose and context of the application.
- **Clear Instructions:** Guides the AI on how to understand and respond to student queries.
- **Response Formatting:** Encourages clear, friendly and understandable answers.
- **Constraints:** Prevents the AI from inventing unverified college policies or official information.

### AI Response Approach

| Query Type | Expected Behaviour |
|---|---|
| Greetings | Provides a friendly welcome response |
| FAQ-related questions | Uses relevant approved FAQ information |
| General academic questions | Generates helpful educational explanations |
| Unclear questions | Asks the student for clarification |
| Unverified college-specific queries | Directs the query for staff confirmation when required |

---

## ⚙️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Frontend development and build tooling |
| Node.js | Backend runtime environment |
| Express.js | Backend API development |
| MongoDB | Database management |
| Google Gemini API | AI-powered query understanding and response generation |
| Antigravity | AI-assisted application development |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 🔄 Application Workflow

The application follows this general workflow:

1. Student opens the Student Helpdesk.
2. Student enters a question.
3. The backend receives and processes the query.
4. The AI analyses the query and identifies its intent.
5. Relevant FAQ information is retrieved when applicable.
6. Gemini generates an appropriate response based on the provided context and instructions.
7. Queries requiring official verification can be directed for staff confirmation.
8. The response is displayed to the student.
9. Query information is maintained in the student's history.

---

## 🏗️ Application Architecture

The application follows a frontend-backend-database architecture.

**Frontend:** React.js and Vite provide the user interface through which students interact with the helpdesk.

**Backend:** Node.js and Express.js handle application requests, API communication and backend processing.

**Database:** MongoDB is used for application data management.

**AI Integration:** Google Gemini API provides AI-powered language understanding and response generation.

---

## 🚀 Running the Project Locally

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd YOUR_PROJECT_FOLDER
```

### 3. Install Dependencies

Install the dependencies separately inside the frontend and backend directories:

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory and configure the required credentials and connection settings used by your application.

Typical configuration includes:

- MongoDB connection string
- Gemini API key
- Backend port

**Note:** Use the exact environment variable names expected by your backend code. Never upload API keys, passwords or database credentials to GitHub.

### 5. Start the Application

Run the backend and frontend using the development scripts defined in their respective `package.json` files.

Once both services are running, open the local frontend URL in your browser.

---

## 🔐 Security Considerations

- Keep API keys and database credentials private.
- Store sensitive configuration in environment variables.
- Avoid exposing private backend credentials in frontend code.
- Validate user input before processing requests.
- Use verified information for official college-related responses.

---

## 🔮 Future Enhancements

- Multilingual student support.
- Improved AI response personalization.
- More advanced query classification.
- Enhanced admin analytics and reporting.
- Additional FAQ management capabilities.
- Improved query tracking and staff review workflows.

---

## 🎓 Project Significance

The AI Student Helpdesk Assistant demonstrates how Artificial Intelligence and Prompt Engineering can be integrated into a practical student-support application.

It combines conversational AI, structured prompting, web development and database management to create a centralized and accessible helpdesk experience.

---

## 👩‍💻 Developed By

**Antara Palwankar**

B.Tech – Computer Science and Engineering

**Project:** AI Student Helpdesk Assistant

---

### ⭐ Making Student Support Smarter with AI

If you find this project interesting, feel free to explore the live application using the links provided above.
