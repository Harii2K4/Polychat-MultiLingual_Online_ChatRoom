#Ploychat - Online Multi-Lingual Chat Room

Polychat is a real-time online chatroom application where users can text each other in different dialects and languages. The app supports automatic language detection and translation, with specific support for Tamil and English. Built using modern web technologies and cloud APIs, Mozhi Medhai aims to bridge the gap in language barriers during online communication.

## Features

- **Real-Time Messaging**: Chat with other users in real-time.
- **Automatic Language Detection**: Identify the input language using Google Language Detection API.
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
├── providers/             # Context and providers for global state
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
├── azure_translation.py   # Azure Translation API integration
├── censor-beep-88052.mp3  # Censorship audio file
├── components.json        # UI component configuration
├── eslint.config.mjs      # ESLint configuration
├── filtering.py           # Content filtering logic
├── google_speech.py       # Google Speech-to-Text integration
├── langdetection.ipynb    # Notebook for language detection experiments
├── main.py                # Main Python script
├── middleware.ts          # Next.js middleware
├── next.config.ts         # Next.js configuration
├── output.mp3             # Audio output file
├── package.json           # Node.js dependencies
├── postcss.config.mjs     # PostCSS configuration
├── speech_text.py         # Speech-to-text processing
├── style.css              # Global CSS styles
├── tailwind.config.ts     # TailwindCSS configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- Azure and Google API credentials

---

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/mozhi-medhai.git
   cd mozhi-medhai
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
   GOOGLE_API_KEY=your_google_key
   CLERK_FRONTEND_API=your_clerk_api
   ```

---

### Running the Application

1. **Start the Next.js Development Server**:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

2. **Run Python Backend Services** (if required):

   ```bash
   python main.py
   ```

---

## Available Scripts

- **`npm run dev`**: Start the development server
- **`npm run build`**: Build the application for production
- **`npm run lint`**: Lint the codebase
- **`npm run start`**: Start the production server

---

## APIs Used

- **[Azure Cognitive Services Translation API](https://azure.microsoft.com/en-us/products/cognitive-services/translator/)**
- **[Google Cloud Language Detection API](https://cloud.google.com/translate)**

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
- [Google Cloud APIs](https://cloud.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
