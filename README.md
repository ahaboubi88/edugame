# Relay Race Quiz Game

An educational relay race video game where students compete in teams by answering questions to make their sprinters run faster!

## Features

- **Team-Based Competition**: 2-6 teams with 2-6 students per team
- **Question Management System**: Upload, store, and manage question files
- **Interactive Racing**: Correct answers give speed boosts, wrong answers slow you down
- **Baton Passing**: Students take turns after each lap
- **Touch Screen Optimized**: Designed for interactive displays and touchscreens
- **Multiple File Formats**: Supports JSON, CSV, and TXT question files
- **🆕 Arabic Language Support**: Full RTL (Right-to-Left) support for Arabic questions and team names
- **🆕 Class File Support**: Upload student lists with group assignments for personalized gameplay

## How to Play

### For Teachers

1. **Upload Question Files**
   - Click "Manage Question Files" from the main menu
   - Select "Question File" type from dropdown
   - Upload your question files (JSON, CSV, or TXT format)
   - Files are stored locally in the browser

2. **Upload Class Files (Optional)**
   - Click "Manage Question Files" from the main menu
   - Select "Class File" type from dropdown
   - Upload a class file with student names and group assignments
   - This allows the game to display actual student names during gameplay

3. **Setup Game**
   - Click "New Game" from the main menu
   - Select a question file (required)
   - Select a class file (optional - for personalized student names)
   - Choose number of teams (2-6) - ignored if using class file
   - Choose students per team (2-6) - ignored if using class file
   - Set track length (1-4 laps)
   - Name your teams (if not using class file)
   - Click "Start Game"

3. **During Game**
   - Students take turns answering questions
   - Correct answers = Speed boost (green effect)
   - Wrong answers = Slow down (red effect)
   - First team to finish all laps wins!

### For Students

1. Wait for your turn (your team's color is shown at the top)
2. Read the question carefully
3. Tap the correct answer on the touchscreen
4. Watch your sprinter run!
5. Pass the baton to the next teammate after each lap

## Question File Formats

### JSON Format (Recommended)
```json
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correct": 2
  }
]
```
Note: "correct" is the index (0-based) of the correct answer.

### Arabic Language Support (الدعم العربي)
The game automatically detects Arabic text and switches to RTL (Right-to-Left) mode:

```json
[
  {
    "question": "ما هي عاصمة المملكة العربية السعودية؟",
    "options": ["جدة", "الرياض", "مكة المكرمة", "الدمام"],
    "correct": 1
  }
]
```

**Features:**
- ✅ Automatic RTL text direction detection
- ✅ Arabic font support (Noto Sans Arabic)
- ✅ Arabic team names support
- ✅ Bilingual feedback messages (English/Arabic)
- ✅ Proper text alignment for mixed content

### CSV Format
```csv
question,option1,option2,option3,option4,correct
What is the capital of France?,London,Berlin,Paris,Madrid,2
```
Note: "correct" column uses 0-based index (0=first option, 1=second, etc.).

### TXT Format
```
Q: What is the capital of France?
A: London
A: Berlin
A: Paris
A: Madrid
C: 2
```
Note: "C:" line indicates the correct answer index (0-based).

## Class File Formats (for Student Names)

Upload class files to use real student names instead of generic "Student 1", "Student 2", etc.

### Class File - JSON Format
```json
{
  "Team A": ["Alice", "Bob", "Charlie"],
  "Team B": ["David", "Eve", "Frank"],
  "Team C": ["Grace", "Henry", "Ivy"]
}
```

### Class File - CSV Format
```csv
Team,Student
Team A,Alice
Team A,Bob
Team A,Charlie
Team B,David
Team B,Eve
Team B,Frank
```

### Class File - TXT Format
```
Team: Team A
- Alice
- Bob
- Charlie

Team: Team B
- David
- Eve
- Frank
```

**Using Class Files:**
1. Upload the class file in the File Manager (select "Class File" type)
2. When setting up a new game, select the class file from the dropdown
3. The game will automatically use team names and student names from the file
4. Each student's name will appear when it's their turn to answer

## Game Mechanics

- **Base Speed**: Normal running speed
- **Boost Speed**: 2.5x faster after correct answer (lasts 3 seconds)
- **Slow Speed**: 50% slower after wrong answer (lasts 3 seconds)
- **Lap System**: Each student runs one lap before passing the baton
- **Winning**: First team to complete all laps wins

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Touchscreen display (recommended) or mouse
- Screen resolution: Minimum 768px width

## Installation

1. Download all game files to a folder
2. Open `index.html` in a web browser
3. No server or internet connection required!

## File Structure

```
relay-race-game/
├── index.html                     # Main game file
├── styles.css                     # Game styling
├── game.js                        # Game logic and engine
├── sample-questions.json          # Sample questions (English - JSON)
├── sample-questions-arabic.json   # Sample questions (Arabic - JSON)
├── sample-questions.csv           # Sample questions (English - CSV)
├── sample-questions.txt           # Sample questions (English - TXT)
├── sample-class.json              # Sample class file (JSON)
├── sample-class.csv               # Sample class file (CSV)
├── sample-class.txt               # Sample class file (TXT)
└── README.md                      # This file
```

## Tips for Teachers

1. **Create Question Sets**: Organize questions by topic or difficulty
2. **Team Balance**: Mix skill levels across teams for fairness
3. **Encourage Learning**: Review wrong answers after the race
4. **Save Files**: Download your question files for backup
5. **Clear Browser Data**: Files are stored in browser - clearing data will remove them

## Troubleshooting

**Questions not showing?**
- Check file format matches one of the supported formats
- Ensure correct answer index is valid (0 to number of options - 1)
- Try the sample files to verify the game works

**Game running slowly?**
- Close other browser tabs
- Use a modern browser
- Reduce number of teams

**Touch not working?**
- Ensure touchscreen is properly connected
- Try refreshing the page
- Check if browser supports touch events

## License

This game is free to use for educational purposes.

## Support

For questions or issues, please contact your system administrator or refer to the sample question files for format examples.

---

**Happy Racing!** 🏃‍♂️🏃‍♀️
