# **Polychat - Online Multi-Lingual Chat Room**

![Project Output](https://github.com/Harii2K4/Polychat-MultiLingual_Online_ChatRoom/blob/main/output.png)


Polychat is a real-time online chatroom application where users can text each other in different dialects and languages. The app supports automatic language detection and translation, with specific support for Tamil and English. Built using modern web technologies and cloud APIs, Polychat-MultiLingual_Online_ChatRoom aims to bridge the gap in language barriers during online communication.

## Available Features

### Features:
- **Language Setting**: Available languages for now are English and French.
- **User Authentication**: Creating an account using a verification code from Clerk.
- **Online Status Preferences**: Change online status preferences.
- **Real-Time Online Tracking**: Track online status of users in real time.
- **Account Management**:
  - Deletion of account.
  - Change of password.
  - Handling deleted users.
- Translations only work for languages with typos and genz slang 
### Limitations:
- Slang and typo detection only for english  
- Only two languages are supported at the moment.

### Future Releases:
- Add more language compatibility.
- Improve handling of typos and modern linguistic variations.

---

## Features

- **Real-Time Messaging**: Chat with other users in real-time.
- **Language Translation**: Translate text using Microsoft Azure Cognitive Services Translation API.
- **User Authentication**: Secure authentication and user management using Clerk.
- **TypeScript and React**: Built with a modern frontend stack for seamless user experience.
- **Database Integration**: Persistent storage using Convex.
- **Styling**: Tailored with TailwindCSS and ShadCN for responsive and attractive UI design.

---

## Project Structure

```
├── app/                   # Next.js app directory
├── components/            # React components
├── convex/                # Database-related files
├── hooks/                 # Custom React hooks
├── lib/                   # Library files
├── node_modules/          # Dependencies
├── providers/             # Context and providers for global state
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── .env.local             # Environment variables
├── .gitignore             # Git ignore rules
├── components.json        # UI component configuration
├── eslint.config.mjs      # ESLint configuration
├── LICENSE                # License file
├── middleware.ts          # Next.js middleware
├── next-env.d.ts          # Next.js environment types
├── next.config.ts         # Next.js configuration
├── package-lock.json      # NPM package lock file
├── package.json           # Node.js dependencies
├── postcss.config.mjs     # PostCSS configuration
├── README.md              # Project documentation
├── server.py              # Backend server script
├── tailwind.config.ts     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
├── translation.py         # Translation service script
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- Azure API credentials

---

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/polychat-multilingual-online-chatroom.git
   cd polychat-multilingual-online-chatroom
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Set Up Environment Variables**:

   Create a `.env.local` file in the root directory and add the following:

   ```env
   AZURE_TRANSLATION_KEY=your_azure_key
   AZURE_TRANSLATION_ENDPOINT=your_azure_endpoint
   CLERK_FRONTEND_API=your_clerk_api
   ```

---

### Running the Application

1. **Start the Next.js Development Server**:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

2. **Run FastApi** :

   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000  
   ```

3. **Start Convex Development Server**:

   ```bash
   npx convex dev
   ```

4. **Clerk Setup**:
   Follow the [Clerk Quickstart Guide](https://clerk.com/docs/quickstarts/nextjs) to set up authentication.

5. **Convex Setup**:
   Refer to the [Convex Quickstart Guide](https://docs.convex.dev/quickstart/nextjs) for integrating Convex into the application.

6. **Convex & Clerk Authentication**:
   For authentication with Clerk, check the [Convex Auth Documentation](https://docs.convex.dev/auth/clerk).

---

## Available Scripts

- **`npm run dev`**: Start the development server
- **`npm run build`**: Build the application for production
- **`npm run lint`**: Lint the codebase
- **`npm run start`**: Start the production server

---

## APIs Used

- **[Azure Cognitive Services Translation API](https://azure.microsoft.com/en-us/products/cognitive-services/translator/)**

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- [Microsoft Azure Cognitive Services](https://azure.microsoft.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Clerk](https://clerk.dev/)
- [Convex](https://convex.dev/)

**
