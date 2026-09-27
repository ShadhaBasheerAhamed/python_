// Seed question bank covering Levels 1 to 22 across Grades 6 to 12
// Supports 13 distinct interactive activity formats

export const QUESTIONS_BANK = {
  1: { // Level 1: Python Starter
    intro: {
      title: "Welcome to Python Starter!",
      content: "Python is a popular, human-friendly programming language. We tell the computer what to do using clear commands. The most famous command is `print()`, which displays text on your screen!"
    },
    learnCards: [
      {
        heading: "What is Python?",
        text: "Python is an easy-to-read coding language used by NASA, Google, and game creators! Computers follow Python instructions line by line."
      },
      {
        heading: "The print() Function",
        text: "To show text on screen, put text inside quotes inside parentheses: `print(\"Hello Python\")`."
      }
    ],
    activities: [
      {
        id: "L1_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which function is used in Python to display output on screen?",
        options: ["display()", "print()", "show()", "output()"],
        answer: "print()",
        explanation: "In Python, `print()` is the built-in function used to write text or values to the console.",
        xp: 10
      },
      {
        id: "L1_A2",
        type: "true_false",
        difficulty: "easy",
        question: "Python is case-sensitive, meaning Print() and print() are different.",
        options: ["True", "False"],
        answer: "True",
        explanation: "Python is strictly case-sensitive. `print()` works, but `Print()` will give a NameError!",
        xp: 10
      },
      {
        id: "L1_A3",
        type: "drag_drop",
        difficulty: "medium",
        question: "Arrange the blocks to print 'Hello World':",
        blocks: ["print", "(", '"Hello World"', ")"],
        correctOrder: ["print", "(", '"Hello World"', ")"],
        explanation: "Python print statement starts with `print`, followed by `(` then string in quotes, closed by `)`.",
        xp: 20
      },
      {
        id: "L1_A4",
        type: "output_prediction",
        difficulty: "easy",
        question: "What will be displayed on screen?",
        code: `print("Python Quest")`,
        options: ["Python Quest", '"Python Quest"', "print(Python Quest)", "Error"],
        answer: "Python Quest",
        explanation: "Quotes tell Python that 'Python Quest' is a string literal, so it prints the text inside quotes.",
        xp: 15
      },
      {
        id: "L1_A5",
        type: "fill_blank",
        difficulty: "easy",
        question: "Complete the statement to print numbers:",
        codeTemplate: `____(100)`,
        options: ["print", "show", "write", "log"],
        answer: "print",
        explanation: "Use `print(100)` to output numbers without quotes.",
        xp: 15
      },
      {
        id: "L1_A6",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Snake Starter Boss",
        bossHp: 100,
        question: "Defeat the Starter Boss! What will this print?\nprint(5 + 5)",
        options: ["55", "10", '"5 + 5"', "Error"],
        answer: "10",
        explanation: "Since 5 and 5 are numbers without quotes, Python adds them together: 5 + 5 = 10!",
        xp: 100
      }
    ]
  },

  2: { // Level 2: Print & Comments
    intro: {
      title: "Print & Comments",
      content: "Learn how to format output on multiple lines, use quote types, and add comments starting with `#` to write notes in your code."
    },
    learnCards: [
      {
        heading: "Python Comments (#)",
        text: "Comments start with `#`. Python ignores comment lines when running code! Use them to explain code to humans."
      },
      {
        heading: "Multi-line Output",
        text: "Using `\\n` inside strings creates a new line break!"
      }
    ],
    activities: [
      {
        id: "L2_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which symbol is used for a single-line comment in Python?",
        options: ["//", "#", "/*", "<!--"],
        answer: "#",
        explanation: "The hash `#` symbol marks everything after it on that line as a comment.",
        xp: 10
      },
      {
        id: "L2_A2",
        type: "code_ordering",
        difficulty: "medium",
        question: "Arrange the code so the comment comes first, followed by two print statements:",
        lines: [
          `# Print student greeting`,
          `print("Welcome student!")`,
          `print("Let's learn Python")`
        ],
        correctOrder: [
          `# Print student greeting`,
          `print("Welcome student!")`,
          `print("Let's learn Python")`
        ],
        explanation: "Comments give context before the code lines execute.",
        xp: 20
      },
      {
        id: "L2_A3",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the output of this code?",
        code: `# print("Secret")\nprint("Public")`,
        options: ["Secret\nPublic", "Secret", "Public", "Nothing"],
        answer: "Public",
        explanation: "`# print(\"Secret\")` is commented out, so Python skips it entirely and only prints 'Public'.",
        xp: 20
      },
      {
        id: "L2_A4",
        type: "matching",
        difficulty: "medium",
        question: "Match the concept with its correct Python representation:",
        pairs: [
          { item: "Single line comment", match: "# Note" },
          { item: "Print text", match: 'print("Hi")' },
          { item: "New line escape code", match: "\\n" }
        ],
        xp: 25
      },
      {
        id: "L2_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Comment Keeper",
        bossHp: 100,
        question: "What is the output?\nprint(\"Line 1\\nLine 2\")",
        options: ["Line 1\\nLine 2", "Line 1 Line 2", "Line 1\nLine 2", "Error"],
        answer: "Line 1\nLine 2",
        explanation: "`\\n` triggers a line break in terminal output!",
        xp: 100
      }
    ]
  },

  3: { // Level 3: Variables Village
    intro: {
      title: "Variables Village",
      content: "Variables are named containers that store values like numbers, words, or scores in memory."
    },
    learnCards: [
      {
        heading: "Creating a Variable",
        text: "Assign values using `=`: `score = 100`. No special type declaration needed!"
      },
      {
        heading: "Variable Naming Rules",
        text: "Must start with a letter or underscore `_`. Cannot start with numbers or contain spaces or dashes."
      }
    ],
    activities: [
      {
        id: "L3_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which of the following is a VALID variable name in Python?",
        options: ["2player", "player_score", "player-score", "class"],
        answer: "player_score",
        explanation: "Variable names can contain underscores, but cannot start with digits or use reserved keywords like `class`.",
        xp: 10
      },
      {
        id: "L3_A2",
        type: "output_prediction",
        difficulty: "easy",
        question: "What will this print?",
        code: `x = 5\nx = 10\nprint(x)`,
        options: ["5", "10", "15", "x"],
        answer: "10",
        explanation: "Variables store the LATEST value assigned to them. `x = 10` overwrote `5`.",
        xp: 15
      },
      {
        id: "L3_A3",
        type: "fill_blank",
        difficulty: "medium",
        question: "Assign value 50 to variable `coins` and print it:",
        codeTemplate: `coins = 50\nprint(____)`,
        options: ["coins", '"coins"', "50", "coins=50"],
        answer: "coins",
        explanation: "Passing variable name `coins` to `print()` displays its contained value (50).",
        xp: 20
      },
      {
        id: "L3_A4",
        type: "drag_drop",
        difficulty: "medium",
        question: "Create a variable named `name` with value 'Arun':",
        blocks: ["name", "=", '"Arun"'],
        correctOrder: ["name", "=", '"Arun"'],
        explanation: "Variable assignment syntax is `variable_name = value`.",
        xp: 20
      },
      {
        id: "L3_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Variable Sentinel",
        bossHp: 100,
        question: "What is the output?\na = 3\nb = a + 2\nprint(b)",
        options: ["3", "2", "5", "a + 2"],
        answer: "5",
        explanation: "`a` is 3, so `b = 3 + 2 = 5`. `print(b)` displays 5!",
        xp: 100
      }
    ]
  },

  4: { // Level 4: Data Types Domain
    intro: {
      title: "Data Types Domain",
      content: "Python automatically recognizes numbers (int & float), words (str), and true/false values (bool)."
    },
    learnCards: [
      {
        heading: "Core Data Types",
        text: "• `int`: Whole numbers (e.g. 42)\n• `float`: Decimal numbers (e.g. 3.14)\n• `str`: Text inside quotes (e.g. \"Python\")\n• `bool`: True or False"
      }
    ],
    activities: [
      {
        id: "L4_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What data type is `9.81` in Python?",
        options: ["int", "float", "str", "bool"],
        answer: "float",
        explanation: "Numbers with decimal points are stored as floating point numbers (`float`).",
        xp: 15
      },
      {
        id: "L4_A2",
        type: "matching",
        difficulty: "medium",
        question: "Match the value to its correct data type:",
        pairs: [
          { item: '"Grade 8"', match: "str" },
          { item: "25", match: "int" },
          { item: "True", match: "bool" }
        ],
        xp: 25
      },
      {
        id: "L4_A3",
        type: "output_prediction",
        difficulty: "medium",
        question: "What will `print(type(\"100\"))` display?",
        options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "100"],
        answer: "<class 'str'>",
        explanation: "Because `100` is wrapped in quotes `\"100\"`, Python treats it as a string (`str`)!",
        xp: 20
      },
      {
        id: "L4_A4",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Type Wizard",
        bossHp: 100,
        question: "What is the result of `type(5 > 3)`?",
        options: ["<class 'bool'>", "<class 'int'>", "True", "<class 'str'>"],
        answer: "<class 'bool'>",
        explanation: "`5 > 3` evaluates to `True`, which is a boolean (`bool`).",
        xp: 100
      }
    ]
  },

  5: { // Level 5: Input Island
    intro: {
      title: "Input Island",
      content: "Use `input()` to prompt the user for data, and type conversion like `int()` to convert user input to numbers!"
    },
    learnCards: [
      {
        heading: "Getting User Input",
        text: "`name = input(\"Enter your name: \")` waits for the user to type and returns a string!"
      },
      {
        heading: "Converting Input",
        text: "`input()` ALWAYS returns a string. Convert to number using `int(input())` or `float(input())`."
      }
    ],
    activities: [
      {
        id: "L5_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What data type does the `input()` function always return by default?",
        options: ["int", "str", "float", "bool"],
        answer: "str",
        explanation: "Regardless of what the user types (even digits), `input()` returns a string.",
        xp: 15
      },
      {
        id: "L5_A2",
        type: "find_bug",
        difficulty: "medium",
        question: "Find the bug! We want to add 5 to user's age as a number:",
        code: `age = input("Enter age: ")\nnext_age = age + 5\nprint(next_age)`,
        options: [
          "Line 1: age = int(input(\"Enter age: \"))",
          "Line 2: next_age = age * 5",
          "Line 3: print(\"next_age\")",
          "No bug"
        ],
        answer: "Line 1: age = int(input(\"Enter age: \"))",
        explanation: "Since `input()` returns a `str`, adding 5 causes a TypeError! We must convert it using `int(input())`.",
        xp: 25
      },
      {
        id: "L5_A3",
        type: "fill_blank",
        difficulty: "medium",
        question: "Complete the line to convert string input to integer:",
        codeTemplate: `score = ____(input("Score: "))`,
        options: ["int", "str", "float", "num"],
        answer: "int",
        explanation: "`int()` wraps `input()` to parse string digits into integer math numbers.",
        xp: 20
      },
      {
        id: "L5_A4",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Prompt Guardian",
        bossHp: 100,
        question: "If user enters '4' for input, what does this print?\nx = input()\nprint(x * 2)",
        options: ["8", "44", "4", "Error"],
        answer: "44",
        explanation: "Since `x` is string `'4'`, `'4' * 2` repeats string twice to get `'44'`!",
        xp: 100
      }
    ]
  },

  6: { // Level 6: Operators Zone
    intro: {
      title: "Operators Zone",
      content: "Master math operators (+, -, *, /, //, %, **) and comparison operators (==, !=, >, <, >=, <=)."
    },
    learnCards: [
      {
        heading: "Special Math Operators",
        text: "• `//` Floor division (drops decimal: 7 // 2 = 3)\n• `%` Modulus (gives remainder: 7 % 2 = 1)\n• `**` Exponent/Power (2 ** 3 = 8)"
      }
    ],
    activities: [
      {
        id: "L6_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which operator calculates the remainder of a division?",
        options: ["/", "//", "%", "**"],
        answer: "%",
        explanation: "Modulus `%` returns remainder. E.g. `10 % 3 = 1`.",
        xp: 15
      },
      {
        id: "L6_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the output of `print(17 // 5)`?",
        options: ["3.4", "3", "2", "17"],
        answer: "3",
        explanation: "Floor division `//` divides 17 by 5 (= 3.4) and truncates decimal to 3.",
        xp: 20
      },
      {
        id: "L6_A3",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the value of `print(2 ** 4)`?",
        options: ["8", "16", "6", "64"],
        answer: "16",
        explanation: "`2 ** 4` means 2 to the power of 4 = 2 * 2 * 2 * 2 = 16.",
        xp: 20
      },
      {
        id: "L6_A4",
        type: "true_false",
        difficulty: "easy",
        question: "In Python, `=` is used for assignment, while `==` checks if two values are equal.",
        options: ["True", "False"],
        answer: "True",
        explanation: "`=` sets a variable value; `==` compares two values and returns True/False.",
        xp: 15
      },
      {
        id: "L6_A5",
        type: "actual_code",
        difficulty: "hard",
        question: "Write code to calculate and print the remainder of 25 divided by 4:",
        initialCode: `# Calculate remainder of 25 divided by 4\n# Hint: use the % operator\nremainder = ___\nprint(___)`,
        expectedOutput: "1",
        hints: [
          "Use the % modulus operator between 25 and 4.",
          "Try: remainder = 25 % 4  then print(remainder)"
        ],
        xp: 40
      },
      {
        id: "L6_A6",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Math Golem",
        bossHp: 100,
        question: "Defeat Math Golem! What is `print(10 % 3 + 2 ** 3)`?",
        options: ["9", "11", "8", "7"],
        answer: "9",
        explanation: "`10 % 3 = 1`, and `2 ** 3 = 8`. So `1 + 8 = 9`!",
        xp: 100
      }
    ]
  },

  7: { // Level 7: Decision Valley
    intro: {
      title: "Decision Valley",
      content: "Make your programs smart! Use `if`, `else`, and logical operators (`and`, `or`, `not`) to branch execution."
    },
    learnCards: [
      {
        heading: "if-else Structure",
        text: "```python\nif score >= 50:\n    print(\"Passed\")\nelse:\n    print(\"Try Again\")\n```\nDon't forget the colon `:` and 4-space indentation!"
      }
    ],
    activities: [
      {
        id: "L7_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What symbol must end an `if` statement line in Python?",
        options: [";", ":", ",", "."],
        answer: ":",
        explanation: "All Python control blocks (`if`, `else`, `for`, `while`, `def`) must end with a colon `:`.",
        xp: 15
      },
      {
        id: "L7_A2",
        type: "find_bug",
        difficulty: "medium",
        question: "Find the error in this code snippet:",
        code: `x = 10\nif x > 5\n    print("Big number")`,
        options: [
          "Missing colon : after if x > 5",
          "Missing quotes around x",
          "x should be inside brackets",
          "No error"
        ],
        answer: "Missing colon : after if x > 5",
        explanation: "Line 2 is missing the mandatory `:` at the end of the `if` condition.",
        xp: 25
      },
      {
        id: "L7_A3",
        type: "output_prediction",
        difficulty: "medium",
        question: "What will be printed?",
        code: `age = 15\nif age >= 18:\n    print("Adult")\nelse:\n    print("Student")`,
        options: ["Adult", "Student", "Adult\nStudent", "Error"],
        answer: "Student",
        explanation: "15 >= 18 is False, so Python skips the if block and executes the `else:` block ('Student').",
        xp: 20
      },
      {
        id: "L7_A4",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "If-Else Titan",
        bossHp: 100,
        question: "What is printed?\na = True\nb = False\nif a and not b:\n    print(\"Quest Cleared!\")\nelse:\n    print(\"Failed\")",
        options: ["Quest Cleared!", "Failed", "Error", "True"],
        answer: "Quest Cleared!",
        explanation: "`not b` is True. `a and True` is `True and True = True`, so it prints 'Quest Cleared!'",
        xp: 100
      }
    ]
  },

  8: { // Level 8: Nested Conditions
    intro: {
      title: "Nested Conditions",
      content: "Chain multiple conditions together using `if-elif-else` branches!"
    },
    learnCards: [
      {
        heading: "if-elif-else",
        text: "```python\nif marks >= 90:\n    grade = \"A\"\nelif marks >= 75:\n    grade = \"B\"\nelse:\n    grade = \"C\"\n```"
      }
    ],
    activities: [
      {
        id: "L8_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What keyword is used in Python for 'else if'?",
        options: ["elseif", "else if", "elif", "if else"],
        answer: "elif",
        explanation: "Python combines `else` and `if` into the shorthand keyword `elif`.",
        xp: 15
      },
      {
        id: "L8_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What grade is printed?",
        code: `score = 80\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelif score >= 50:\n    print("C")`,
        options: ["A", "B", "C", "B and C"],
        answer: "B",
        explanation: "`score >= 90` is False. Next `elif score >= 70` (80 >= 70) is True, so it prints 'B' and exits!",
        xp: 20
      },
      {
        id: "L8_A3",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Branch Master",
        bossHp: 100,
        question: "What is printed?\nx = 5\nif x > 10:\n    print(\"High\")\nelif x == 5:\n    print(\"Exact\")\nelse:\n    print(\"Low\")",
        options: ["High", "Exact", "Low", "Error"],
        answer: "Exact",
        explanation: "`x == 5` is True, triggering the `elif` block output 'Exact'.",
        xp: 100
      }
    ]
  },

  9: { // Level 9: Loop Forest — for Loops
    intro: {
      title: "Loop Forest — for Loops",
      content: "Automate repetitive tasks! Use `for i in range(n)` to repeat code a specified number of times."
    },
    learnCards: [
      {
        heading: "for Loop Basics",
        text: "```python\nfor i in range(3):\n    print(\"Python\", i)\n```\nOutput: Python 0, Python 1, Python 2 (stops before 3!)."
      }
    ],
    activities: [
      {
        id: "L9_A1",
        type: "mcq",
        difficulty: "easy",
        question: "How many times will `for i in range(5):` run?",
        options: ["4 times", "5 times", "6 times", "0 times"],
        answer: "5 times",
        explanation: "`range(5)` generates numbers 0, 1, 2, 3, 4 (5 total iterations).",
        xp: 15
      },
      {
        id: "L9_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the final value printed?",
        code: `total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)`,
        options: ["4", "6", "10", "3"],
        answer: "6",
        explanation: "`range(1, 4)` generates 1, 2, 3. `total = 0 + 1 + 2 + 3 = 6`.",
        xp: 25
      },
      {
        id: "L9_A3",
        type: "actual_code",
        difficulty: "hard",
        question: "Write a for loop that calculates sum of numbers from 1 to 5 inclusive and prints it:",
        initialCode: `# Calculate sum of 1 to 5\n# Step 1: Initialize a total variable\ntotal = ___\n# Step 2: Write a for loop over range(1, 6)\nfor i in ___:\n    total += ___\n# Step 3: Print the result\nprint(___)`,
        expectedOutput: "15",
        hints: [
          "Initialize: total = 0, then use range(1, 6) so 5 is included.",
          "Inside the loop: total += i  and after the loop: print(total)"
        ],
        xp: 50
      },
      {
        id: "L9_A4",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Loop Dragon",
        bossHp: 100,
        question: "Defeat Loop Dragon! What does this output?\ncount = 0\nfor ch in \"PYTHON\":\n    count += 1\nprint(count)",
        options: ["5", "6", "7", "PYTHON"],
        answer: "6",
        explanation: "\"PYTHON\" has 6 letters. The loop iterates once per character, making count = 6!",
        xp: 100
      }
    ]
  },

  10: { // Level 10: while Loops
    intro: {
      title: "while Loops",
      content: "Loop until a condition becomes False! Always update counter variables to prevent infinite loops."
    },
    learnCards: [
      {
        heading: "while Loop Structure",
        text: "```python\ncount = 1\nwhile count <= 3:\n    print(count)\n    count += 1\n```"
      }
    ],
    activities: [
      {
        id: "L10_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What happens if a `while` loop condition NEVER becomes False?",
        options: ["Code speeds up", "Infinite loop (program freezes)", "Syntax error", "Automatic termination"],
        answer: "Infinite loop (program freezes)",
        explanation: "If the condition stays True forever, the program enters an infinite loop.",
        xp: 15
      },
      {
        id: "L10_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is printed when this code finishes?",
        code: `x = 1\nwhile x < 4:\n    x *= 2\nprint(x)`,
        options: ["2", "4", "8", "3"],
        answer: "4",
        explanation: "1st loop: x becomes 2 (2 < 4 is True). 2nd loop: x becomes 4 (4 < 4 is False). Loop ends, prints 4!",
        xp: 25
      },
      {
        id: "L10_A3",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "While Specter",
        bossHp: 100,
        question: "What is printed?\nn = 10\nwhile n > 0:\n    n -= 4\nprint(n)",
        options: ["0", "-2", "2", "6"],
        answer: "-2",
        explanation: "n starts 10 -> 6 -> 2 -> -2. Since -2 > 0 is False, loop exits and prints -2.",
        xp: 100
      }
    ]
  },

  13: { // Level 13: Strings Street
    intro: {
      title: "Strings Street",
      content: "Manipulate text! Indexing `text[0]`, slicing `text[1:4]`, `len()`, and string methods like `.upper()`."
    },
    learnCards: [
      {
        heading: "String Slicing",
        text: "`s = \"PYTHON\"` -> `s[0]` is 'P', `s[-1]` is 'N', `s[0:3]` is 'PYT'."
      }
    ],
    activities: [
      {
        id: "L13_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What is the index of the FIRST character in a Python string?",
        options: ["1", "0", "-1", "first"],
        answer: "0",
        explanation: "Python uses 0-based indexing for strings and collections.",
        xp: 15
      },
      {
        id: "L13_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the output of `print(\"CODE\"[1:3])`?",
        options: ["COD", "OD", "ODE", "CD"],
        answer: "OD",
        explanation: "Slicing `[1:3]` extracts characters at index 1 ('O') and index 2 ('D') up to but not including 3.",
        xp: 25
      },
      {
        id: "L13_A3",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Text Cipher",
        bossHp: 100,
        question: "What is `print(\"PYTHON\"[::-1])`?",
        options: ["PYTHON", "NOHTYP", "P", "Error"],
        answer: "NOHTYP",
        explanation: "Slicing with step `-1` (`[::-1]`) reverses the string!",
        xp: 100
      }
    ]
  },

  14: { // Level 14: Lists Land
    intro: {
      title: "Lists Land",
      content: "Store multiple items in an ordered sequence! `fruits = [\"apple\", \"banana\", \"mango\"]`."
    },
    learnCards: [
      {
        heading: "List Operations",
        text: "• Add item: `fruits.append(\"orange\")`\n• Remove item: `fruits.pop()`\n• Length: `len(fruits)`"
      }
    ],
    activities: [
      {
        id: "L14_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which method adds a new element to the end of a list?",
        options: ["add()", "push()", "append()", "insert_end()"],
        answer: "append()",
        explanation: "In Python, `.append(element)` appends an item to the end of the list.",
        xp: 15
      },
      {
        id: "L14_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the output?",
        code: `nums = [10, 20, 30]\nnums.append(40)\nprint(len(nums))`,
        options: ["3", "4", "40", "100"],
        answer: "4",
        explanation: "Appending 40 makes the list `[10, 20, 30, 40]`, so `len()` is 4.",
        xp: 25
      },
      {
        id: "L14_A3",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Array Beast",
        bossHp: 100,
        question: "What is printed?\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
        options: ["3", "4", "Error", "7"],
        answer: "4",
        explanation: "`b = a` assigns a reference to the same list! Modifying `b` updates `a` as well.",
        xp: 100
      }
    ]
  },

  17: { // Level 17: Dictionaries Dungeon
    intro: {
      title: "Dictionaries Dungeon",
      content: "Store key-value pairs like a real dictionary! `student = {\"name\": \"Arun\", \"grade\": 8}`."
    },
    learnCards: [
      {
        heading: "Dictionary Access",
        text: "Access values by key: `student[\"name\"]` returns 'Arun'."
      }
    ],
    activities: [
      {
        id: "L17_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which syntax defines a Python dictionary?",
        options: ["(key, value)", "[key: value]", "{key: value}", "<key, value>"],
        answer: "{key: value}",
        explanation: "Dictionaries use curly braces `{}` with key-value pairs separated by colons.",
        xp: 20
      },
      {
        id: "L17_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the output?",
        code: `hero = {"hp": 100, "xp": 50}\nhero["xp"] += 20\nprint(hero["xp"])`,
        options: ["50", "70", "120", "KeyError"],
        answer: "70",
        explanation: "`hero[\"xp\"]` was 50; adding 20 updates it to 70.",
        xp: 25
      },
      {
        id: "L17_A3",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Key-Value Overlord",
        bossHp: 100,
        question: "What is `print(len({\"a\": 1, \"b\": 2, \"a\": 3}))`?",
        options: ["3", "2", "1", "SyntaxError"],
        answer: "2",
        explanation: "Dictionary keys must be unique! Duplicate key `\"a\"` updates the existing key, keeping total length 2.",
        xp: 100
      }
    ]
  },

  18: { // Level 18: Functions Factory
    intro: {
      title: "Functions Factory",
      content: "Write modular reusable code using `def function_name(params):` and `return` values!"
    },
    learnCards: [
      {
        heading: "Creating a Function",
        text: "```python\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3) # result is 8\n```"
      }
    ],
    activities: [
      {
        id: "L18_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which keyword is used to declare a function in Python?",
        options: ["func", "function", "def", "define"],
        answer: "def",
        explanation: "`def` is short for define function.",
        xp: 15
      },
      {
        id: "L18_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is printed?",
        code: `def double(n):\n    return n * 2\nprint(double(4) + double(1))`,
        options: ["8", "10", "5", "Error"],
        answer: "10",
        explanation: "`double(4)` returns 8; `double(1)` returns 2. 8 + 2 = 10.",
        xp: 25
      },
      {
        id: "L18_A3",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Function Archmage",
        bossHp: 100,
        question: "What is printed?\ndef calc(x, y=10):\n    return x + y\nprint(calc(5))",
        options: ["5", "10", "15", "Error"],
        answer: "15",
        explanation: "`y` has a default parameter value 10. `calc(5)` uses default `y=10` -> 5 + 10 = 15!",
        xp: 100
      }
    ]
  },

  19: { // Level 19: Debugging Lab
    intro: {
      title: "Debugging Lab",
      content: "Become a bug detective! Spot indentation errors, type mismatches, and syntax slips."
    },
    learnCards: [
      {
        heading: "Common Errors",
        text: "• `SyntaxError`: Invalid syntax (e.g. missing colon or bracket)\n• `TypeError`: Invalid type operation (e.g. string + integer)\n• `IndentationError`: Misaligned code lines"
      }
    ],
    activities: [
      {
        id: "L19_A1",
        type: "mcq",
        difficulty: "medium",
        question: "What type of error occurs when you forget to indent code inside a for loop?",
        options: ["SyntaxError", "TypeError", "IndentationError", "NameError"],
        answer: "IndentationError",
        explanation: "Python relies on clean indentation to define code block scope.",
        xp: 20
      },
      {
        id: "L19_A2",
        type: "find_bug",
        difficulty: "hard",
        question: "Identify the bug in this function:",
        code: `def greet(name)\n    print("Hello " + name)`,
        options: [
          "Missing colon : after def greet(name)",
          "Missing + sign",
          "print cannot use quotes",
          "No bug"
        ],
        answer: "Missing colon : after def greet(name)",
        explanation: "Function header `def greet(name)` is missing a colon `:`.",
        xp: 30
      },
      {
        id: "L19_A3",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "The Master Bug",
        bossHp: 100,
        question: "Which line raises a TypeError?\n1: x = '10'\n2: y = 5\n3: z = x + y",
        options: ["Line 1", "Line 2", "Line 3", "None"],
        answer: "Line 3",
        explanation: "Line 3 attempts to add string `'10'` and integer `5`, which raises a TypeError.",
        xp: 100
      }
    ]
  }
};

