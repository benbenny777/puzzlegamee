# Object Guessing Puzzle Game 🎯🧩

## Basic Details

### Team Name: Brain Not Found

### Team Members

* Team Lead: Ben Benny - College of Engineering Munnar

## Project Description

A completely unnecessary puzzle game where **you show an object in front of your webcam, and the game challenges you to figure out what the object is!** 📷😂

The player places an object in front of the webcam and the system analyzes the camera feed to identify the object. The identified object becomes part of a fun puzzle/guessing challenge.

Because apparently, asking someone *"What is this?"* wasn't simple enough.

## The Problem (that doesn't exist)

People already know what the objects around them are.

There was absolutely no need for a computer to look at a water bottle, spoon, phone, or random object and tell us what it is.

But we built it anyway.

## The Solution (that nobody asked for)

We created a webcam-based puzzle game that:

1. Opens your webcam.
2. Waits for you to place an object in front of it.
3. Captures the object.
4. Identifies/analyses the object.
5. Generates a puzzle or guessing challenge.
6. Gives the player points for correctly guessing it.
7. Makes you question why this project exists.

The goal isn't productivity.

The goal is **uselessness with style.** 🎯

---

# Technical Details

## Technologies/Components Used

### For Software

* **Language:** TypeScript
* **Framework:** Next.js
* **Frontend:** React
* **Styling:** CSS
* **Web APIs:** Webcam / Camera API
* **Package Manager:** npm
* **Development Tool:** VS Code
* **Version Control:** Git & GitHub

### Main Technologies

* **Next.js** – Web application framework
* **React** – User interface and game components
* **TypeScript** – Application logic and type safety
* **Webcam API** – Accessing the user's camera
* **CSS** – Game interface and animations

### For Hardware

* Laptop/Desktop
* Built-in webcam or USB webcam
* Keyboard and mouse
* Internet connection for accessing the deployed application

No additional hardware is required.

---

# Implementation

## For Software

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Navigate into the project:

```bash
cd YOUR-REPOSITORY
```

Install the dependencies:

```bash
npm install
```

### Run

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The application will run in the browser.

You can also use:

```bash
yarn dev
```

or

```bash
pnpm dev
```

or

```bash
bun dev
```

---

# Project Documentation

## Game Flow

```text
             ┌──────────────────┐
             │      START       │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │    Open Game     │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │  Enable Webcam   │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Show an Object   │
             │ to the Camera    │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │  Puzzle Begins   │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │   Make a Guess   │
             └────────┬─────────┘
                      │
                ┌─────┴─────┐
                │           │
                ▼           ▼
            CORRECT       WRONG
                │           │
                ▼           ▼
           + Score       Try Again
                │           │
                └─────┬─────┘
                      │
                      ▼
             ┌──────────────────┐
             │   Next Puzzle    │
             └──────────────────┘
```

---

# Screenshots

<img width="1887" height="962" alt="Screenshot 2026-09-12 095142" src="https://github.com/user-attachments/assets/e126d1e0-5205-4ed8-b258-b317fd8892bf" />


*The landing page of the Object Puzzle Game where the player can start the game.*

<img width="1837" height="962" alt="Screenshot 2026-09-12 095158" src="https://github.com/user-attachments/assets/c03f2d91-0044-4ec8-b6c0-428a8520ea05" />


*The webcam interface where the player presents an object to the camera.*




# Project Structure

```text
project/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── public/
│   └── assets/
│
├── components/
│   └── ...
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# Key Features

### 📷 Webcam Interaction

Uses the device camera to bring real-world objects into the game.

### 🧩 Puzzle Gameplay

Turns an everyday object into a fun guessing challenge.

### 🎮 Interactive UI

Players can interact with the game directly through the browser.

### 🏆 Score System

Players can track their performance while playing multiple rounds.

### ⚡ Next.js

Built using the modern Next.js framework with React and TypeScript.

### 💻 Browser Based

No installation is required for players once the application is deployed.

---

# Project Demo


* Score tracking
* Interactive puzzle interface

---

# Team Contributions

### Ben Benny

* Project idea and concept
* Next.js project setup
* Frontend development
* Webcam integration
* Puzzle/game logic
* UI/UX design
* Testing and debugging
* GitHub repository and documentation

---

# Why Is This Useless?

Because the user already has **eyes**.

The object is literally sitting in front of them.

But instead of simply looking at it...

**We made a website.** 🤝

And that's exactly why it belongs at **TinkerHub Useless Projects.**

---

Made with ❤️ at **TinkerHub Useless Projects**

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000\&link=https%3A%2F%2Fwww.tinkerhub.org%2F)

![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
