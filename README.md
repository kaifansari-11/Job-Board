# JobBoard

A full-stack job board platform designed to connect job seekers with employers through a centralized system for job posting, candidate applications, profile management, and recruitment tracking.

**Live Demo:** https://job-board-4fp5.onrender.com

---

## Overview

JobBoard simplifies the hiring process by providing dedicated dashboards for Job Seekers, Employers, and Administrators. The platform enables employers to publish opportunities, manage applicants, and review resumes, while job seekers can build professional profiles, apply for jobs, and track application progress.

---

## Features

### Role-Based Authentication

* Secure user registration and login
* Separate dashboards for Job Seekers, Employers, and Administrators
* Password encryption using bcrypt
* Session-based authentication and authorization

### Job Seeker Features

* Browse and search job listings
* Filter jobs by location
* Apply directly with a cover letter
* Upload and manage resumes
* Upload profile avatars
* Track application status in real time
* Manage professional profile information

### Employer Dashboard

* Create and publish job listings
* Edit and delete job postings
* View applicant counts for each position
* Review candidate applications
* Download applicant resumes
* Update application statuses

### Application Management

* End-to-end application workflow
* Status tracking:

  * Pending
  * Reviewed
  * Accepted
  * Rejected
* Employer-controlled status updates

### Admin Dashboard

* Platform-wide statistics
* User management
* Job listing moderation
* Employer analytics
* Application monitoring
* Cascading deletion for data integrity

### File Uploads

* Cloudinary integration for file storage
* Profile avatar uploads
* PDF resume uploads
* Secure cloud-hosted media management

### Responsive User Interface

* Fully responsive design
* Mobile-friendly navigation
* Custom dark-mode user interface
* Modern dashboard experience

---

## Technology Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Backend        | Node.js, Express.js           |
| Frontend       | EJS, HTML5, CSS3              |
| Database       | TiDB Cloud (MySQL-Compatible) |
| Authentication | Express Session, bcrypt       |
| File Storage   | Cloudinary, Multer            |
| Deployment     | Render                        |

---

## Installation and Setup

### Prerequisites

* Node.js (v18 or higher)
* TiDB Cloud Account
* Cloudinary Account

### Installation

```bash
# Clone the repository
git clone https://github.com/kaifansari-11/job-board.git

# Navigate to the project directory
cd job-board

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Configure environment variables
# Add TiDB and Cloudinary credentials

# Start development server
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Database Configuration

1. Create a Serverless Cluster in TiDB Cloud.

2. Open the **Connect** section and obtain:

   * Host
   * Port
   * Username
   * Password

3. Create the required database tables.

4. Add database credentials to the `.env` file.

---


## Application Routes

| Method    | Route                                 | Description               |
| --------- | ------------------------------------- | ------------------------- |
| GET       | `/`                                   | Landing Page              |
| GET, POST | `/auth/register`                      | User Registration         |
| GET, POST | `/auth/login`                         | User Login                |
| GET       | `/auth/logout`                        | User Logout               |
| GET       | `/jobs`                               | Browse Job Listings       |
| GET, POST | `/apply/:jobId`                       | Apply for Job             |
| GET       | `/apply/my-applications`              | View Applications         |
| GET       | `/dashboard`                          | Employer Dashboard        |
| GET       | `/dashboard/applicants/:jobId`        | View Applicants           |
| POST      | `/dashboard/applicants/:appId/status` | Update Application Status |
| GET, POST | `/profile`                            | User Profile Management   |
| GET       | `/admin`                              | Administrative Dashboard  |

---

## Deployment

### Render

1. Push the repository to GitHub.
2. Create a new Web Service on Render.
3. Connect the GitHub repository.
4. Configure the service:

```text
Build Command: npm install
Start Command: node app.js
```

5. Add all required environment variables.
6. Deploy the application.

---

## Project Structure

```text
job-board/
├── config/
│   └── cloudinary.js
│
├── middleware/
│   └── isLoggedIn.js
│
├── routes/
│   ├── admin.js
│   ├── apply.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── jobs.js
│   └── profile.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── uploads/
│
├── views/
│   ├── admin/
│   ├── apply/
│   ├── auth/
│   ├── dashboard/
│   ├── jobs/
│   └── profile/
│
├── app.js
├── db.js
└── package.json
```

---

## Author

**Kaif Ansari**

Portfolio: https://kaifansari-dev.netlify.app

GitHub: https://github.com/kaifansari-11

---

## License

This project is intended for educational, portfolio, and learning purposes.