// ──────────────────────────────────────────────────────────────
// Extra level content for Levels 11, 12, 15, 16, 20, 21, 22
// ──────────────────────────────────────────────────────────────
const LEVELS_EXTRA = {

  11: { // Level 11: Range & Step
    intro: {
      title: "Range & Step Master",
      content: "Control loops with precision! `range(start, stop, step)` lets you count by 2s, 5s, 10s, or even backwards!"
    },
    learnCards: [
      {
        heading: "range() with 3 Arguments",
        text: "• `range(0, 10, 2)` → 0, 2, 4, 6, 8\n• `range(10, 0, -1)` → 10, 9, 8 ... 1\n• `range(start, stop, step)` — stop is NOT included!"
      },
      {
        heading: "Common Uses",
        text: "• Count even numbers: `range(0, 20, 2)`\n• Countdown: `range(5, 0, -1)`\n• Every 3rd: `range(0, 30, 3)`"
      }
    ],
    activities: [
      {
        id: "L11_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What does `range(1, 10, 3)` generate?",
        options: ["1, 3, 6, 9", "1, 4, 7", "1, 2, 3", "3, 6, 9"],
        answer: "1, 4, 7",
        explanation: "Starting at 1, add 3 each time: 1 → 4 → 7 → (10 is stop, excluded).",
        xp: 15
      },
      {
        id: "L11_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What will this print?",
        code: `for i in range(10, 0, -3):\n    print(i)`,
        options: ["10 7 4 1", "10 7 4", "10 8 6 4 2", "0 3 6 9"],
        answer: "10 7 4 1",
        explanation: "Countdown by 3 from 10: 10 → 7 → 4 → 1 → (next is -2, which is ≤ 0 stop, excluded).",
        xp: 25
      },
      {
        id: "L11_A3",
        type: "fill_blank",
        difficulty: "medium",
        question: "Complete to print all even numbers from 2 to 10:",
        codeTemplate: `for i in range(2, 11, ____):\n    print(i)`,
        options: ["2", "1", "3", "10"],
        answer: "2",
        explanation: "Step of 2 gives: 2, 4, 6, 8, 10.",
        xp: 20
      },
      {
        id: "L11_A4",
        type: "actual_code",
        difficulty: "hard",
        question: "Write a for loop using range() that prints numbers 5, 10, 15, 20, 25:",
        initialCode: `# Print 5, 10, 15, 20, 25 using range()\nfor i in range(___, ___, ___):\n    print(i)`,
        expectedOutput: "5\n10\n15\n20\n25",
        hints: [
          "range(start, stop, step): start=5, stop=30 (exclusive), step=5",
          "range(5, 30, 5) gives 5, 10, 15, 20, 25"
        ],
        xp: 40
      },
      {
        id: "L11_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Step Overlord",
        bossHp: 100,
        question: "How many numbers does `range(0, 20, 4)` generate?",
        options: ["4", "5", "6", "20"],
        answer: "5",
        explanation: "0, 4, 8, 12, 16 — that's 5 values! (20 is excluded as stop value.)",
        xp: 100
      }
    ]
  },

  12: { // Level 12: Nested Loops & Patterns
    intro: {
      title: "Nested Loops & Patterns",
      content: "Put a loop inside a loop to create grids, patterns, and multiplication tables! The inner loop runs fully for every single step of the outer loop."
    },
    learnCards: [
      {
        heading: "Nested Loop Structure",
        text: "```python\nfor row in range(3):        # Outer loop\n    for col in range(3):    # Inner loop\n        print('*', end=' ')\n    print()  # New line after each row\n```\nOutput: A 3×3 star grid!"
      },
      {
        heading: "Counting Iterations",
        text: "Outer loops × Inner loops = Total iterations.\nA 3×4 nested loop runs 3 × 4 = 12 times total."
      }
    ],
    activities: [
      {
        id: "L12_A1",
        type: "mcq",
        difficulty: "easy",
        question: "How many total times does the inner loop body run?\n`for i in range(4):\n    for j in range(3):\n        print('x')`",
        options: ["4", "3", "12", "7"],
        answer: "12",
        explanation: "Outer runs 4 times × inner runs 3 times = 4 × 3 = 12 total prints.",
        xp: 15
      },
      {
        id: "L12_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the output of this code?",
        code: `for i in range(1, 4):\n    print(i * i)`,
        options: ["1 4 9", "1 2 3", "1 4 8", "2 4 6"],
        answer: "1 4 9",
        explanation: "i=1: 1×1=1, i=2: 2×2=4, i=3: 3×3=9. Each printed on new line.",
        xp: 20
      },
      {
        id: "L12_A3",
        type: "code_ordering",
        difficulty: "medium",
        question: "Arrange to print a right-triangle of stars (3 rows: *, **, ***):",
        lines: [
          `for i in range(1, 4):`,
          `    for j in range(i):`,
          `        print('*', end='')`,
          `    print()`
        ],
        correctOrder: [
          `for i in range(1, 4):`,
          `    for j in range(i):`,
          `        print('*', end='')`,
          `    print()`
        ],
        explanation: "Outer i controls rows (1–3). Inner j prints i stars. print() moves to next line.",
        xp: 30
      },
      {
        id: "L12_A4",
        type: "actual_code",
        difficulty: "hard",
        question: "Write nested loops to print the 3×3 multiplication table (rows 1–3, cols 1–3). Format: print(i * j) for each cell:",
        initialCode: `# 3x3 multiplication table\nfor i in range(1, ___):\n    for j in range(1, ___):\n        print(i * j)`,
        expectedOutput: "1\n2\n3\n2\n4\n6\n3\n6\n9",
        hints: [
          "range(1, 4) gives 1, 2, 3 for both i and j",
          "Outer: for i in range(1, 4), Inner: for j in range(1, 4), print(i * j)"
        ],
        xp: 50
      },
      {
        id: "L12_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Pattern Hydra",
        bossHp: 100,
        question: "What is the output?\nfor i in range(2):\n    for j in range(2):\n        print(i + j)",
        options: ["0 1 1 2", "0 1 2 3", "0 2 1 3", "0 0 1 1"],
        answer: "0 1 1 2",
        explanation: "i=0,j=0→0; i=0,j=1→1; i=1,j=0→1; i=1,j=1→2. So output is 0 1 1 2.",
        xp: 100
      }
    ]
  },

  15: { // Level 15: Tuples Town
    intro: {
      title: "Tuples Town",
      content: "Tuples are like lists — but LOCKED! Once created, their values can't be changed. Perfect for storing permanent data like coordinates, RGB colors, or fixed records."
    },
    learnCards: [
      {
        heading: "Creating Tuples",
        text: "• `point = (3, 7)` — parentheses with comma-separated values\n• `coords = (10, 20, 30)` — can hold any types\n• `single = (42,)` — single item needs trailing comma!"
      },
      {
        heading: "Tuple vs List",
        text: "• Tuple `(1, 2, 3)` → immutable (cannot change)\n• List `[1, 2, 3]` → mutable (can change)\n• Tuples are faster and safer for fixed data."
      }
    ],
    activities: [
      {
        id: "L15_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which of these creates a valid Python tuple?",
        options: ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}", "<1, 2, 3>"],
        answer: "(1, 2, 3)",
        explanation: "Tuples use parentheses `()`. Square brackets `[]` = list, curly braces `{}` = set/dict.",
        xp: 15
      },
      {
        id: "L15_A2",
        type: "true_false",
        difficulty: "easy",
        question: "You can modify an element inside a tuple after it is created.",
        options: ["True", "False"],
        answer: "False",
        explanation: "Tuples are immutable — trying to change an element causes a TypeError!",
        xp: 10
      },
      {
        id: "L15_A3",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is the output?",
        code: `t = (10, 20, 30, 40)\nprint(t[1] + t[3])`,
        options: ["50", "60", "30", "Error"],
        answer: "60",
        explanation: "t[1] is 20 and t[3] is 40. 20 + 40 = 60.",
        xp: 20
      },
      {
        id: "L15_A4",
        type: "matching",
        difficulty: "medium",
        question: "Match the operation to what it does with tuples:",
        pairs: [
          { item: "len((1,2,3))", match: "3" },
          { item: "(1,2) + (3,4)", match: "(1, 2, 3, 4)" },
          { item: "2 in (1,2,3)", match: "True" }
        ],
        explanation: "len() counts items, + concatenates tuples, `in` checks membership.",
        xp: 25
      },
      {
        id: "L15_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Immutable Vault Keeper",
        bossHp: 100,
        question: "What does this print?\na, b, c = (5, 10, 15)\nprint(b)",
        options: ["5", "10", "15", "Error"],
        answer: "10",
        explanation: "Tuple unpacking assigns 5→a, 10→b, 15→c. So `b` is 10.",
        xp: 100
      }
    ]
  },

  16: { // Level 16: Sets Oasis
    intro: {
      title: "Sets Oasis",
      content: "Sets store UNIQUE elements only — no duplicates! Perfect for removing duplicates and checking if something exists. Sets use `{}` curly braces like dicts, but with no key-value pairs."
    },
    learnCards: [
      {
        heading: "Set Basics",
        text: "• `s = {1, 2, 3}` — auto-removes duplicates\n• `s.add(4)` — add an element\n• `s.remove(2)` — remove element\n• `4 in s` — check membership (very fast!)"
      },
      {
        heading: "Set Operations",
        text: "• `A | B` — Union (all elements from both)\n• `A & B` — Intersection (common elements)\n• `A - B` — Difference (in A but not B)"
      }
    ],
    activities: [
      {
        id: "L16_A1",
        type: "mcq",
        difficulty: "easy",
        question: "What is the length of `{1, 2, 2, 3, 3, 3}`?",
        options: ["6", "3", "1", "2"],
        answer: "3",
        explanation: "Sets remove duplicates automatically! Only {1, 2, 3} remain — length is 3.",
        xp: 15
      },
      {
        id: "L16_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What is printed?",
        code: `a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a & b)`,
        options: ["{1, 2, 3, 4}", "{2, 3}", "{1, 4}", "{1, 2, 3}"],
        answer: "{2, 3}",
        explanation: "`a & b` is intersection — elements that appear in BOTH sets: 2 and 3.",
        xp: 25
      },
      {
        id: "L16_A3",
        type: "true_false",
        difficulty: "easy",
        question: "Sets in Python are ordered (maintain insertion order).",
        options: ["True", "False"],
        answer: "False",
        explanation: "Sets are UNORDERED — they do not maintain the order elements were inserted!",
        xp: 10
      },
      {
        id: "L16_A4",
        type: "find_bug",
        difficulty: "medium",
        question: "This code should create a set of unique student grades. Find the bug:",
        code: `grades = [85, 90, 85, 70, 90]\nunique_grades = list(grades)\nprint(len(unique_grades))`,
        options: [
          "Line 2: unique_grades = set(grades)",
          "Line 1: grades should use {} not []",
          "Line 3: use print(unique_grades)",
          "No bug"
        ],
        answer: "Line 2: unique_grades = set(grades)",
        explanation: "Using `list()` keeps duplicates. `set(grades)` automatically removes duplicates to get {70, 85, 90}.",
        xp: 30
      },
      {
        id: "L16_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Unique Sorcerer",
        bossHp: 100,
        question: "What does this print?\nx = {1,2,3,4,5}\ny = {4,5,6,7}\nprint(len(x | y))",
        options: ["7", "9", "2", "5"],
        answer: "7",
        explanation: "Union x | y = {1,2,3,4,5,6,7} — 7 unique elements total.",
        xp: 100
      }
    ]
  },

  20: { // Level 20: Algorithms & Logic
    intro: {
      title: "Algorithms & Logic",
      content: "Algorithms are step-by-step instructions to solve problems. Master linear search, finding min/max, sorting logic, and frequency counting!"
    },
    learnCards: [
      {
        heading: "Linear Search",
        text: "Check each element one by one:\n```python\ndef search(lst, target):\n    for i, val in enumerate(lst):\n        if val == target:\n            return i\n    return -1\n```"
      },
      {
        heading: "Find Min/Max without Built-ins",
        text: "```python\nnums = [5, 2, 8, 1, 9]\nmin_val = nums[0]\nfor n in nums:\n    if n < min_val:\n        min_val = n\nprint(min_val)  # 1\n```"
      }
    ],
    activities: [
      {
        id: "L20_A1",
        type: "mcq",
        difficulty: "medium",
        question: "What is the worst-case number of comparisons for a linear search in a list of 10 elements?",
        options: ["1", "5", "10", "100"],
        answer: "10",
        explanation: "In the worst case (element not found or at the end), linear search checks ALL 10 elements.",
        xp: 20
      },
      {
        id: "L20_A2",
        type: "output_prediction",
        difficulty: "medium",
        question: "What does this algorithm print?",
        code: `nums = [3, 1, 4, 1, 5, 9, 2]\nmax_v = nums[0]\nfor n in nums:\n    if n > max_v:\n        max_v = n\nprint(max_v)`,
        options: ["9", "3", "5", "1"],
        answer: "9",
        explanation: "The loop tracks the largest seen value. 9 is the maximum in the list.",
        xp: 25
      },
      {
        id: "L20_A3",
        type: "find_bug",
        difficulty: "hard",
        question: "This count-frequency function has a bug:",
        code: `def count_freq(lst, target):\n    count = 1\n    for item in lst:\n        if item == target:\n            count += 1\n    return count`,
        options: [
          "Line 2: count = 0 (should start at 0, not 1)",
          "Line 4: use item != target",
          "Line 3: for item in range(lst)",
          "No bug"
        ],
        answer: "Line 2: count = 0 (should start at 0, not 1)",
        explanation: "Frequency count starts at 0. Starting at 1 overcounts by 1 for every target!",
        xp: 35
      },
      {
        id: "L20_A4",
        type: "actual_code",
        difficulty: "hard",
        question: "Write code to find and print the second largest number in the list [3, 1, 4, 1, 5, 9, 2, 6]:",
        initialCode: `nums = [3, 1, 4, 1, 5, 9, 2, 6]\n# Sort the unique values and get second largest\nunique = list(set(nums))\nunique.sort()\nprint(unique[___])`,
        expectedOutput: "6",
        hints: [
          "After sorting unique values ascending, second largest is at index -2",
          "unique[-2] gives the second largest in a sorted list"
        ],
        xp: 50
      },
      {
        id: "L20_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Algorithm Mastermind",
        bossHp: 100,
        question: "What is bubble sort's worst case time complexity?\n(Number of comparisons for n elements)",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        answer: "O(n²)",
        explanation: "Bubble sort compares each element with every other — n × n = n² comparisons in the worst case.",
        xp: 100
      }
    ]
  },

  21: { // Level 21: File Handling & CSV
    intro: {
      title: "File Handling & CSV",
      content: "Python can read and write files! Use `open()` to access text files. This is how real programs save data permanently on disk."
    },
    learnCards: [
      {
        heading: "Opening Files",
        text: "• `open('file.txt', 'r')` — read mode\n• `open('file.txt', 'w')` — write mode (overwrites!)\n• `open('file.txt', 'a')` — append mode\n• Always use `with open(...) as f:` to auto-close!"
      },
      {
        heading: "Reading & Writing",
        text: "```python\nwith open('notes.txt', 'w') as f:\n    f.write('Hello Python!')\n\nwith open('notes.txt', 'r') as f:\n    content = f.read()\n    print(content)\n```"
      }
    ],
    activities: [
      {
        id: "L21_A1",
        type: "mcq",
        difficulty: "easy",
        question: "Which mode opens a file for READING in Python?",
        options: ["'w'", "'a'", "'r'", "'x'"],
        answer: "'r'",
        explanation: "`'r'` = read, `'w'` = write (overwrites), `'a'` = append, `'x'` = exclusive create.",
        xp: 15
      },
      {
        id: "L21_A2",
        type: "true_false",
        difficulty: "easy",
        question: "Opening a file in 'w' (write) mode will ERASE the existing file content.",
        options: ["True", "False"],
        answer: "True",
        explanation: "Write mode `'w'` starts fresh — it destroys existing content. Use `'a'` to append instead!",
        xp: 10
      },
      {
        id: "L21_A3",
        type: "fill_blank",
        difficulty: "medium",
        question: "Complete to safely read all lines from a file:",
        codeTemplate: `with open('data.txt', ____) as f:\n    lines = f.readlines()`,
        options: ["'r'", "'w'", "'a'", "'rb'"],
        answer: "'r'",
        explanation: "`'r'` mode is needed to read the file. `readlines()` returns a list of all lines.",
        xp: 20
      },
      {
        id: "L21_A4",
        type: "matching",
        difficulty: "medium",
        question: "Match the file method to what it does:",
        pairs: [
          { item: "f.read()", match: "Read entire file as string" },
          { item: "f.readlines()", match: "Read all lines as a list" },
          { item: "f.write('text')", match: "Write string to file" }
        ],
        explanation: "read() = whole file, readlines() = list of lines, write() = write string.",
        xp: 25
      },
      {
        id: "L21_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "File Keeper Prime",
        bossHp: 100,
        question: "What does this code do?\nwith open('log.txt', 'a') as f:\n    f.write('New entry\\n')",
        options: [
          "Creates log.txt and overwrites it",
          "Reads log.txt and prints it",
          "Appends 'New entry' to log.txt",
          "Deletes log.txt"
        ],
        answer: "Appends 'New entry' to log.txt",
        explanation: "Mode `'a'` = append. It adds to the end of the file without erasing existing content!",
        xp: 100
      }
    ]
  },

  22: { // Level 22: Advanced Python City
    intro: {
      title: "Advanced Python City",
      content: "Reach the pinnacle of school Python! Master exception handling with try-except, understand recursion, and tackle exam-level challenges."
    },
    learnCards: [
      {
        heading: "Exception Handling",
        text: "```python\ntry:\n    x = int(input('Enter number: '))\n    print(10 / x)\nexcept ZeroDivisionError:\n    print('Cannot divide by zero!')\nexcept ValueError:\n    print('Enter a valid number!')\n```"
      },
      {
        heading: "Recursion",
        text: "A function that calls ITSELF!\n```python\ndef factorial(n):\n    if n == 0:\n        return 1          # base case\n    return n * factorial(n - 1)  # recursive step\n```\n`factorial(5)` = 5×4×3×2×1 = 120"
      }
    ],
    activities: [
      {
        id: "L22_A1",
        type: "mcq",
        difficulty: "medium",
        question: "Which block in try-except runs when NO exception occurs?",
        options: ["except", "finally", "else", "catch"],
        answer: "else",
        explanation: "The `else` block runs only when the `try` block succeeds with no exception. `finally` always runs.",
        xp: 20
      },
      {
        id: "L22_A2",
        type: "output_prediction",
        difficulty: "hard",
        question: "What is printed?",
        code: `def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\nprint(fact(4))`,
        options: ["24", "10", "4", "Error"],
        answer: "24",
        explanation: "fact(4) = 4 × fact(3) = 4 × 3 × fact(2) = 4 × 3 × 2 × 1 = 24.",
        xp: 30
      },
      {
        id: "L22_A3",
        type: "find_bug",
        difficulty: "hard",
        question: "Find the bug in this exception handler:",
        code: `try:\n    result = 10 / 0\nprint(result)`,
        options: [
          "Missing except block after try",
          "10 / 0 is valid Python",
          "result should be a string",
          "No bug"
        ],
        answer: "Missing except block after try",
        explanation: "`try` must always be paired with at least one `except` or `finally` block!",
        xp: 35
      },
      {
        id: "L22_A4",
        type: "actual_code",
        difficulty: "hard",
        question: "Write a recursive function that returns the sum of 1 to n. Then call it with n=5 and print the result:",
        initialCode: `def sum_to(n):\n    if n == ___:\n        return ___\n    return n + sum_to(___)\n\nprint(sum_to(5))`,
        expectedOutput: "15",
        hints: [
          "Base case: if n == 0, return 0",
          "Recursive step: return n + sum_to(n - 1)"
        ],
        xp: 60
      },
      {
        id: "L22_A5",
        type: "boss_battle",
        difficulty: "hard",
        bossName: "Python Grandmaster",
        bossHp: 100,
        question: "What does this print?\ntry:\n    print(int('abc'))\nexcept ValueError:\n    print('Caught!')\nfinally:\n    print('Done')",
        options: ["Caught! Done", "Done", "Error", "Caught!"],
        answer: "Caught! Done",
        explanation: "`int('abc')` raises ValueError → 'Caught!' prints. `finally` ALWAYS runs → 'Done' prints.",
        xp: 100
      }
    ]
  }
};

