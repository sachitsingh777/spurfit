# Spurfit

Spurfit is a React application designed to help users build and visualize workouts using a drag-and-drop interface. This project leverages `react-beautiful-dnd` for drag-and-drop functionality, `re-resizable` for resizable items, and `recharts` for data visualization.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Drag-and-Drop Interface**: Easily build and rearrange workout blocks.
- **Resizable Items**: Customize the size of each workout block.
- **Data Visualization**: Visualize your workout plan using bar charts.
- **Responsive Design**: Optimized for different screen sizes.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/spurfit.git
    cd spurfit
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm start
    ```

The application will be available at `http://localhost:3000`.

## Usage

- Click or drag the blocks from the left panel to build a workout.
- Rearrange blocks within the workout section or move them back to the left panel.
- Visualize the workout plan using the bar chart in the right panel.

## Project Structure

```sh
spurfit/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   └── CustomBar.js
│   ├── images/
│   │   ├── block1.png
│   │   ├── block2.png
│   │   ├── ...
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   └── ...
├── package.json
└── README.md
