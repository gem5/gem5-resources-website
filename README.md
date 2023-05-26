# gem5 Resources Website

This is the source code for the gem5 Resources website. It is built using [Next.js](https://nextjs.org/), a React framework for building static and server-side rendered websites.

# Table of Contents

- [gem5 Resources Website](#gem5-resources-website)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Maintaining the Website](#maintaining-the-website)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contributors](#contributors)

# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14.15.4 or higher)
- [npm](https://www.npmjs.com/) (v6.14.10 or higher)
- [git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended)

## Installation

1. Clone the repository

   ```bash
   git clone
    ```
2. Install dependencies
   ```bash
    npm install
    ```
3. Run the development server

   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Development

## Project Structure

The project is structured as follows:

- `gem5.config.js`: Contains the configuration for the gem5 Resources website including the databases and the tabs.
- `components`: Contains React components used throughout the website.
  - `components/tabs`: Contains the tabs used in the Resource page.
- `pages`: Contains the pages of the website. Each page is a React component.
  - `pages/api`: Contains the API routes of the website.
  - `pages/category`: Contains the .md documentation of what every category under gem5 Resources is.
- `public`: Contains static assets such as images, fonts, and favicons.
- `styles`: Contains global stylesheets and CSS modules.
- `__tests__`: Contains the jest unit tests for the website.
- `__mocks__`: Contains the jest mocks for the website.
- `cypress`: Contains the cypress integration tests for the website.
- `next.config.js`: Contains the configuration for the Next.js server.
- `docs`: Contains the documentation files for the website.


## Maintaining the Website

The instructions for maintaining the website are located in the [MAINTAINING.md](MAINTAINING.md) file.

# Deployment

The instruction for building and deploying the website are located in the [BUILDING.md](BUILDING.md) file.

# Contributing

If you find any bugs or have any suggestions, please open an issue or a pull request. For more information, please read the [gem5 Contributions page](https://www.gem5.org/contributing) file.

# License

The gem5 Resources website is licensed under the [LICENSE.md](LICENSE.md).

# Acknowledgements

The gem5 Resources website is built using the following open source projects:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
  
The gem5 Resources website is inspired by the following websites:

- [gem5.org](https://gem5.org/)
- [pub.dev](https://pub.dev/)

All logos and trademarks are property of their respective owners.

# Contributors

- [Parth Shah](https://github.com/helloparthshah)
- [Kunal Pai](https://github.com/kunpai)
- [Harshil Patel](https://github.com/harshil2107)
- [Arslan Ali](https://github.com/aarsli)

Special thanks to [Jason Lowe-Power](https://github.com/powerjg) and [Bobby R. Bruce](https://github.com/BobbyRBruce) for their guidance and support.