// Helper generator to provide level content
export function getLevelContent(levelId) {
  // Check primary question bank first
  if (QUESTIONS_BANK[levelId]) {
    return QUESTIONS_BANK[levelId];
  }
  // Check extra levels bank (11, 12, 15, 16, 20, 21, 22)
  if (LEVELS_EXTRA[levelId]) {
    return LEVELS_EXTRA[levelId];
  }
  // Minimal emergency fallback (should never be reached with full content above)
  return {
    intro: {
      title: `Level ${levelId} Challenge`,
      content: `Welcome to Level ${levelId}! Apply your Python knowledge to solve new challenges.`
    },
    learnCards: [
      {
        heading: "Keep Practicing!",
        text: "Review previous levels and apply Python concepts to solve problems step by step."
      }
    ],
    activities: [
      {
        id: `L${levelId}_A1`,
        type: "mcq",
        difficulty: "medium",
        question: "Which built-in function removes duplicate values from a list most efficiently?",
        options: ["list.unique()", "set()", "remove_dup()", "distinct()"],
        answer: "set()",
        explanation: "`set()` removes duplicates instantly. Convert back with `list(set(data))`.",
        xp: 20
      },
      {
        id: `L${levelId}_A2`,
        type: "boss_battle",
        difficulty: "hard",
        bossName: `Level ${levelId} Guardian`,
        bossHp: 100,
        question: "What is `print(len(set([1, 2, 2, 3, 3, 3])))`?",
        options: ["6", "3", "1", "Error"],
        answer: "3",
        explanation: "`set()` removes duplicates leaving `{1, 2, 3}`, so `len()` is 3!",
        xp: 100
      }
    ]
  };
}

